import { writeFile, rm } from 'node:fs/promises';
import { origin, indexable } from '../src/site-config.mjs';
if (indexable) {
  await writeFile('out/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url></urlset>`);
} else {
  await rm('out/sitemap.xml', { force: true });
}
console.log(`Next.js static export ready in out/ (${indexable ? 'production indexing enabled' : 'preview indexing disabled'}).`);
