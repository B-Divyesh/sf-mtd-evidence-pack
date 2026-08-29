# Independent verification 6 — FAIL

- **Work order:** `mtd-evidence-pack-verify-6`
- **Date:** 29 August 2026
- **Candidate commit:** `729d0165bedc2c8f0d7af15ac30b0b9eeaf090eb`
- **Live URL:** <https://mtd-evidence-pack.sociobot.in>

## Release decision

**FAIL — do not release this candidate.** The live deployment matches the
candidate, so this is not a stale-deployment result. Fresh evidence found two
high-severity release blockers:

1. The required clean `npm test` gate fails its checked-in mobile blocking-time
   assertion. The full run measured 326 ms against a limit of 200 ms. Three
   focused retries also failed at 354, 273, and 355 ms. The live suite failed
   the same test at 314 ms.
2. The advertised £24 one-time purchase cannot be bought. The exact live
   Sociobot checkout URL returns HTTP 404 with
   `{"error":"enabled factory product","status":404}`. The recorded browser
   test masks that live dependency with a synthetic 302 response.

The core local workflow, declared claim tests, PWA offline export, privacy
request policy, responsive layout, and candidate/deployment parity otherwise
pass. Two medium findings remain around period integrity and touch targets.

## Mandatory claims run first

The checkout was clean and at the exact candidate. `.factory/claims.json` is
present with 12 entries. The untouched clone initially had no installed
Playwright package; after the repository-required `npm ci`, every listed command
was run separately against the shipped demo entry point and passed.

| Claim | Exact command | Result |
| --- | --- | --- |
| `demo-sandbox` | `npm run test:e2e -- --grep @claim:demo-sandbox` | PASS — changed sample state disappeared on reload. |
| `csv-import` | `npm run test:e2e -- --grep @claim:csv-import` | PASS — invalid dates and blank amounts were rejected; later valid imports retained earlier records. |
| `source-file-size` | `npm run test:e2e -- --grep @claim:source-file-size` | PASS — exactly 10 MiB was accepted and 10 MiB plus one byte was rejected without replacement. |
| `encrypted-pack` | `npm run test:e2e -- --grep @claim:encrypted-pack` | PASS — wrong password failed; the right password opened CSV, PDF, source files, manifest, and valid hashes. |
| `free-core-export` | `npm run test:e2e -- --grep @claim:free-core-export` | PASS — a complete pack exported without a licence. |
| `local-only` | `npm run test:e2e -- --grep @claim:local-only` | PASS — the real record persisted in IndexedDB and only the product origin was requested. |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS — the demo reloaded offline and exported the complete encrypted sample pack. |
| `custom-checklist` | `npm run test:e2e -- --grep @claim:custom-checklist` | PASS — an unlicensed real workspace retained a custom check after reload. |
| `readiness` | `npm run test:e2e -- --grep @claim:readiness` | PASS — the named open item disappeared when completed and the ready state appeared. |
| `standalone-install` | `npm run test:e2e -- --grep @claim:standalone-install` | PASS — standalone display, versioned start URL, and 192/512 icons were present. |
| `paid-checkout` | `npm run test:e2e -- --grep @claim:paid-checkout` | PASS only with the checked-in recorded 302/valid-verdict interception; the real checkout is 404. |
| `paid-license` | `npm run test:e2e -- --grep @claim:paid-license` | PASS with a recorded valid verification response. |

Every claim ID appears exactly once as `@claim:<id>` in the tests. Landing and
README claims map to those entries. The paid-checkout assertion does not prove
that the live external product record is enabled; the live check below fails.

## Cold first read

**PASS.** A fresh 1440×900 context with service workers blocked showed, within
the first viewport:

- what it does: “Prepare your quarterly evidence handoff”;
- who it is for: UK sole traders keeping local books who need a pack for an
  accountant or filing software;
- what to click first: “Try it with sample data”;
- what that click does: “Loads one sample quarter. Nothing is saved.”

The action is also visible at 390×844 (`y=600`, height 48 px). It opens Rowan
Field Studio's populated quarter and a persistent “Demo — sample data, nothing
is saved” banner with Reset demo and Start for real. The cold page made four
same-origin requests and logged no console or page errors.

Screenshots:

- `.factory/verification-evidence/live-first-read-desktop.png`
- `.factory/verification-evidence/live-first-read-mobile-390.png`
- `.factory/verification-evidence/live-demo-mobile-390.png`

## Clean local quality gates

| Command | Result |
| --- | --- |
| `npm ci` | PASS — 62 packages added; 63 audited; 0 vulnerabilities. |
| all 12 exact claim commands | PASS after the clean install. |
| `npm run lint` | PASS — `tsc --noEmit`. |
| `npm run build` | PASS — exact production build created `dist/`. |
| `npm audit --omit=dev` | PASS — 0 vulnerabilities. |
| `npm test` | **FAIL** — 7/7 unit tests passed; Playwright passed 22/23 and failed the 200 ms blocking-time assertion at 326 ms. |
| focused `@performance`, three fresh runs | **FAIL ×3** — 354, 273, and 355 ms. |
| `npm run verify:url -- https://mtd-evidence-pack.sociobot.in` | PASS — 200, title, `en-GB`, one h1, main, alt text, labelled buttons, no browser errors. |
| live full Playwright suite | **FAIL** — 22/23 passed; the same performance assertion failed at 314 ms. |

The bundle is well inside the static size budgets despite the blocking-time
failure: initial JS is 3.94 kB raw / 1.86 kB gzip, CSS is 18.67 kB raw / 4.89
kB gzip, the workspace chunk is deferred at 10.35 kB gzip, ZIP code is deferred
at 54.45 kB gzip, and the selected mobile hero is 4,874 bytes. No font is
downloaded.

Three Lighthouse 12.8.2 mobile runs against production scored 100 performance,
accessibility, best practices, and SEO in all three runs. LCP was 971/945/975
ms, TBT was 15/33/27 ms, CLS was 0, and total transfer was about 68 kB. Raw
reports are in
`.factory/verification-evidence/lighthouse-mobile-{1,2,3}.json`. Lighthouse
passing does not override the repository's mandatory, repeatably failing gate.

## Core workflow and recovery

The smallest useful real workflow was exercised independently in a fresh live
browser, not only through the checked-in tests:

- the demo began with 12 records and reverted a checklist change on reload;
- Start for real opened a separate empty IndexedDB workspace;
- an inverted period produced a specific recovery message;
- an impossible calendar date and blank amount were rejected;
- start-date, end-date, positive, negative, and zero-value records imported;
- a second valid import retained the first records;
- a source index and custom checklist item persisted across reload;
- a short password was blocked by native form validation;
- mismatched passwords produced a specific error and recovered after both
  password fields were re-entered;
- the real export downloaded `evidence-pack-2026-07-05.zip`; the wrong password
  failed, while the correct one opened README, manifest, CSV, PDF, and source
  index; the manifest contained four records and valid SHA-256 hashes;
- the password was absent from localStorage;
- cancelling deletion preserved the workspace and confirming it cleared it.

That complete flow requested only the product origin and logged no console or
page errors.

One data-integrity gap was reproduced: the default period is 6 April–5 July
2026, but a record dated 1 January 2025 imports silently with no warning. A
quarterly handoff can therefore contain transactions outside its stated period.

Real-workspace import feedback also loses useful detail: `persist()` overwrites
“N records added” with the generic “Saved on this device.” An invalid import can
leave that earlier green saved message visible beside the red error. Records
are not lost, but the feedback is needlessly ambiguous.

## PWA, offline, and update behavior

- `manifest.webmanifest` has standalone display, versioned `/?v=1.0.5` start
  URL, theme/background colors, and 192/512 icons with maskable coverage.
- `/sw.js` activated and controlled the live page using cache
  `mtd-evidence-pack-v1.0.5`.
- The cache contained all shell routes and every built JS/CSS/export/ZIP chunk.
- After `registration.update()`, networking was disabled. `/demo` reloaded with
  Rowan Field Studio and downloaded the encrypted sample ZIP; no request failed.
- The checked-in update-feedback test passes by dispatching `updatefound`, and
  code inspection confirms versioned caches, `skipWaiting()`, `clients.claim()`,
  old-cache removal, and a polite update announcement. A true version-to-version
  transition cannot be induced from a single immutable candidate.

## Privacy, requests, headers, and endpoint allowance

- Cold landing and the full real import/attach/check/export/delete flow made
  only `https://mtd-evidence-pack.sociobot.in` requests. No analytics, external
  font/script, HMRC, bank, Azure, or AI request occurred.
- The only configured external runtime service is the optional Sociobot licence
  API. This product has no sign-in, backend, library, or CLI, so Entra,
  concurrency, health, persistence-boundary, and consumer-install checks do not
  apply.
- Live HTML sends CSP, HSTS, `nosniff`, strict-origin referrer policy,
  restrictive permissions policy, and response-header-only
  `frame-ancestors 'none'`.
- HTML, manifest, worker, and missing-page responses use 30-second revalidation.
  Hashed assets use `public, max-age=31536000, immutable`.
- The licence verify endpoint returned `200` and
  `{"expires_at":null,"reason":"invalid","valid":false}` for an invalid token.
  A fresh sequential burst observed an allowance of **30 requests per client
  window**: requests 1–30 returned 200; requests 31–40 returned 429 with
  `Retry-After` (3 seconds initially). The required rate-limit behavior passes.
- The checkout endpoint itself is unavailable, so its purchase and post-payment
  behavior cannot be verified live.

## Accessibility, mobile, routing, and visual review

- Independent Playwright Axe scans on `/`, `/demo`, `/workspace`, `/privacy`,
  `/terms`, and a missing route found zero serious or critical violations.
- Every product route has `lang="en-GB"`, one h1, one main landmark, its own
  title, no horizontal overflow at 390 px, and no unexpected browser errors.
- At 390 px with the root text at 200%, all five product routes had zero
  horizontal overflow and visible headings.
- Keyboard checks pass: first Tab reaches the skip link with a 3 px visible
  danger-ink outline, Enter focuses main, route navigation focuses the new h1,
  and Space toggles checklist controls.
- Reduced motion matches, sets smooth scrolling to `auto`, removes the signature
  animation, and reduces transitions to effectively instant.
- Unknown paths return HTTP 404 and a designed recovery page.
- Manual visual review found the paper-ledger identity coherent and legible on
  desktop and mobile, with no clipping or obscured controls.

The mobile workspace still contains undersized direct link targets. “Buy the
supported edition” measures 209×19 CSS px and the privacy email measures
175×20, below the attached 44 px touch-target baseline. Form-label hit areas and
icon buttons are larger; Axe does not report this manual target-size issue.

## Deployment identity

The live deployment matches commit `729d0165bedc2c8f0d7af15ac30b0b9eeaf090eb`.
SHA-256 parity passed for all 26 publicly served `dist/` artifacts. The remaining
`dist/staticwebapp.config.json` is host configuration and correctly is not
served as a public file. Key hashes:

- `index.html` —
  `c17156ca1eee3ad5bb4aef600d95e4b84e47965505e837874080513af725ef38`
- `assets/index-CYWHRzbZ.js` —
  `b724696d44b3fcd69e2bb41ad9601ba55230f7c3cb3c8f7937eb6c21f033c74a`
- `assets/app-D_nfZkY5.js` —
  `09f42c920b70df354a51349c56eb011cb19ec59ea8f900f150bfe046985114f9`
- `sw.js` —
  `66434f0060900f547d11764ca4246ae0bf8785f24596f065afbd84ced83d3f7e`

## Defects by severity

### High — mandatory clean test gate fails repeatedly

`npm test` fails at 326 ms versus its 200 ms limit. Focused local retries fail
at 354/273/355 ms, and the live suite fails at 314 ms. Make the checked-in test
reliably pass from the factory worker or revise it only with a justified,
contract-compatible performance measurement.

### High — advertised purchase action returns 404

The visible Buy action and README link target
`https://api.sociobot.in/api/v1/products/mtd-evidence-pack/checkout`, which
returns 404 instead of hosted checkout. Enable/register the factory product and
retest checkout, return token capture, live verification, and restore behavior.

### Medium — records outside the selected quarter are accepted silently

The 2026 quarter accepted a 2025 transaction with no warning. Reject or clearly
flag out-of-period rows before they enter the pack, and add boundary claim/test
coverage.

### Medium — some mobile links miss the 44 px touch baseline

Increase the direct hit areas for the workspace purchase link and privacy email
without changing their semantic link behavior.

### Low — real import status is overwritten and stale success can accompany errors

Preserve the useful added/total count after save, and clear stale success state
when an import fails.

## Retest criteria

Require all 12 exact claim commands, a clean `npm test`, lint, build, multiple
focused performance runs, live checkout, quarter-boundary rejection/warning,
44 px touch targets, complete real and offline exports, route Axe/keyboard/reflow
checks, endpoint rate limiting, and full candidate/live hash parity.

No product code was modified during this verification.
