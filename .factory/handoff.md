# Polish 3 handoff — PASS

- **Date:** 29 August 2026
- **Work order:** `mtd-evidence-pack-polish-3`
- **Base candidate:** `98b8d642c99b5b0f4192e47f5ffbc4d267973459`
- **Product repair commit:** `19824e2932b7a2e8fedd406c3b3b9f88aeb0eda1`
- **Deployment:** `3281c41f-0fc8-4b5e-ba2e-baa8914d699f`
- **Live URL:** <https://mtd-evidence-pack.sociobot.in>
- **Decision:** **PASS** — every cumulative adversarial finding is repaired and retested.

## What changed

- Made the first-screen sample result concrete: 12 records, three source files, and one open check.
- Replaced all public “core pack” wording with the single artifact name, **evidence pack**.
- Added and tested `sample-content`, `no-tax-submission`, and `artwork-provenance` claims; expanded free-workflow and licence-destination claims.
- Made every declared claim test begin at the isolated demo path before it moves into a real local workspace where needed.
- Repaired the README Privacy URL, then added a regression test for the absolute live-product link.
- Bumped the PWA cache/build version to `1.0.10` so the deployed service worker receives the new shell.
- Preserved the paper-moon ledger visual system, visible file-input focus ring, sticky mobile demo banner, public generated-art disclosure, real routes, route metadata, designed 404, and local-first behavior.

## How to run and verify

```sh
npm ci
npm test
npm run lint
npm run build
npm audit --omit=dev
npm run verify:url -- http://127.0.0.1:4173
```

Every exact command in `.factory/claims.json` was also run independently from a fresh clone at `/tmp/mtd-evidence-pack-polish3.GvEPQT` for product commit `19824e2`. All 16 claims passed. The clean clone then passed `npm test` (9 unit, 35 browser), lint, build, and audit with zero vulnerabilities. The final local suite, including the README-link regression, passed 9 unit and 36 browser tests.

Production verification passed with:

```sh
PLAYWRIGHT_BASE_URL=https://mtd-evidence-pack.sociobot.in npm run test:e2e
npm run verify:url -- https://mtd-evidence-pack.sociobot.in
```

The live browser suite passed 35 tests. Axe found no serious or critical issue on every route and the designed 404. Cold live checks confirmed all expected product routes return 200, unknown routes return the designed 404, titles/descriptions/canonicals are route-specific, and 390 px has no horizontal overflow. Live Lighthouse mobile scored 100/100/100/100 (Performance/Accessibility/Best Practices/SEO), with LCP 1.0 s, TBT 80 ms, and CLS 0.

Evidence screenshots and the Lighthouse report are in `.factory/polish-evidence-3/`.

## Known gaps and next steps

None. The product intentionally does not submit tax returns, calculate tax, connect to banks, or provide tax advice; it prepares a local evidence pack for compatible filing software or an accountant.
