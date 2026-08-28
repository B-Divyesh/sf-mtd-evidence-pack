# Independent verification 2 — FAIL

**Verifier:** independent QA (`mtd-evidence-pack-verify-2`)  
**Date:** 28 August 2026  
**Candidate commit:** `c01a8186fb08184c70634b9007a4ca768e8955b8`  
**Live URL:** <https://mtd-evidence-pack.sociobot.in>

## Release decision

**FAIL — do not release.** The live product does serve this candidate and its
free, local core passes the exercised workflow, but the visible paid purchase
path is broken: the prescribed Sociobot checkout endpoint returns `404`. This
makes the advertised £24 supported edition unavailable. Its price and purchase
promise are also not covered by a claim test.

## Mandatory claims run first

The checkout was clean at the requested commit. `npm ci` installed 62 packages
and reported 0 vulnerabilities. I then ran every exact command in
`.factory/claims.json`, individually, before other QA. All passed from the
shipped `/demo` entry point.

| Claim | Exact command | Result |
| --- | --- | --- |
| `demo-sandbox` | `npm run test:e2e -- --grep @claim:demo-sandbox` | PASS — sample resets on reload and does not open the real IndexedDB workspace. |
| `csv-import` | `npm run test:e2e -- --grep @claim:csv-import` | PASS — rejects overflow date, blank/whitespace amount; then imports valid rows. |
| `encrypted-pack` | `npm run test:e2e -- --grep @claim:encrypted-pack` | PASS — wrong password fails; correct password opens ZIP with CSV, PDF, sources, manifest, and SHA-256 values. |
| `free-core-export` | `npm run test:e2e -- --grep @claim:free-core-export` | PASS — export succeeds without a licence. |
| `local-only` | `npm run test:e2e -- --grep @claim:local-only` | PASS — real record is in `mtd-evidence-pack:v1`; observed traffic is only the product origin. |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS — `/demo` reloads offline after first visit. |
| `paid-license` | `npm run test:e2e -- --grep @claim:paid-license` | PASS — a recorded valid verification response enables the two paid fields. This does not test checkout. |

## Cold first read

**PASS.** A new browser context loaded the live home page without errors. The
first screen says **“Prepare your quarterly evidence handoff”**, identifies
**UK sole traders who keep local books** and the handoff recipient, and has the
visible one-click **“Try it with sample data”** action. The adjacent text says
that it loads one sample quarter and saves nothing. The demo opens directly to
a populated working quarter, with the required demo banner, Reset demo, and
Start for real controls.

## Local gates and product exercise

- `npm test` passed: 7 Vitest unit tests and 11 Playwright tests.
- `npm run lint` passed (`tsc --noEmit`).
- Exact production command `npm run build` passed and produced `dist/`.
- `npm run verify:url` on the production preview passed: title, `en-GB`, one
  `h1`, `main`, image alt text, labelled buttons, and no console errors.
- Live `/demo` rejected `2026-02-30` and a blank amount with specific recovery
  text, then imported a valid two-record CSV. Reset demo restored its 12-record
  sample. The normal encrypted export, source attachment, wrong-password, and
  free-export paths are independently covered by the passing claim sandbox.
- The product provides the brief's local CSV import, versioned UK sole-trader
  checklist, source attachment, encrypted ZIP containing CSV/PDF/sources and
  hashes. Its exported PDF/README explicitly says it is not tax advice or
  filing software. No sign-in exists, so Entra tenant validation is not
  applicable.

## Live deployment, privacy, and policies

The live root references `assets/index-C6eZ0t1l.js` and
`assets/index-CUSI83Sn.css`. SHA-256 matched the candidate production build
exactly:

| Asset | SHA-256 |
| --- | --- |
| JS | `422d9c8e66fca1418f2d83b4a7264d51b9f4cf9b8c4929e4423a7f211bd4a5c4` |
| CSS | `221a9c79c14fc9e40585ffa31da17b065af113360cf6fa5ff8f7069364cc63b3` |

- A cold live landing request made only same-origin requests. The local-only
  claim likewise observes same-origin traffic throughout its real-workspace
  import. Source review found no analytics, CDNs, HMRC, bank, Azure, or other
  runtime endpoint; the optional licence verification is the sole external
  endpoint.
- Live responses supply CSP (same origin plus `api.sociobot.in` for licensing),
  HSTS, `nosniff`, strict referrer policy, restrictive permissions policy, and
  `frame-ancestors 'none'`. Hashed JS has one-year immutable caching; HTML and
  service worker use 30-second revalidation. `robots.txt`, `sitemap.xml`, and
  the web manifest returned 200.
- The required live licence-verify rate-limit test used 40 sequential invalid
  tokens. Requests 1–30 returned 200; 31–40 returned `429`. The first `429`
  supplied `Retry-After: 4`, meeting the rate-limit requirement.

## Accessibility, responsive, PWA, and performance

- Live axe scans of `/`, `/demo`, `/workspace`, `/privacy`, `/terms`, and a
  missing route found **zero serious or critical violations**. Every route had
  exactly one `h1` and one `main`; no console or page errors occurred.
- At 390×844, horizontal overflow was 0 px. The first focused control had a
  visible coral 3px outline, Reset demo measured 44px high, and Space toggled a
  checklist item. With reduced motion, scroll behaviour was `auto` and the
  paper-rise transition/animation duration was `0.00001s`.
- On live `/demo`, a fresh service-worker-controlled context had cache
  `mtd-evidence-pack-v1.0.1`; after `registration.update()` and taking the
  context offline, reload returned 200 with Rowan Field Studio's sample.
- Build budgets pass: initial JS 12.76 KB gzip, CSS 4.82 KB gzip, lazy ZIP
  chunk 54.45 KB gzip, and mobile hero 12,534 bytes.
- Lighthouse 12.8.2 mobile simulated runs against the production preview were
  89, 92, and 94 performance (median 92); LCP 1.3–1.5 s and CLS 0. The first
  run misses the required 90 and TBT varied 300–440 ms. This is a stability
  concern to address, although the median passes; it is not the primary release
  block because the checkout failure is deterministic.

## Defects

### High — paid checkout is a dead live link

The landing page's **Buy the supported edition** link resolves to:

`https://api.sociobot.in/api/v1/products/mtd-evidence-pack/checkout`

Fresh `GET` and `HEAD` checks at 14:58–14:59 UTC both returned `HTTP/2 404`
with `{"error":"enabled factory product","status":404}`. The app advertises
“£24” and “One payment adds saved cover notes and custom checklist items,” but
a customer cannot begin checkout. Register/enable the correct live Sociobot
product or remove the paid offer until its real checkout returns a valid
redirect. Then add a claim test for the purchase/return-token contract (using
the approved test product/recorded sandbox as appropriate).

### Medium — performance gate is not repeatably green

The first of three independent Lighthouse 12.8.2 mobile simulated production
runs scored 89, below the required 90; later runs scored 92 and 94. TBT was
300–440 ms. Reduce the remaining main-thread work and retain repeated-run
evidence before a release claim of meeting the performance gate.

### Medium — paid sales promise is outside the claims contract

The landing page promises that a £24 payment adds paid features, but
`.factory/claims.json` contains no claim that proves the price/checkout
availability or the return-token purchase path. The `paid-license` claim
intercepts a verification response after a manually supplied token, which is
appropriate for no-spend testing but cannot prove that a visitor can buy it.

## Retest criteria

1. Make the live checkout URL return its hosted-checkout redirect for this
   product, then verify the complete approved purchase/return-token path.
2. Add a sandboxed, observable claims entry for the paid purchase promise, or
   remove the promise and purchase link.
3. Make repeated mobile Lighthouse runs consistently meet the ≥90 requirement
   and reduce the observed blocking work.
