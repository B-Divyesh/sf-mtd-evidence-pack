# Independent verification 3 — FAIL

**Verifier:** independent QA (`mtd-evidence-pack-verify-3`)  
**Date:** 28 August 2026  
**Candidate commit:** `5e105878b2021813a9f8e7f199b88f94fd475c5a`  
**Live URL:** <https://mtd-evidence-pack.sociobot.in>

## Release decision

**FAIL — do not release this candidate.** The live deployment is byte-for-byte
the candidate application bundle and the essential local-first workflow works,
but the required full test suite fails its mobile performance gate. A second,
focused execution also fails. The product additionally makes an unlisted,
testable 10 MB attachment-limit promise, contrary to the claims contract.

## Mandatory claims run first

From the clean checkout at the candidate commit, `npm ci` installed 62 packages
with no audit findings. Before other local QA, every command declared in
`.factory/claims.json` was run separately against its shipped `/demo` flow:

| Claim | Exact command | Result |
| --- | --- | --- |
| `demo-sandbox` | `npm run test:e2e -- --grep @claim:demo-sandbox` | PASS — sample change resets on reload; real IndexedDB is not opened. |
| `csv-import` | `npm run test:e2e -- --grep @claim:csv-import` | PASS — rejects impossible date and blank/whitespace amounts; imports valid CSV. |
| `encrypted-pack` | `npm run test:e2e -- --grep @claim:encrypted-pack` | PASS — wrong password fails; correct password opens ZIP with CSV, PDF, source files, manifest, and SHA-256 values. |
| `free-core-export` | `npm run test:e2e -- --grep @claim:free-core-export` | PASS — encrypted pack download succeeds without a licence. |
| `local-only` | `npm run test:e2e -- --grep @claim:local-only` | PASS — imported real record is in `mtd-evidence-pack:v1`; observed traffic is same-origin only. |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS — after first visit, offline `/demo` reload displays the sample workspace. |
| `paid-license` | `npm run test:e2e -- --grep @claim:paid-license` | PASS — a recorded valid licence response enables custom checks and cover notes. |

## Cold first read

**PASS.** A new desktop browser context opened the live home page cold with no
console/page errors and only same-origin requests. Its first screen says:

- What: “Prepare your quarterly evidence handoff.”
- For whom: UK sole traders keeping local books who need a pack for an
  accountant or filing software.
- First action: visible, one-click “Try it with sample data,” with adjacent
  text that it loads one sample quarter and saves nothing.

The action opens a populated demo and displays the required persistent banner,
Reset demo, and Start for real controls.

## Local gates and workflow exercise

- `npm test` **FAILED**: Vitest passed 7/7 and Playwright passed 13/14. The
  sole failure was `@performance mobile landing keeps blocking work within
  200ms`: measured **205 ms**, exceeding the required `<= 200 ms`.
- A fresh focused retry, `npm run test:e2e -- --grep @performance`, also
  **FAILED**, measuring **308 ms**. This is not a one-off green gate.
- `npm run lint` passed (`tsc --noEmit`).
- `npm run build` passed and produced `dist/`.
- `npm audit --omit=dev` reported 0 vulnerabilities.
- `npm run verify:url -- https://mtd-evidence-pack.sociobot.in` passed:
  title, `en-GB`, one `h1`, `main`, image alt text, labelled buttons, and no
  console errors.

Independent workflow checks on the production build covered an empty real
workspace, valid CSV import, a >10 MB source-file rejection and recovery,
password mismatch recovery, date-range validation, and local-only requests.
The observed messages were specific and actionable, including “The passwords
do not match. Enter the same password twice.” and “The start date is after the
end date. Change one of the dates.” No browser errors occurred.

The passing browser tests separately cover source files in the encrypted pack,
free export, password non-persistence, service-worker update announcement,
offline reload, route errors, keyboard Space operation, mobile fit, and axe
serious/critical findings.

## Live identity, privacy, PWA, and policies

The live root loads `assets/index-J9-v-4ye.js`. Its SHA-256 exactly matches the
candidate production output:

`b5491d9744b40397512899da04d2a0cac94490dd9063d6025319e529832a4c5d`

Build budgets by Vite output: initial JS is 12.62 KB gzip, CSS 4.80 KB gzip,
and the lazy ZIP chunk 54.45 KB gzip; all are within the applicable 200/50 KB
initial budgets. The mobile hero is 12,534 bytes. A Lighthouse attempt could
not connect to the container Chromium, so no Lighthouse score is claimed; the
repository’s own required throttled mobile performance test supplies the
release-blocking measurement above.

- Live HTML and service worker use `max-age=30, must-revalidate`; the hashed
  app bundle is `max-age=31536000, immutable`.
- Live responses include HSTS, `nosniff`, strict referrer policy, restrictive
  permissions policy, CSP with only `api.sociobot.in` as an allowed external
  connection, and `frame-ancestors 'none'`.
- Cold landing and real-workspace import traffic was same-origin only. The
  optional restore/returned-licence flow is the sole scoped external endpoint;
  there are no analytics, HMRC, bank, Azure, or sign-in calls. Entra validation
  is not applicable because the product has no sign-in.
- The live manifest is valid PWA metadata with 192/512 icons (512 maskable),
  standalone display, and `/?v=1.0.2` start URL. The live service worker cache
  is `mtd-evidence-pack-v1.0.2`; offline and update behavior pass the shipped
  browser tests.
- A 60-request burst to
  `GET https://api.sociobot.in/api/v1/products/mtd-evidence-pack/verify` with
  an invalid probe token returned 200 for requests 1–29 and started returning
  `429` with `Retry-After` (initially 3 seconds) at request **30**. The
  licence API therefore meets the requested rate-limit check.

Desktop and 390 px route checks found no horizontal overflow or console/page
errors. The full suite’s axe scan found zero serious/critical findings on `/`,
`/demo`, `/workspace`, `/privacy`, `/terms`, and a missing route. Reduced
motion disables the hero animation and uses automatic scrolling. A live
focused link has a designed coral 3 px outline.

## Defects

### High — required mobile performance test is red

The exact `npm test` production gate fails at 205 ms against its 200 ms cap;
the isolated retry fails at 308 ms. This violates the factory definition of
done and the repository’s own release assertion. Reduce first-load long-task
work and demonstrate repeatable green results under the checked-in test.

### Medium — 10 MB attachment limit is an unlisted claim

The workspace says “Each file can be up to 10 MB.” This is a precise,
user-reliant quantitative promise, but `.factory/claims.json` has no
`source-file-size` (or equivalent) entry and no `@claim:` test. Manual QA
confirmed a 10 MB + 1 byte PDF is rejected, but the claims policy requires the
promise to be listed and automatically asserted from the demo sandbox. Add the
claim and a boundary test, or remove the visible limit.

### Low — cold keyboard tab order bypasses the skip link

On a cold live route, application startup programmatically focuses the `h1`.
The first forward Tab therefore lands in main content (landing CTA/workspace
form) rather than the visible “Skip to main content” link; that link is only
reached after cycling through the page or reverse-tabbing. Focus the heading
only after client-side route changes, not initial load, so keyboard users get
the normal skip/header-first tab order.

## Retest criteria

1. Make `npm test` and the isolated `@performance` test reliably pass the
   checked-in <=200 ms requirement.
2. Add an exact demo-sandbox claim test for the 10 MB source-file limit (or
   remove that promise).
3. Correct initial-load focus order, then retest the skip link with keyboard
   only.
