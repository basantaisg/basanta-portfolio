# Responsive design audit

The owner reported that the page appeared narrow, with too much equal space on both sides of a 24-inch monitor compared with a 13-inch MacBook. The local source limited every main section to 1,200px of content. This audit edits that local source; it does not establish that the same revision is deployed at https://www.basantaparajuli.com.

## Changes

- Wider desktop canvas: 1,680px content cap, increasing to 2,000px above a 2,200px CSS viewport width.
- Fluid side padding from 20px to 64px, increasing to 80px on the largest monitors.
- Headline size responds to its text column, with a fallback for browsers without container units. The orange phrase begins on its own line.
- Hero, work samples, section headings, approach, about, and booking use a less crowded tablet layout below 961px. The portrait and sample excerpt share a row on tablets and stack below 651px.
- Grid columns can shrink to their available width. Captions and footer links can wrap. Portrait width remains bounded at 560px on desktop and 480px on phones.
- Paragraph widths remain bounded separately from the page width for readable samples, descriptions, and personal introduction.
- Public copy, honest sample labels, contacts, booking destinations, colors, and reduced-motion behavior preserved.

## Width comparison

These are calculations from CSS rules, not browser measurements. They assume a full-width browser window and omit any scrollbar width.

| CSS viewport | Previous content width | Updated content width | Previous margin per side | Updated margin per side |
| --- | ---: | ---: | ---: | ---: |
| 1280px | 1200px | 1178px | 40px | 51px |
| 1440px | 1200px | 1325px | 120px | 58px |
| 1920px | 1200px | 1680px | 360px | 120px |
| 2560px | 1200px | 2000px | 680px | 280px |

## Verification

Passed: optimized Next.js build and static export, exported content and links, sample disclosures, contrast token checks, simulated motion lifecycle, browser-runner syntax, and Git whitespace validation.

Live inspection was attempted through the web reader and direct shell requests, but the URL could not be fetched and shell DNS resolution failed. This is an access limitation in the testing environment, not a finding that the owner's website is unavailable.

Actual browser verification did not run: the local server failed with EPERM, installed Chrome aborted during headless startup (exit 134), and Playwright/Axe dependencies are unavailable. No visual screenshots, browser overflow results, keyboard results, accessibility-scan results, zoom results, or Lighthouse scores are claimed.

The browser runner now includes 17 homepage profiles from 320px to 2560px, both sides of important layout transitions, Retina laptop profiles, landscape/reflow, expanded samples, balanced margins, desktop content-width checks, motion/reduced motion, and eight 404 widths. Run `npm run qa` after completing the browser setup in README.md, then inspect its screenshots on laptop and monitor. Use matching browser zoom levels when comparing screens.

These source changes have not been pushed or deployed by the agent. They need a deployment before the live URL reflects them.
