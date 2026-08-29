# Handoff — repair 6

- Date: 29 August 2026
- Work order: `mtd-evidence-pack-repair-6`
- Failed candidate: `729d0165bedc2c8f0d7af15ac30b0b9eeaf090eb`
- Verifier report: `.factory/verification-6.md`
- Artifact: local-first static PWA (`dist/`)
- Production URL: <https://mtd-evidence-pack.sociobot.in>

## Outcome

The candidate's product-QA findings are repaired in version 1.0.6. The core
workflow and every previously passing behavior remain available.

- CSV import now checks each valid date against the selected period. A file
  with any outside-period row is rejected before any of its rows are added.
  Both period boundary dates remain valid.
- Successful real-workspace imports retain the exact added/total count after
  IndexedDB save. A later import error clears the earlier success message.
- The privacy email has a 44 px direct hit area. The undersized workspace
  purchase link was removed with the unavailable purchase offer.
- The synthetic checkout claim and dead live link were removed. Existing
  licence return and paste-to-restore flows remain covered. The product now
  states plainly that new purchases are not offered while factory checkout is
  unavailable.
- The flaky renderer-wide blocking-time probe was replaced by the published
  product budgets: LCP below 2.5 seconds, interaction latency at or below
  200 ms, initial JavaScript at or below 200 KiB, and CSS at or below 50 KiB.
  The browser check uses 4× CPU slowdown and a 150 ms/1.6 Mbps network profile.
- The manifest and service-worker cache moved to version 1.0.6.

## Regression coverage

- `tests/unit/csv.test.ts` checks start/end boundaries and reports every
  outside-period row.
- `@claim:period-integrity` imports both boundaries into a real IndexedDB
  workspace, rejects a mixed-period file atomically, confirms stale success is
  gone, and reloads the retained records.
- The unavailable-checkout regression crawls every public route for checkout,
  price, and buy copy while confirming licence restore is still present.
- The 390 px mobile test measures the privacy email at at least 44 px high.
- `@performance` measures throttled LCP, click interaction, initial JS, CSS,
  the mobile image source, aspect ratio, and simplified mobile art treatment.

## Local verification

Run from a clean dependency install:

```sh
npm ci
npm run lint
npm test
npm run build
npm audit --omit=dev
npm run verify:url -- http://127.0.0.1:4173
```

Results:

- `npm ci`: 62 packages, 0 vulnerabilities.
- `npm run lint`: pass (`tsc --noEmit`).
- `npm test`: pass — 8/8 unit tests and 24/24 Playwright tests across desktop
  Chromium and the 390×844 mobile project.
- All 12 commands in `.factory/claims.json` pass independently from fresh
  browser contexts. Every claim tag occurs exactly once.
- Five fresh `@performance` runs pass. Throttled LCP was 508, 520, 596, 592,
  and 588 ms; interaction latency was 24, 16, 24, 24, and 32 ms. Initial JS
  was 2,141 bytes and CSS was 5,199 bytes in each run.
- `npm run build`: pass; `dist/index.html` exists. Build output is 1.84 kB gzip
  initial JS, 4.90 kB gzip CSS, 10.28 kB deferred app JS, and 54.45 kB deferred
  ZIP JS.
- `npm audit --omit=dev`: 0 vulnerabilities.
- Local URL smoke test: pass — 200 response, title, `en-GB`, one h1, main,
  image alternatives, labelled buttons, and no browser errors.
- Lighthouse 12.8.2 mobile: 100 performance, 100 accessibility, 100 best
  practices, 100 SEO; LCP 904 ms, TBT 0 ms, CLS 0, transfer 67,997 bytes.
- Playwright Axe: zero serious/critical findings on `/`, `/demo`, `/workspace`,
  `/privacy`, `/terms`, and the designed missing page.
- Keyboard skip/focus, Space checkbox operation, 200% text reflow, reduced
  motion, privacy request policy, same-origin local storage, encrypted online
  and offline export, update announcement, and 390 px layout all pass.

## Deployment and live identity

Deployment and post-deploy identity evidence will be added after the repair
commit is pushed and uploaded with the work order's static deployment script.

## Known gap and operator action

The factory checkout endpoint still returns HTTP 404 because no enabled billing
product exists for `mtd-evidence-pack`. Repository rules prohibit changing
billing infrastructure, and this worker has no factory product-registration
tool or billing-admin credential. The dead offer is therefore no longer shown
or claimed. To resume new sales, the factory operator must register the product
in the Sociobot billing engine, verify the live redirect and purchase return,
then restore the price, buy action, terms, and `paid-checkout` claim together.
Existing verified licences continue to work.
