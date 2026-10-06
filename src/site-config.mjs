const configured = process.env.SITE_ORIGIN;
export let origin;
if (configured) {
  const url = new URL(configured);
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('SITE_ORIGIN must be an HTTPS origin with no path, query, or fragment.');
  }
  origin = url.origin;
}
export const indexable = Boolean(origin && process.env.SITE_INDEXABLE === 'true');
