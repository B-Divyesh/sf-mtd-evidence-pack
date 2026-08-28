# Independent verification — FAIL

**Verifier:** independent QA (`mtd-evidence-pack-verify-1`)
**Date:** 28 August 2026
**Candidate commit:** `53f86b0cf1704036dce0ec4147898a49424249ad`
**Live URL:** <https://mtd-evidence-pack.sociobot.in>

## Release decision

**FAIL — do not release this candidate.** The CSV importer silently accepts
invalid calendar dates and missing amounts, the measured mobile Lighthouse
performance score is below the required 90, and user-facing guarantees remain
outside the required claims contract.

## Cold first read

Pass. With a fresh desktop browser visit, the first screen says **“Prepare your
quarterly evidence handoff”**, says it is **for UK sole traders who keep local
books and need a clear pack for an accountant or filing software**, and directs
the visitor to **“Try it with sample data”**. The adjacent text explains that it
loads one sample quarter and saves nothing. The action opens the working sample
in one click.

## Clean-checkout and claim evidence

`git rev-parse HEAD` returned the candidate commit above. `npm ci` completed
with 0 reported vulnerabilities.

All commands listed in `.factory/claims.json` were run from the clean installed
checkout. Each passed; the final Playwright result marker was
`{"status":"passed","failedTests":[]}`.

| Claim | Exact command | Result |
| --- | --- | --- |
| demo-sandbox | `npm run test:e2e -- --grep @claim:demo-sandbox` | PASS |
| csv-import | `npm run test:e2e -- --grep @claim:csv-import` | PASS |
| encrypted-pack | `npm run test:e2e -- --grep @claim:encrypted-pack` | PASS |
| free-core-export | `npm run test:e2e -- --grep @claim:free-core-export` | PASS |
| local-only | `npm run test:e2e -- --grep @claim:local-only` | PASS |
| offline-reload | `npm run test:e2e -- --grep @claim:offline-reload` | PASS |
| paid-license | `npm run test:e2e -- --grep @claim:paid-license` | PASS |

`npm test` passed: 5 Vitest unit tests and 10 Playwright tests. No separate
lint script exists. The exact production command `npm run build` passed and
created `dist/`.

## Product, privacy, and deployment checks

- Normal demo flow passed: sample workspace, CSV import, encrypted ZIP export,
  password rejection/recovery, reset demo, and Start for real.
- Invalid CSV with `not-a-date`, a non-numeric amount, and no category was
  rejected with an actionable message; a subsequent valid CSV imported
  successfully. Password mismatch and short-password messages are also
  actionable.
- Live deployment matches the candidate build exactly: SHA-256 of
  `index-BRuENn1O.js` is
  `842a5c372a9a65b14fff9928a45a4e7b23aa0a4555d173f8fa6e012445c26c4f` and
  of `index-CdaCzt2-.css` is
  `92a8bf06d3abdc890021061d02d13aee135ac30e9f2d88aeaa3dbc65ccd4b9ab` for
  both local `dist/` and the live origin.
- Live `/`, `/demo`, `/workspace`, `/privacy`, `/terms`, and the styled missing
  route returned 200. The deployed site supplied CSP, HSTS, `nosniff`, strict
  referrer policy, permissions policy, and immutable caching for hashed JS/CSS.
- Browser-observed demo traffic was same-origin only. Source review found no
  runtime endpoint except the optional Sociobot licence verification endpoint;
  no third-party fonts, analytics, bank, HMRC, or Azure requests are present.
- No sign-in is used, so Entra tenant validation is not applicable.
- A 60-request, 12-way concurrent burst to the live licence verify endpoint
  (`qa-rate-test-*` invalid tokens) produced 30 `200` and 30 `429` responses.
  The first observed `429` was request 31; responses included `Retry-After:
  1–3` and `X-RateLimit-After`. This passes the endpoint rate-limit check.

## Accessibility, responsive, and PWA checks

- Live axe scans of `/`, `/demo`, `/workspace`, `/privacy`, `/terms`, and the
  missing route had **zero serious or critical findings**. Each had exactly one
  `h1`, one `main`, and no console/page errors.
- At 390 × 844 there was 0 px horizontal overflow. The skip link had a visible
  coral focus outline; a checklist checkbox toggled with Space. The supplied
  focus styles and labels are present. `prefers-reduced-motion: reduce` changed
  scroll behaviour to `auto` and reduced animation/transition duration to
  0.01 ms.
- The repository does not include a `verify-url.sh`; equivalent live checks
  above covered title, lang, main, headings, alt-bearing hero image, and console.
- The live service worker controlled the page with cache
  `mtd-evidence-pack-v1.0.0`. After first visiting `/demo`, an offline reload
  returned 200 and showed “Prepare this quarter’s evidence pack” with Rowan
  Field Studio’s sample data.

## Performance evidence

Production bundle budgets pass: initial JS is 12,820 bytes gzip, CSS is 4,995
bytes gzip, and the ZIP module is a 53,524-byte gzip lazy chunk. The mobile hero
is 12,534 bytes.

Independent Lighthouse 12.8.2 mobile simulation on the production build:

| Metric | Result | Required |
| --- | ---: | ---: |
| Performance | **87** | >= 90 |
| Accessibility | 100 | >= 95 |
| Best practices | 100 | — |
| SEO | 100 | — |
| LCP | 1.6 s | < 2.5 s |
| CLS | 0 | < 0.1 |
| Total blocking time | **490 ms** | interaction budget < 200 ms |

The report found two long tasks, including a 525 ms task attributed to the main
bundle, with style/layout accounting for about 1.06 s of main-thread work.
Lighthouse 13.4.1 also reported a browser-tab crash and a non-passing 82
performance / 750 ms TBT result; the stable 12.8.2 run above is the recorded
result. The required >=90 performance gate is not met.

## Defects

### High — CSV importer corrupts invalid input instead of recovering

On the live `/demo`, importing:

```csv
date,description,amount,category,reference
2026-02-30,Impossible day,25,Sales,BAD-1
2026-02-29,Non-leap day,10,Sales,BAD-2
2026-02-28,Valid day,5,Sales,OK-1
```

reported **“3 records imported.”** and displayed both impossible dates. A
second live import with blank and whitespace `amount` cells also reported
**“3 records imported.”** The importer converts empty strings with `Number("")`
to zero and relies on `Date.parse`, which normalises invalid dates. This can put
false transactions into an accountant handoff. Reject missing amounts and
validate actual Gregorian calendar dates; add boundary tests to the
`@claim:csv-import` flow.

### High — mobile performance gate fails

See the Lighthouse evidence above. Reduce main-thread style/layout work and
retest the production build until mobile performance is >=90 and interaction
work is within budget.

### High — unlisted visitor-facing guarantees violate the claims contract

The landing page/README make guarantees with no corresponding entry in
`.factory/claims.json`, including “No HMRC sign-in or credentials”, “No tax
calculation or advice”, “No bank connection”, “No claim of legal certification”,
and statements that real work stays only in IndexedDB / that licence checks send
only the token. The claims rule requires these to be removed or given observable
demo tests. The current `local-only` claim observes only the demo request
origins; it does not prove each of these guarantees.

### Medium — paid-licence claim is not exercised through the demo entry point

The `@claim:paid-license` test begins at `/` and then
`/workspace?license=sample-valid-token`, rather than `/demo`, despite the
demo-sandbox requirement that every claim test use the demo entry point. It also
uses a routed fixture rather than a live entitlement, which is appropriate for
no-spend testing but should still be arranged from the isolated demo flow.

## Retest criteria

1. Fix and test strict CSV date/amount validation, including non-leap dates,
   overflow dates, blank amount, and recovery after rejection.
2. Resolve every unlisted public guarantee by adding a claim plus observable
   demo test or removing/narrowing the wording.
3. Bring an independent mobile Lighthouse production-build run to performance
   >=90 and TBT/interaction budget compliance.
4. Make the paid-licence claim test start from the demo sandbox while retaining
   its recorded verification response.
