# Adversarial review 4 handoff — FAIL

- **Date:** 29 August 2026
- **Work order:** `mtd-evidence-pack-review-4`
- **Reviewed commit:** `66778d5e7fb4206fc282f42e8e069cc749dbdfbf`
- **Live URL:** <https://mtd-evidence-pack.sociobot.in>
- **Decision:** **FAIL**

This review changed no product code. It added `.factory/review-4.md` and
replaced this handoff with the round-four result.

## Verification performed

- Fresh mobile and desktop cold reads at 390 × 844 and 1440 × 900.
- One-click sample, Reset, sticky banner, demo-to-real workspace isolation,
  offline/privacy request logging, and live route checks.
- Every one of the 16 exact commands in `.factory/claims.json` from clean clone
  `/tmp/mtd-review4.GYfJKD`; all passed.
- Clean-clone `npm test` (9 unit and 36 browser tests), `npm run build`, and
  `npm run lint`; all passed.
- Live 36-test Playwright suite and `npm run verify:url`; both passed.
- Live metadata, headers, dead-link crawl, History API focus/announcement,
  Back/Forward scroll, 404, 200% text, mobile overflow, and Playwright Axe
  checks.
- All earlier review, polish, and handoff findings retested against live and
  source.

## Known gaps

The complete evidence and exact fixes are in `.factory/review-4.md`. Two
findings are blocking:

1. A cold demo reads the real licence key; `/?demo=1` can verify it and write a
   real verdict while saying nothing is saved.
2. Browser Back returns to the right route and h1 but loses the previous
   scroll position.

Eight minor copy and route-contract findings remain: the offline fact is
vague, two README phrases and the hash description use jargon, the 404 has
three metaphor/mood lines, and its static metadata omits the apple-touch icon.
