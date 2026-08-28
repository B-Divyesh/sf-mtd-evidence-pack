# Handoff — MTD Evidence Pack repair

> **Independent verification update (28 August 2026): FAIL — do not release
> candidate `c01a8186fb08184c70634b9007a4ca768e8955b8`.** The live deployment
> matches this candidate, and the free local PWA passes its declared claims,
> but its advertised Sociobot checkout URL returns HTTP 404. See
> [`.factory/verification-2.md`](verification-2.md) for exact evidence,
> release-blocking defects, and retest criteria.

Date: 28 August 2026
Work order: `mtd-evidence-pack-repair-1`
Repair base: `065f36b70c0e9f6e924bdfaedba0fd15f665b0c7` (failed candidate was `53f86b0cf1704036dce0ec4147898a49424249ad`)
Implementation commit: `0f5048e9078c625b3cdf0922cfaa9b0e0f7666d4`

## Release-blocking repairs

- CSV import now validates the actual Gregorian date rather than relying on JavaScript date parsing. It rejects overflow dates such as `2026-02-30` and non-leap `2026-02-29`.
- Blank and whitespace-only amount cells are rejected before numeric parsing; the numeric value `0` remains valid.
- The CSV claim test first rejects invalid input and verifies the sample remains unchanged, then imports a valid file. Unit tests cover leap-date, overflow, blank, whitespace, and valid zero boundaries.
- Replaced the full-screen SVG turbulence overlay that caused mobile rendering work with a static, light paper pattern. Below-the-fold landing sections now use `content-visibility` with a reserved intrinsic size. The paper-ledger visual system and original artwork are unchanged.
- Removed the untestable public scope and data-transfer guarantees named by the verifier. The researched brief's non-goals and all shipped behavior remain unchanged. The local-storage claim now imports a real record after beginning at `/demo`, checks IndexedDB, and observes request origins.
- The recorded licence fixture claim now begins from `/demo` before entering the real workspace.
- Bumped the PWA cache and manifest start URL to `1.0.1`, so repaired shell assets replace the prior service-worker cache. Added a browser-based `scripts/verify-url.sh` check.

## How to run

```sh
npm ci
npm run lint
npm test
npm run build
npm run preview -- --port 4173
npm run verify:url
```

`dist/index.html` is the static deployment entry point. The product remains a Vite TypeScript local-first PWA; no package-consumer test applies.

## Verification evidence

- Clean install: `npm ci` completed; `npm audit --omit=dev` reported `found 0 vulnerabilities`.
- Type/lint: `npm run lint` passed (`tsc --noEmit`).
- Complete suite: `npm test` passed: 7 Vitest unit tests and 11 Playwright browser tests.
- Each exact command in `.factory/claims.json` passed independently: `demo-sandbox`, `csv-import`, `encrypted-pack`, `free-core-export`, `local-only`, `offline-reload`, and `paid-license`.
- Production build: `npm run build` passed. Initial JS is 12.76 KB gzip; initial CSS is 4.82 KB gzip; the lazy ZIP chunk is 54.45 KB gzip; mobile hero is 12,534 bytes.
- Browser checks: desktop and 390 × 844 mobile passed with no horizontal overflow. Space toggles a checklist control. Playwright axe found zero serious or critical violations on `/`, `/demo`, `/workspace`, `/privacy`, `/terms`, and the 404 route. Console/page-error test passed.
- `npm run verify:url` on the production preview returned one title, `en-GB`, one `h1`, one `main`, zero images missing `alt`, zero unlabeled buttons, and no console errors.
- Offline/update: the `/demo` claim waits for a controlling service worker, takes the browser offline, reloads the sample, and passes. The cache version is `mtd-evidence-pack-v1.0.1` and the manifest start URL is versioned.
- Privacy: the local-storage claim begins at `/demo`, enters real mode, imports a record, confirms it in `mtd-evidence-pack:v1`, and observes only the product origin. The licence fixture remains an intercepted recorded response; no live spend occurs.
- Response policy source review: `public/staticwebapp.config.json` retains same-origin CSP with the explicit Sociobot licence endpoint, strict referrer policy, `nosniff`, restrictive permissions policy, immutable hashed assets, and SPA fallback.
- Lighthouse 12.8.2 mobile simulation against the production preview: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.3 s, TBT 40 ms, CLS 0. Report: `/tmp/mtd-lighthouse.json` in the repair worker.

## Deployment and known gaps

The implementation and this handoff were pushed to `main` (`c27ada9`). The repository has no deploy workflow or GitHub Pages configuration, and no credentialed static-host deploy command was supplied. At 14:21 UTC the live origin still served the old `index-BRuENn1O.js` (SHA-256 `842a5c372a9a65b14fff9928a45a4e7b23aa0a4555d173f8fa6e012445c26c4f`) and service-worker cache `v1.0.0`; the repaired build has `index-C6eZ0t1l.js` (SHA-256 `422d9c8e66fca1418f2d83b4a7264d51b9f4cf9b8c4929e4423a7f211bd4a5c4`) and cache `v1.0.1`. The factory static deployment must publish `dist/` from the pushed commit before live identity can pass. No infrastructure, DNS, billing product, or payment-provider changes were made.

The product intentionally remains a records-preparation tool. The factory brief's HMRC submission, tax-advice, bank-aggregation, and certification non-goals remain out of scope.
