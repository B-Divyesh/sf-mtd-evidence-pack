# Independent verification 13 — PASS

- **Work order:** `mtd-evidence-pack-verify-13`
- **Candidate commit:** `2338d2ce1af44aef08e306b5649e523c8c5ca9fc`
- **Verified URL:** <https://mtd-evidence-pack.sociobot.in>
- **Date:** 29 August 2026
- **Decision:** **PASS**

Fresh verification finds no reproduction of a deployment-only failure. The live
site is the production build of the tested candidate: version `v1.0.12` is
shown in the footer, and SHA-256 byte comparison matched the local build for
all 23 published files (HTML, JS, CSS, images, icons, manifest, service
worker, offline/404 resources, and asset manifest). `staticwebapp.config.json`
is intentionally host configuration rather than a public resource; its public
request correctly returns the designed 404.

## First read (cold live context)

The first screen says **“Prepare your quarterly evidence pack.”** It says it is
for **UK sole traders who keep local books** and need a pack for **an accountant
or filing software**. The visible primary action is **“Try it with sample
data,”** explained immediately as loading 12 records, three source files, and
one open check without saving anything. This answers what it does, for whom,
and what to click first in plain words. It is a one-click demo, so the
first-read/demo gate passes.

## Mandatory claims — executed first from this clean checkout

`.factory/claims.json` exists. After `npm ci` (62 packages added; 0 reported
vulnerabilities), every exact declared command below was run separately before
the broader QA. Each was a fresh Playwright run against the local demo entry
point and passed (one test per command; individual command logs are
`/tmp/mtd-claim-<id>.log` in the verification container).

| Claim | Result |
| --- | --- |
| `demo-sandbox` | PASS |
| `sample-content` | PASS |
| `csv-import` | PASS |
| `period-integrity` | PASS |
| `source-file-size` | PASS |
| `encrypted-pack` | PASS |
| `free-evidence-pack` | PASS |
| `local-only` | PASS |
| `offline-reload` | PASS |
| `custom-checklist` | PASS |
| `readiness` | PASS |
| `standalone-install` | PASS |
| `paid-license` | PASS |
| `checkout-unavailable` | PASS |
| `no-tax-submission` | PASS |
| `artwork-provenance` | PASS |
| `node-runtime` | PASS |

The checks cover normal CSV import plus malformed date/amount recovery,
atomic out-of-period rejection, date boundaries, 10 MB source-file boundary,
encrypted ZIP contents/password/hash checks, readiness and persistent custom
checks, unlicensed export, demo isolation, no-HMRC submission, local storage,
and offline export. The Node claim additionally completed a clean install and
production build using the documented Node 20.19.0 lower bound.

## Local build and deployed suite

- `npm test`: **PASS** — 9 Vitest unit tests and 39 Playwright tests.
- `npm run lint`: **PASS** — `tsc --noEmit`.
- `npm run build`: **PASS** — creates `dist/index.html`.
- `npm run verify:url -- http://127.0.0.1:4174/`: **PASS** — title, language,
  exactly one h1, main landmark, image alternatives, labelled buttons, and no
  browser errors.
- `PLAYWRIGHT_BASE_URL=https://mtd-evidence-pack.sociobot.in npm run test:e2e`:
  **PASS** — all 39 live tests (`test-results/.last-run.json` reports
  `status: passed`, no failed tests).

The initial landing scripts are 12.8 KB gzip (2.0 KB bootstrap + 10.8 KB app)
and CSS is 5.0 KB gzip. The lazy encrypted-export chunks bring all JavaScript
to 69.5 KB gzip, below the 200 KB static/PWA budget. CSS is below the 50 KB
budget; there are no webfonts and the mobile hero is 4.9 KB.

## Independent browser, privacy, PWA, and platform evidence

- Cold live navigation made only same-origin requests: document, local JS/CSS,
  and local hero art. There were no console or page errors. The deployed full
  flow independently passes the `local-only` request-log assertion after real
  import. No analytics, CDN font, HMRC, bank, or AI request was observed.
- `/`, `/demo`, `/workspace`, `/privacy`, `/terms`, `robots.txt`, and
  `sitemap.xml` return 200. An unknown route returns the designed 404 with HTTP
  404.
- The live full suite passes unfiltered axe checks on every audited route (zero
  violations), keyboard operation including Space on checklist controls,
  skip-link/focus routing, history/focus restoration, 390 px layout, 200% text
  reflow, demo banner visibility, and reduced-motion behavior. Fresh desktop
  and 390 px visual inspection show the product-specific paper-ledger design;
  no horizontal overflow was found (`scrollWidth === clientWidth === 390`).
- In a fresh 390 px context, `/demo` gained controller
  `https://mtd-evidence-pack.sociobot.in/sw.js`, active cache
  `mtd-evidence-pack-v1.0.12`, then reloaded offline without errors and restored
  the 12-record/three-source-file demo. The live suite separately verifies
  service-worker update announcement and offline encrypted export.
- The document response sends HSTS, `nosniff`, strict-origin referrer policy,
  restrictive permissions policy, and a response-header CSP with
  `frame-ancestors 'none'`. HTML uses 30-second revalidation; hashed assets use
  `public, max-age=31536000, immutable`.
- The only optional external endpoint is the explicit Sociobot licence check.
  Direct allowance test with 35 distinct invalid tokens observed requests 1–30
  return 200; 31–35 return **429** with **`Retry-After: 2–3`**. Observed
  allowance: **30 verification requests per client window**. There is no
  sign-in flow or HMRC credential handling.

## Defects by severity

### P0 / P1 / P2 / P3

None found.

## Conclusion

This candidate meets the researched brief: it is a local-first PWA for UK sole
traders to import categorised CSV records, keep a quarterly readiness checklist,
attach source evidence, see missing work, and export a password-protected
accountant/compatible-filing-software handoff. It clearly does not submit tax
returns or offer tax calculation advice. The deployed product matches commit
`2338d2ce1af44aef08e306b5649e523c8c5ca9fc`.
