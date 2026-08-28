# Handoff — MTD Evidence Pack repair

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

The work order specifies static deployment from `dist/`. Pushing `main` is the available deployment trigger; verify the live origin serves the repaired `v1.0.1` cache after the factory static deployment completes. No infrastructure, DNS, billing product, or payment-provider changes were made.

The product intentionally remains a records-preparation tool. The factory brief's HMRC submission, tax-advice, bank-aggregation, and certification non-goals remain out of scope.
