import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import { business as b } from '../src/content.mjs';
import { origin, indexable } from '../src/site-config.mjs';
// Remove Next.js hydration payloads so checks inspect rendered markup, not serialized duplicates.
const fullHTML = await readFile('out/index.html', 'utf8');
const html = fullHTML.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'Duplicate element IDs');
assert.equal((html.match(/<h1\b/g) || []).length, 1, 'One descriptive H1 required');
for (const match of html.matchAll(/href="#([^"]+)"/g)) {
  assert(ids.includes(match[1]), `Missing anchor: ${match[1]}`);
}
for (const match of html.matchAll(/(?:href|src)="(\/(?:assets|_next)\/[^"#]+)"/g)) {
  await access('out' + match[1]);
}
assert(html.includes(b.booking), 'Booking destination missing');
assert(html.includes('mailto:' + b.email), 'Email fallback missing');
for (const [, url] of b.socials) assert(html.includes(url), 'Social destination missing');
assert.equal((html.match(/<details>/g) || []).length, b.samples.length, 'All samples need working native disclosures');
assert(!/video scripts?|sales-video script|webinar scripts?/i.test(html), 'Removed script services must not appear in public copy');
assert.equal(b.services.length, 2, 'Only email sequences and landing pages are primary services');
assert(html.includes('VSL landing page'), 'VSL landing-page scope missing');
assert.equal(html.split(b.sampleLabel).length - 1, b.samples.length * 2 + 1, 'Samples must be labeled in cards, expanded content, and hero');
assert(!html.includes('—') && !html.includes('&#8212;') && !html.includes('&mdash;'), 'Public copy must contain no em dashes');
for (const sample of b.samples) {
  assert(html.includes(`id="sample-${sample.id}"`));
  for (const part of sample.parts) assert(html.includes(part.heading.replace(/&/g, '&amp;').replace(/'/g, '&#x27;')), `Missing sample section: ${part.label}`);
}
assert(html.includes('aria-controls="navigation"'), 'Accessible navigation control missing');
assert(html.includes('Skip to content'), 'Skip link missing');
assert(fullHTML.includes('application/ld+json'), 'Identity metadata missing');
assert(html.includes(b.title.replace(/&/g, '&amp;')), 'Title missing');
const css = await readFile('src/app/globals.css', 'utf8');
assert(css.includes('prefers-reduced-motion'), 'Reduced motion missing');
assert(css.includes(':focus-visible'), 'Keyboard focus styles missing');
const luminance = hex => {
  const rgb = hex.replace('#', '').match(/../g).map(x => parseInt(x, 16) / 255).map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
};
for (const [name, fg, bg] of [
  ['body', '#f4f1ea', '#0d0e10'], ['muted body', '#b8bcc3', '#0d0e10'],
  ['muted panel', '#b8bcc3', '#17191d'], ['button', '#141210', '#ff6b2c'],
  ['paper body', '#141210', '#f4f1ea'], ['paper muted', '#5b5852', '#f4f1ea'],
  ['about accent', '#ad3d0c', '#f4f1ea'],
]) {
  const [light, dark] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  const contrast = (light + .05) / (dark + .05);
  assert(contrast >= 4.5, `${name} fails contrast`);
  console.log(`${name}: ${contrast.toFixed(2)}:1`);
}
const robots = await readFile('out/robots.txt', 'utf8');
if (indexable) {
  assert(robots.includes('Allow: /'));
  const canonicalTag = html.match(/<link[^>]*rel="canonical"[^>]*>/)?.[0];
  const canonicalHref = canonicalTag?.match(/href="([^"]+)"/)?.[1];
  assert(canonicalHref, 'Production canonical missing');
  assert.equal(new URL(canonicalHref).href, new URL(origin + '/').href, 'Incorrect production canonical');
  assert((await readFile('out/sitemap.xml', 'utf8')).includes(origin));
} else {
  assert(html.includes('content="noindex, nofollow"'), 'Preview must have noindex metadata');
  assert(robots.includes('Disallow: /'));
  assert(!(await readdir('out')).includes('sitemap.xml'), 'Preview sitemap must be omitted');
  if (!origin) assert(!html.includes('rel="canonical"'), 'Unconfirmed preview must not invent a canonical');
}
await access('out/assets/social-card.png');
const errorHTML = await readFile('out/404.html', 'utf8');
assert(errorHTML.includes('Back to the homepage'));
assert(!errorHTML.includes('—') && !errorHTML.includes('&mdash;'), '404 must contain no em dashes');
console.log('PASS: exported content, anchors, local assets, contacts, sample disclosures, contrast tokens, metadata, and 404. Browser checks remain separate.');
