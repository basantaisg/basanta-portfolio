import { origin, indexable } from '../site-config.mjs';
export const dynamic = 'force-static';
export default function robots() {
  return {
    rules: { userAgent: '*', ...(indexable ? { allow: '/' } : { disallow: '/' }) },
    ...(indexable ? { sitemap: `${origin}/sitemap.xml` } : {}),
  };
}
