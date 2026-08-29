# Independent verification 5 — FAIL

- **Work order:** `mtd-evidence-pack-verify-5`
- **Date:** 29 August 2026
- **Candidate commit:** `cabc2ea4ad7d7bf806adec6e7c38cc8fb22bcfb0`
- **Live URL:** <https://mtd-evidence-pack.sociobot.in>

## Release decision

**FAIL — do not release this candidate.** The live deployment matches the
candidate, so this is not a deployment-identity failure. Fresh evidence found
four release blockers:

1. The required clean `npm test` gate fails its checked-in mobile blocking-time
   assertion. The complete local suite measured 221 ms against a limit of 200
   ms. Three focused retries also failed at 300, 318, and 296 ms. The live suite
   failed the same assertion at 220 ms.
2. The PWA reloads its shell and sample offline, but a first-time visitor cannot
   perform the core encrypted export offline. The service worker does not
   precache the lazy `export-*.js` and `zip-*.js` chunks. With the production
   server stopped after the first visit, export made no download, logged
   `net::ERR_FAILED`, and showed “The encrypted ZIP could not be built.”
3. Importing a second valid CSV silently replaces all previously imported
   bookkeeping records. There is no warning, confirmation, or undo. A live
   workspace containing “First retained record” lost it immediately after a
   one-row second import and reported only one record.
4. The researched one-time purchase path is unavailable. The prescribed
   Sociobot checkout endpoint still returns HTTP 404 with
   `{"error":"enabled factory product","status":404}`. The product now offers
   only licence restoration, with no price or way for a new user to buy the
   supported edition.

## Mandatory gates run first

The checkout was clean and at the exact candidate before testing. `npm ci`
installed 62 packages and reported zero vulnerabilities. Every exact command
in `.factory/claims.json` was then run separately before broader QA.

| Claim | Exact command | Result |
| --- | --- | --- |
| `demo-sandbox` | `npm run test:e2e -- --grep @claim:demo-sandbox` | PASS — changed sample state vanished on reload and the real IndexedDB was not opened. |
| `csv-import` | `npm run test:e2e -- --grep @claim:csv-import` | PASS — impossible dates and blank amounts were rejected; two valid rows imported. |
| `source-file-size` | `npm run test:e2e -- --grep @claim:source-file-size` | PASS — 10 MiB was accepted and 10 MiB plus one byte was rejected without replacing it. |
| `encrypted-pack` | `npm run test:e2e -- --grep @claim:encrypted-pack` | PASS — wrong password failed; the correct password opened CSV, PDF, sources, manifest, and hashes. |
| `free-core-export` | `npm run test:e2e -- --grep @claim:free-core-export` | PASS — the core encrypted pack exported without a licence. |
| `local-only` | `npm run test:e2e -- --grep @claim:local-only` | PASS — a real-workspace record persisted in IndexedDB and the observed flow was same-origin only. |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS — the sample route reloaded offline after the first visit. |
| `custom-checklist` | `npm run test:e2e -- --grep @claim:custom-checklist` | PASS — an unlicensed real workspace saved a custom checklist item across reload. |
| `paid-license` | `npm run test:e2e -- --grep @claim:paid-license` | PASS — a recorded valid verification response enabled saved cover notes. |

All declared claims pass their current tests. The offline test is too narrow for
the public “Works after your first visit” wording: it proves only a sample-page
reload, while the core export fails under a genuine server-unavailable test.
The landing promise “See what is missing before handoff” and README statement
that the app can be installed in a standalone window also have no corresponding
claim entry and tagged observable test.

## Cold first read

**PASS.** A new 1440×900 live browser context showed, in its initial viewport:

- what it does: “Prepare your quarterly evidence handoff”;
- who it is for: UK sole traders keeping local books who need a pack for an
  accountant or filing software;
- what to do first: the visible one-click “Try it with sample data” action,
  followed by “Loads one sample quarter. Nothing is saved.”

The action opens a populated Rowan Field Studio quarter and the persistent
“Demo — sample data, nothing is saved” banner with Reset demo and Start for real.
The cold load made only same-origin requests and logged no console/page errors.

## Local quality gates

| Command | Result |
| --- | --- |
| `npm ci` | PASS — 62 packages added; 63 audited; 0 vulnerabilities. |
| all nine exact claim commands | PASS. |
| `npm run lint` | PASS — `tsc --noEmit`. |
| `npm run build` | PASS — exact production build created `dist/`. |
| `npm audit --omit=dev` | PASS — 0 vulnerabilities. |
| `npm test` | **FAIL** — 7/7 Vitest tests passed; Playwright passed 17/18 and failed `@performance` at 221 ms (limit ≤200 ms). |
| focused `@performance`, three fresh runs | **FAIL ×3** — 300, 318, and 296 ms. |
| `npm run verify:url -- https://mtd-evidence-pack.sociobot.in` | PASS — 200, title, `en-GB`, one h1, main, alt text, labelled buttons, no browser errors. |
| live full Playwright suite | **FAIL** — 17/18 passed; the same performance check failed at 220 ms. |

Build output is within transfer budgets: entry JavaScript 30.75 kB raw / 11.15
kB gzip, CSS 18.29 kB raw / 4.80 kB gzip, deferred ZIP code 54.45 kB gzip,
and the selected 390 px hero is 4,874 bytes. There are no font downloads.

Three Lighthouse 12.8.2 mobile runs against the live site scored 99, 98, and
97 performance. LCP was 1.1–1.2 s, CLS was 0, and TBT was 110, 160, and 210 ms.
The first complete run scored 100 accessibility, 100 best practices, and 100
SEO. Lighthouse scores pass, but they do not override the deterministic clean
repository gate or its three failing focused retries.

## Product workflow and recovery

The useful online flow works when records are not overwritten:

- demo reset restored its changed checklist item;
- a fresh real workspace imported three representative rows at both period
  boundaries, including positive, zero, and negative amounts;
- a source index attached and a custom checklist item saved and toggled;
- the browser rejected a five-character password and the app gave a specific
  mismatch message;
- the recovered export downloaded `evidence-pack-2026-07-05.zip` containing
  `README.txt`, `manifest.json`, CSV, PDF, and the source file; the manifest had
  three records and valid 64-character SHA-256 hashes;
- cancelling local deletion preserved the workspace; confirming it cleared it;
- the full independent flow made only product-origin requests and logged no
  console/page errors.

Invalid period order and a missing CSV category produced specific recovery
messages. The declared size-boundary test covered exactly 10 MiB and one byte
over. The high-severity record replacement defect remains: valid import is a
destructive whole-table replacement without disclosure or recovery.

## PWA and offline evidence

- Manifest, 192/512 icons, standalone display, versioned start URL, service
  worker, versioned cache, `skipWaiting`, `clients.claim`, update announcement,
  and offline route reload are present and exercised.
- The live claim test confirms `/demo` reloads offline with the sample.
- A stricter first-visit test used the exact production build, waited for the
  service worker, confirmed its cache contained the shell, entry JS/CSS, routes,
  and hero art, then stopped the server. Offline reload returned 200 from the
  worker. Export then failed because `assets/export-C8KSyxfA.js` was absent;
  `assets/zip-B3bbGzCw.js` was absent as well. No ZIP was downloaded.

This makes the headline offline promise materially broader than its passing
claim test and prevents the core job from completing during an outage.

## Privacy, requests, headers, and endpoint allowance

- Cold landing and the complete real import/attach/check/export/delete flow
  made only `https://mtd-evidence-pack.sociobot.in` requests. No analytics,
  third-party scripts/fonts, HMRC, bank, Azure, or AI endpoints were observed.
- The only configured external runtime origin is the optional Sociobot licence
  service. The product uses no sign-in, so Entra tenant validation does not
  apply. It has no product backend, library, or CLI.
- Live HTML sends CSP, HSTS, `nosniff`, strict-origin referrer policy,
  restrictive permissions policy, and `frame-ancestors 'none'`.
- HTML, manifest, service worker, robots, and sitemap use 30-second revalidation.
  All tested `/assets/*` files, including deferred export and ZIP chunks, use
  one-year immutable caching.
- A fresh 40-request sequential burst to licence verification observed an
  allowance of **30 requests per client window**. Requests 1–30 returned 200;
  requests 31–40 returned 429 with `Retry-After: 4` and
  `X-RateLimit-After: 4`.

## Accessibility, responsive layout, and routing

- Live axe scans across `/`, `/demo`, `/workspace`, `/privacy`, `/terms`, and a
  missing route found zero serious or critical violations.
- Keyboard checks passed: Tab starts at the skip link, Enter moves to main,
  client navigation focuses the new h1, Space toggles checklist items, and
  focused controls show a 3 px outline.
- At 390×844 normal sizing, there is no horizontal overflow and the sample
  workspace remains operable. Reduced motion changes smooth scrolling to auto
  and reduces transition duration.
- Every route has one h1, one main landmark, route-specific title and canonical,
  and no console/page errors. All public links resolved successfully.

Manual baseline defects remain:

- the coral focus outline is only **2.69:1** against the paper background on
  the primary sample-data action, below the required 3:1 focus-indicator ratio;
- simulated 200% text sizing creates **51 px horizontal overflow** on every
  public route; the mobile navigation and workspace summary extend off-screen;
- the mobile wordmark link is 153×32 CSS px, below the required 44 px target
  height;
- `/missing-page` displays the designed not-found screen but returns HTTP 200,
  not a real 404 response.

## Deployment identity

The production build and live deployment match. SHA-256 comparison passed for
all 21 publicly served `dist/` files (HTML, JS/CSS chunks and maps, artwork,
icons, manifest, service worker, offline page, robots, and sitemap). Key entry
hashes are:

- `assets/index-BF0gKOi3.js` —
  `46070b6891b2d6b17c979fb01c1425d2bfdd961596d7435d0a62eedefbaa93bf`
- `assets/index-DbNflly_.css` —
  `9eb7ee6e9c906b4c24f0baf4f86dbd59ab8031af9be1718bd17aef632cd880c2`
- `sw.js` —
  `459b3ab0cc86939af7a6d8244a3f1a896e4f7595560787d08647417b61682b80`

## Defects by severity

### High — mandatory clean test gate fails repeatedly

`npm test` fails at 221 ms, and focused retries fail at 300/318/296 ms. The live
suite also fails at 220 ms. Bring the checked-in 4× CPU assertion reliably below
200 ms from a clean install.

### High — core encrypted export is unavailable offline after first visit

Precache every code chunk needed for import/check/export, then test a complete
sample export with the origin actually unavailable. Expand the offline claim to
assert the promised observable outcome, not only a page reload.

### High — valid CSV import silently destroys existing records

Either merge safely or clearly describe replacement and require a specific
confirmation. Provide undo or recovery and cover repeated import with a test.

### High — required one-time purchase path remains unavailable

Register/enable the Sociobot product so checkout returns the hosted purchase
redirect, then show the exact price, one-time terms, buy action, return-token
flow, and a sandboxed claim test. Until then, the supported edition cannot be
purchased by a new user.

### Medium — accessibility baseline is incomplete

Raise focus-indicator contrast to at least 3:1, preserve reflow at 200% text,
and give the mobile home link a 44 px target height. Re-run keyboard, text-size,
390 px, contrast, and axe checks.

### Medium — public claims are not fully represented by claim tests

Add a tagged readiness test for “See what is missing before handoff,” an
installability test for the README standalone-window statement, and strengthen
the offline claim as described above, or narrow/remove the wording.

### Low — designed missing page returns success status

Configure the static host to return HTTP 404 for unknown routes while retaining
the styled recovery page.

## Retest criteria

Repair all high-severity issues, add the missing claim coverage, and rerun all
nine exact claim commands first. Then require a clean `npm test`, lint, exact
build, repeated focused performance runs, complete online and truly offline
exports, repeated-import recovery, purchase/return-token flow, accessibility
manual checks, live endpoint allowance, and full candidate/live hash parity.

No product code was modified during this verification.
