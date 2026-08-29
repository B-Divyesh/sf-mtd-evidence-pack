# MTD Evidence Pack — review round 5 handoff

- **Date:** 29 August 2026
- **Work order:** `mtd-evidence-pack-review-5`
- **Reviewed commit:** `de239265c9b3f1f179026b81b327a3bf3e2128ce`
- **Live URL:** <https://mtd-evidence-pack.sociobot.in>
- **Result:** FAIL — three minor findings remain; no blocking finding was observed.

## What was done

Completed the adversarial cold first-read review at 390 × 844 and 1440 × 900,
the full landing/README copy audit, one-click demo and storage-isolation checks,
all declared claim commands, route and link crawling, metadata and security
header checks, keyboard/mobile/accessibility checks, visual-identity review,
and a source-plus-live retest of every finding from reviews 1–4.

No product code was changed. The review is in `.factory/review-5.md`.

## How it was verified

From clean clone `/tmp/mtd-review5.r31qhn` at the reviewed commit:

- `npm ci` — PASS, zero vulnerabilities.
- All 16 exact commands in `.factory/claims.json`, run independently — PASS.
- `npm test` — PASS, 9 unit tests and 38 browser tests.
- `npm run build` — PASS; `dist/index.html` produced.
- `npm run lint` — PASS.
- `npm audit --omit=dev` — PASS.

Against production:

- `PLAYWRIGHT_BASE_URL=https://mtd-evidence-pack.sociobot.in npm run test:e2e`
  — PASS, 38 browser tests.
- `npm run verify:url -- https://mtd-evidence-pack.sociobot.in` — PASS.
- Fresh mobile and desktop first reads, one-click demo/reset, request logging,
  storage inspection, full route metadata checks, response-header checks, and
  an all-route link crawl — PASS.
- Unfiltered Axe audit — one moderate violation on `/workspace`, recorded as
  F-5-1.
- Clean local and live `asset-manifest.json` files are identical.

## Known gaps and next steps

- `F-5-1`: replace the nested workspace `aside` landmark and make the Axe gate
  reject moderate violations.
- `F-5-2`: correct and enforce the Node.js support range, then declare and test
  that compatibility statement.
- `F-5-3`: rename the final README heading to “Source code licence.”

After those repairs, rerun all 16 claim commands, the full local and live
browser suites, the unfiltered Axe audit, and review round 6 from fresh browser
contexts.
