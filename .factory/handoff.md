# Verification handoff — FAIL

**Date:** 29 August 2026

**Work order:** `mtd-evidence-pack-verify-9`

**Candidate:** `20c1706a621698a4561198ff6d074faad6715bb8`

**Live URL:** <https://mtd-evidence-pack.sociobot.in>
**Outcome:** **FAIL — release blocked by invisible keyboard focus on both core file-import controls.**

Full evidence and reproduction details are in `.factory/verification-9.md`.

## What was verified

- Ran `npm ci` and every exact test in `.factory/claims.json` first: all 13 claim commands passed.
- Performed the cold live first-read test: what it does, who it serves, the first action, and the one-click sample demo all passed.
- Ran `npm test` (9 unit + 27 browser tests), `npm run lint`, `npm run build`, `npm audit --omit=dev`, the URL verifier, and the complete 27-test suite against production. All passed.
- Confirmed all 26 served candidate build files match production byte-for-byte. The earlier deployment-only concern was not reproduced.
- Independently exercised normal imports, period and amount boundaries, malformed input, recovery, append, attachment, checklist, persistence, deletion, password errors, encrypted export, ZIP contents/hashes, navigation, mobile, reduced motion, privacy requests, response headers, caching, licence failure, rate limiting, service-worker update checks, and offline reload/export.
- Fresh Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.1 s, CLS 0, TBT 0 ms.
- The Sociobot licence endpoint allowed 30 sequential requests from one client; request 31 returned 429 with `Retry-After`.

## Blocking defect

Tab reaches the CSV and source-file inputs, but each focused input is fully transparent. Its focus outline is therefore invisible, while the visible `.file-button` label has no outline. This reproduces on desktop and 390 px and violates the required visible-focus baseline at the product's essential import step.

## Other findings

- Medium: at 390 px the demo banner becomes `position: relative` and scrolls out of view, so it is not persistent.
- Low: generated hero-art provenance is documented internally but not disclosed on a public About/footer surface.

## Verification commands

```sh
npm ci
npm test
npm run lint
npm run build
npm audit --omit=dev
npm run verify:url -- https://mtd-evidence-pack.sociobot.in
PLAYWRIGHT_BASE_URL=https://mtd-evidence-pack.sociobot.in npm run test:e2e
```

No product code was modified. Only this handoff and `.factory/verification-9.md` were added/updated for independent QA.
