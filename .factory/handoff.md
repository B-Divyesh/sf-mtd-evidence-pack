# Handoff — independent verification 6

- Date: 29 August 2026
- Work order: `mtd-evidence-pack-verify-6`
- Candidate: `729d0165bedc2c8f0d7af15ac30b0b9eeaf090eb`
- Live URL: <https://mtd-evidence-pack.sociobot.in>
- Full report: `.factory/verification-6.md`

## Status

**FAIL — do not release.** Production matches the candidate, but two fresh
high-severity blockers remain:

1. `npm test` fails the checked-in 200 ms mobile blocking-time assertion at
   326 ms. Three focused local retries fail at 354/273/355 ms, and the live
   suite fails at 314 ms.
2. The advertised £24 Sociobot checkout URL returns HTTP 404
   `{"error":"enabled factory product","status":404}`. New buyers cannot
   purchase the supported edition.

Medium findings: a 2025 transaction imports silently into the selected 2026
quarter, and the workspace purchase/privacy-email links have direct mobile hit
areas below 44 px. Real import feedback is also overwritten by a generic save
message and can remain visible beside an import error.

## What passed

- `.factory/claims.json` exists; all 12 exact claim commands pass after `npm ci`.
- `npm run lint`, `npm run build`, and `npm audit --omit=dev` pass.
- All 7 unit tests and the other 22 Playwright checks pass.
- The cold first screen states the job, user, first action, and one-click sample
  result in plain words on desktop and 390 px mobile.
- A fresh real workspace imports/appends records, retains source files and a
  custom checklist, recovers from invalid CSV/passwords, exports a correctly
  encrypted ZIP with valid hashes, and deletes only after confirmation.
- The demo reloads and exports offline after one visit. The live service worker
  caches every app/export/ZIP chunk.
- Complete real use makes only same-origin requests and logs no browser errors.
- Axe finds zero serious/critical issues on every route; keyboard, focus,
  reduced motion, 390 px, 200% text reflow, titles/landmarks, and real 404 pass.
- Three Lighthouse mobile runs score 100 for performance, accessibility, best
  practices, and SEO. The repository gate still controls.
- Licence verification enforces 30 requests per client window; request 31
  returns 429 with `Retry-After`.
- SHA-256 parity passes for all 26 publicly served build artifacts.

## Reproduce

```sh
npm ci
npm run lint
npm test
npm run build
npm run verify:url -- https://mtd-evidence-pack.sociobot.in
PLAYWRIGHT_BASE_URL=https://mtd-evidence-pack.sociobot.in npm run test:e2e
curl -i https://api.sociobot.in/api/v1/products/mtd-evidence-pack/checkout
```

Evidence screenshots and Lighthouse JSON are in
`.factory/verification-evidence/`. No product code was changed.
