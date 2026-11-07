# Quality report: Monster Unleashed (concept)

**Stage 6 · 2026-11-07** · Production build, tested in Chromium at phone (Pixel 7, 412 px), tablet (820 px) and desktop (1440 px).

## Automated test suite
| Suite | Result |
|---|---|
| Unit tests (Vitest) | **62 passed** |
| Browser tests (Playwright), desktop + phone | **73 passed**, 3 skipped (desktop-only / phone-only tests) |

The browser tests now cover:
- Every page at every size: **0 WCAG 2.2 AA violations** (axe-core). The checks were proven to catch injected errors first.
- **No sideways scrolling** on any page at any size.
- **Every internal link and #anchor** resolves; external links only go to the official site or Pexels, and open safely.
- **Every button and standalone link is ≥ 24 px**, meeting WCAG 2.2 target size.
- **Keyboard:** focus always visible, logical order, and the hidden header comes back when tabbed into.
- **Nothing scrolls by itself during load**, which protects the LCP metric.
- Plus the earlier key flows: nav, quiz, phone menu, reduced motion, security headers, CSP, 404, sitemap, share image, no hydration errors.

## Lighthouse (Google), production build
Mobile uses real 4× CPU + slow-4G throttling, median of 3 runs.

| Page | Mobile perf | Mobile LCP | Desktop perf | Accessibility | Best practices | SEO | CLS |
|---|---|---|---|---|---|---|---|
| Home | **95** | 1.7 s | **100** | 100 | 100 | 100 | 0 |
| About | **95** | 2.0 s | **100** | 100 | 100 | 100 | 0 |
| Ingredients | **95** | 2.1 s | **100** | 100 | 100 | 100 | 0 |
| Used By | **95** | 2.3 s | **100** | 100 | 100 | 100 | 0 |

All LCP values are under Google's 2.5 s "good" line. Lighthouse's default *simulated* mobile mode scores Home ~87 (it models JS cost pessimistically). Real-user data from PageSpeed Insights after launch is the final word.

## Issues found and fixed in this stage
1. **Home mobile LCP 4.5 s → 1.7 s.** The worlds strip's scroll-snap nudged itself 24 px sideways on load. Chrome treats any scroll as interaction and stops measuring LCP. Fixed with matching scroll-padding.
2. **About / Ingredients / Used By LCP 3.6 s → ~2 s.** Headlines waited for JavaScript before animating in. Their entrances are now pure CSS, so they start at first paint (same look).
3. **Phone: flat can covered the header and logo.** It now sizes to its space.
4. **Tablet: UNLEASH outline ran behind the headline.** It's now limited to the can column, and clipped without breaking the sticky can.
5. **Hidden header kept keyboard focus off-screen.** It now slides back in when anything inside it is focused.
6. **Small tap targets** ("See what's inside", footer links at 20–23 px) are now 32–44 px.
7. **SEO:** each page now declares its canonical URL; titles and descriptions confirmed unique.

## Still to verify after launch
- PageSpeed Insights on the live URL (real Vercel CDN, real devices over time).
- A manual pass with a real screen reader (NVDA on Windows or TalkBack on Android). Automated tools catch about a third of accessibility issues; the keyboard pass above covers more, but not everything.
- 3D can performance on a real mid-range Android phone. Test browsers have no GPU, so they always get the flat can.
