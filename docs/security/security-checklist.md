# Security checklist: Monster Unleashed (concept)

**Reviewed:** 2026-11-06 (Stage 5) · **Stack:** Next.js 16.4.5, React 19.3.1, fully static site on Vercel

No website is unhackable. This records what is protected, how it was checked, and what is still at risk.

## Attack surface

| Area | Status |
|---|---|
| API routes / server actions / middleware | **None.** Every page is pre-built static HTML (`○ Static` in the build). |
| Forms, inputs, logins, accounts, database | **None.** Nothing a visitor types is sent or stored. |
| Payments | **None.** |
| Secrets / environment variables | **None needed.** `.env*` is git-ignored; `.env.example` is committed (fixed in this review: it was being ignored too). |
| Third-party scripts, trackers, CDNs | **None.** Fonts are self-hosted by `next/font`; videos, images and 3D are served from the site itself. |

## Done ✅

- **HTTPS only:** `Strict-Transport-Security` (2 years, subdomains, preload) and `upgrade-insecure-requests`. Vercel serves HTTPS by default.
- **Security headers on every page** (checked by e2e tests):
  - `Content-Security-Policy`: `default-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`
  - `X-Frame-Options: DENY` (no clickjacking), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy`: camera, microphone, geolocation, payment, USB all off
  - `Cross-Origin-Opener-Policy: same-origin`; `X-Powered-By` removed
- **No CSP violations** on any page, including with the 3D can loaded (e2e test).
- **XSS:** the only raw HTML is the JSON-LD block, built from constants and escaped (`<` → `<`). No `eval`, `innerHTML` or `document.write`.
- **External links:** all `target="_blank"` links have `rel="noopener noreferrer"`.
- **Code scan:** Semgrep, 0 errors, 0 warnings. Registry packs (`p/secrets`, `p/typescript`, `p/owasp-top-ten`, `p/react`, `p/nextjs`) plus custom React rules in `semgrep-react-rules.yml`. The custom rules are needed because the free `p/react` pack has only 4 rules; they were proven to fire on a deliberately bad test file first.
- **Secrets scan:** no keys, tokens or private keys in the code.
- **Dependencies:** `npm audit` reports **0 vulnerabilities** (production and dev).
  - The 8 moderate dev-only findings (a `minimatch` ReDoS inside the ESLint tooling) are fixed with a scoped `overrides` entry to `minimatch@^11.0.1`. Lint was re-verified to still work.
  - React was updated 19.3.0 → 19.3.1, plus patch updates. All 62 unit and 24 e2e tests re-run green.
  - No dependency runs install scripts (`preinstall`, `install` or `postinstall`).
  - `package-lock.json` is committed, so installs are reproducible.
- **Dependabot:** `.github/dependabot.yml` checks weekly and opens PRs for fixes.
- **Backups:** the full source is on GitHub; the site can be rebuilt from it anytime.

## Not applicable (and why)

Input validation, SQL injection, authentication and roles, CSRF, rate limiting, spam protection, Row Level Security, file uploads, and payment handling **do not apply**: the site has no server code, no inputs and no data store. **If a form or login is ever added, every one of these becomes required** before it ships.

## Still at risk ⚠️ (accepted, low)

1. **CSP allows `'unsafe-inline'` scripts and styles.**
   - Next.js static pages inject small inline scripts, and the animation libraries set inline styles.
   - A stricter nonce-based CSP would force every page to be rendered on each request (no longer static: slower, and more server surface).
   - With no user input anywhere, there is no path to inject a script, so the risk is low.
   - **Revisit if user content or forms are added.**
2. **Supply chain:** about 103 production packages (React, Next.js, three.js, GSAP, motion, Lenis). A compromised future release is the main realistic risk for any JS site.
   - Mitigations: lockfile, Dependabot, review update PRs before merging, and keep `npm audit` clean.
3. **Major versions not yet adopted:** TypeScript 7 and ESLint 10. No known security issues in the current versions; upgrade when convenient.
4. **No runtime error logging service** (like Sentry). It isn't needed for a static site; Vercel's deployment and request logs cover failures. Add one only if the site gets dynamic features.
5. **Third-party content:** the motocross clip shows Monster Energy branding (Pexels licence). This is a legal and branding note, not a hacking risk. Keep the "not affiliated" notice.

## How to re-check

```bash
npm audit                     # expect: found 0 vulnerabilities
npm test && npm run test:e2e  # headers, CSP, 404 and page-error tests included
pip install semgrep           # once
semgrep scan --config p/secrets --config p/owasp-top-ten --config docs/security/semgrep-react-rules.yml src
```
