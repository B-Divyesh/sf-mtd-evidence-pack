# Adversarial review 3 handoff — FAIL

- **Date:** 29 August 2026
- **Work order:** `mtd-evidence-pack-review-3`
- **Candidate:** `4479080b405d76a64ceb50175afc42e73d56d008`
- **Live URL:** <https://mtd-evidence-pack.sociobot.in>
- **Decision:** **FAIL** — seven minor findings, no blocking findings

## What was done

- Reviewed the live first screen cold at 390 × 844 and 1440 × 900.
- Audited every landing-page and README copy item with word counts.
- Entered the one-click sample, changed and reset it, and confirmed existing
  real data remained unchanged.
- Recorded requests through the real → demo → reset → real flow; all were
  same-origin.
- Read all prior adversarial reviews, polish reports, and the previous handoff;
  verified every earlier finding in live behavior and current source.
- Checked metadata, routes, Back behavior, h1 focus, links, 404, keyboard,
  mobile reflow, reduced motion, visual identity, and accessibility.
- Ran all 13 exact `.factory/claims.json` commands independently from a clean
  checkout.
- Wrote `.factory/review-3.md`. Product code was not modified.

## Verification

Clean checkout: `/tmp/mtd-review3-clean.CHtegF`

```sh
npm ci
# Run each exact "test" command in .factory/claims.json independently.
npm test
npm run build
npm run lint
npm audit --omit=dev
PLAYWRIGHT_BASE_URL=https://mtd-evidence-pack.sociobot.in npm run test:e2e
npm run verify:url -- https://mtd-evidence-pack.sociobot.in
```

Results: every claim command passed; `npm test` passed 9 unit and 32 browser
tests; build, lint, audit, and URL verification passed; the live suite passed
32/32. The designed unknown route returned HTTP 404 and all crawled public
targets returned their expected status.

## Remaining work

See F-3-1 through F-3-7 in `.factory/review-3.md`. The required next pass is to
declare and test the remaining no-submission, free-feature, licence-destination,
artwork-provenance, and sample-content statements; standardise “evidence
pack”; and repair the README Privacy URL. No deployment was performed.
