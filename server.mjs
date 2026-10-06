import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
const root = resolve('out');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.woff2':'font/woff2','.ico':'image/x-icon','.svg':'image/svg+xml','.png':'image/png','.txt':'text/plain; charset=utf-8','.xml':'application/xml'};
const server = createServer(async (req,res) => {
  const headers = {'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','X-Robots-Tag':'noindex, nofollow','Cache-Control':'no-store','Content-Security-Policy':"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"};
  try {
    const url = new URL(req.url, 'http://localhost');
    const relative = decodeURIComponent(url.pathname);
    let file = resolve(root, '.' + relative);
    if (!file.startsWith(root + sep) && file !== root) {res.writeHead(403,headers);res.end('Forbidden');return;}
    if (file === root) file = resolve(root,'index.html');
    if ((await stat(file)).isDirectory()) file = resolve(file,'index.html');
    const data = await readFile(file);
    if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405,{...headers,Allow:'GET, HEAD'});res.end();return;}
    res.writeHead(200,{...headers,'Content-Type':types[extname(file)]||'application/octet-stream'});
    res.end(req.method==='HEAD'?undefined:data);
  } catch {
    res.writeHead(404,{...headers,'Content-Type':'text/html; charset=utf-8'});res.end(await readFile(resolve(root,'404.html')));
  }
});
server.on('error', error => {
  console.error(`Cannot start the local preview: ${error.code}. Run npm run preview in a terminal with permission to bind a local port.`);
  process.exitCode = 1;
});
server.listen(Number(process.env.PORT || 3000), '127.0.0.1', ()=>console.log(`Preview: http://localhost:${server.address().port}`));
