# Basanta Parajuli — Next.js portfolio

A responsive, single-page portfolio positioning Basanta as a business marketing partner for finance coaches and financial consultants, built with Next.js App Router, React, and ordinary CSS. The partnership covers offer research, messaging, email sequences, and landing pages. Uses charcoal, warm off-white, and orange; three readable illustrative portfolio projects; service scope; approach; personal introduction; and the supplied Calendly, email, X, and Instagram destinations.

The portfolio focuses on two primary services: email sequences and landing-page copy. The latest positioning leads with "Your marketing partner for finance businesses," while retaining concrete deliverables in the supporting copy and services. VSL work means written copy surrounding an existing video sales letter. Standalone video-script services and their sample were removed. The portfolio now includes a conventional landing page, an email sequence, and a VSL landing page. All remain explicitly fictional, illustrative work.

## Run locally

Requires Node.js 20.9 or later.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For the production static export:

```sh
npm run build
npm run check
npm run check:motion
npm run preview
```

The finished website is exported to `out/`. `npm start` also serves this export. Development uses the Next.js server; production preview serves the files created by Next.js.

## Editing

- `src/content.mjs`: business identity, contact destinations, hero, services, approach, and the complete demonstration projects. `evidenceStatus` is private content tracking and is not rendered.
- `src/app/page.jsx`: homepage composition, about copy, fit criteria, final CTA, and footer.
- `src/components/portfolio.jsx`: native, keyboard-accessible work disclosures with selectable text.
- `src/components/navigation.jsx`: mobile menu. Navigation is visible when JavaScript is disabled; it collapses into a menu after hydration.
- `src/app/globals.css`: colors, spacing, typography, responsive rules, hover effects, and reduced-motion preferences.
- `src/lib/motion.mjs` and `src/components/motion-effects.jsx`: one-time CSS entrances, 420ms/12px with a capped 70ms stagger. No animation dependency is needed. Link and button transitions take 180ms.
- `src/app/layout.jsx`: metadata and identity-only structured data.
- `public/assets/`: portrait, favicon, and branded sharing image. The optional macOS script `scripts/social-card.swift` regenerates the PNG.

Motion runs after hydration, respects live reduced-motion changes, ends when keyboard focus enters a moving block, and cleans up on unmount. Work samples animate only on their first opening. Content is visible without JavaScript or Intersection Observer support. Decorative service icons, the handwritten underline, card elevation, and the reading-progress effect were removed in the copy/design audit. Verification limits are recorded below and in [qa/verification.md](qa/verification.md).

Replace illustrative projects with approved public work through `src/content.mjs`. Preserve each project's status label until commissioned work is verified. Add outcomes or testimonials only with supporting evidence and permission to publish. There are no invented clients, prices, guarantees, or turnaround promises.

The owner supplied `bakadwg.png` as his personal brand image. Its orange background fits the site; an 840px WebP version (about 44 KB) is used in the hero and as the header avatar. The original 1.5 MB file is preserved. Image dimensions reserve space before loading, and the hero image is preloaded. Replace `public/assets/basanta-portrait.webp` to update the portrait. The orange tokens remain unchanged for readable contrast.

## Deployment

This project follows the official [Next.js static export workflow](https://nextjs.org/docs/app/guides/static-exports). Deploy the `out/` directory to a static host; use `npm run build` as the build command. For Vercel, import the GitHub repository using the Next.js preset. The checked-in `vercel.json` sets `npm ci` and `npm run build`; keep the Output Directory at the framework default. The project root is the repository root. For other hosts, configure unknown URLs to serve `404.html` with a 404 status.

Until the production domain is confirmed, the export uses `noindex, nofollow` and robots disallow rules, with no invented canonical URL or sitemap. When the exact HTTPS production origin is confirmed, configure:

```sh
SITE_ORIGIN=https://your-confirmed-domain.com SITE_INDEXABLE=true npm run build
SITE_ORIGIN=https://your-confirmed-domain.com SITE_INDEXABLE=true npm run check
```

Use the real hostname in place of the example. This enables canonical and absolute sharing URLs, indexable robots rules, and a sitemap. Rebuild after changing these variables. `.env.example` documents the settings. The local preview server always sends a noindex header.

### Vercel and a custom domain

1. Import the public GitHub repository at https://vercel.com/new. Use the Next.js preset, repository root, and `main` production branch.
2. Deploy with preview indexing disabled until the production hostname is confirmed.
3. In the Vercel project, open Settings → Domains and add the domain you own. Use the exact DNS records shown for that project at your DNS provider. Preserve existing email records.
4. Set `SITE_ORIGIN` to the exact preferred HTTPS hostname and `SITE_INDEXABLE=true` for the **Production** environment only. Leave preview environments non-indexable. Redeploy after changing these variables.
5. Verify HTTPS, preferred apex/www routing, booking and email links, canonical metadata, `robots.txt`, and `sitemap.xml` on the live deployment.

No paid service or domain purchase is required by this repository, and no domain has been purchased or connected. Website publication has not been performed in this environment.

Official guides: [Git imports](https://vercel.com/docs/git), [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs), [custom domains](https://vercel.com/docs/domains/working-with-domains/add-a-domain).

Private business instructions, internal content-status notes, source portrait files, environment files, tool settings, and generated output are excluded by `.gitignore`. The optimized public portrait and sharing images are included.

## Verification and remaining checks

Verified in this environment:

- Next.js optimized production build and static export.
- Rendered content, section anchors, all local HTML asset references, supplied contact URLs, and the custom 404.
- Three complete native portfolio disclosures, seven visible illustrative-work labels, and zero em dashes in the exported homepage and 404.
- Preview indexing protections and production metadata/sitemap configuration.
- Text color token contrast from 5.40:1 to 17.12:1, including dark button text on orange at 6.58:1.
- Motion lifecycle in a simulated DOM: reduced-motion startup/change, reveal activation, one-time sample openings, focus cancellation, and unmount cleanup. This does not establish browser behavior.

Actual responsive browser inspection, keyboard behavior, 200% zoom, runtime console checks, automated accessibility scanning, and Lighthouse were **not verified** here. The execution environment denied local port binding (`EPERM`) and terminated Chrome during launch. Next.js build success and source checks do not establish that browser checks passed.

A browser QA script is included. On a machine that permits local servers and browser execution:

```sh
npm install --save-dev playwright @axe-core/playwright
npx playwright install chromium
npm run build
npm run preview
# In another terminal:
npm run qa
```

You may use a local Chrome installation with `CHROME_PATH` instead of downloading Chromium. `QA_URL` overrides the default http://localhost:3000. The script checks 320, 360, 390, 768, and 1440px, expanded samples, mobile menu dismissal, skip-link focus, console/resource errors, Axe accessibility, and reading/navigation without JavaScript. It also checks landscape, reflow at half desktop width, one-time CSS entrances at 390px and 1440px, sample reopening, and live reduced-motion cancellation. The 404 is checked at 360, 390, 768, and 1440px as well. Reports and screenshots are written under `qa/`; inspect those visually and manually test actual 200% browser zoom. External appointments and messages are never created by the checks.
