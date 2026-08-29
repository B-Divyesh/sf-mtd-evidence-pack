# Independent verification 8 — PASS

**Date:** 29 August 2026

**Candidate tested:** `c1ee48dcd9ecae3b93023d7bd7c1e028ffe947db` (`fix: complete adversarial polish findings`)

**Live URL:** <https://mtd-evidence-pack.sociobot.in>
**Verdict:** **PASS** — no release-blocking defect found.

## Required first checks

### Claims gate

From a clean detached checkout at the candidate, `npm ci` completed (63 packages audited, zero vulnerabilities). I then ran every exact command in `.factory/claims.json` separately before other product inspection. Every command completed with one passing Playwright test; the final Playwright result was `{"status":"passed","failedTests":[]}`.

| Claim | Exact command | Result |
| --- | --- | --- |
| `demo-sandbox` | `npm run test:e2e -- --grep @claim:demo-sandbox` | PASS |
| `csv-import` | `npm run test:e2e -- --grep @claim:csv-import` | PASS |
| `period-integrity` | `npm run test:e2e -- --grep @claim:period-integrity` | PASS |
| `source-file-size` | `npm run test:e2e -- --grep @claim:source-file-size` | PASS |
| `encrypted-pack` | `npm run test:e2e -- --grep @claim:encrypted-pack` | PASS |
| `free-core-export` | `npm run test:e2e -- --grep @claim:free-core-export` | PASS |
| `local-only` | `npm run test:e2e -- --grep @claim:local-only` | PASS |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS |
| `custom-checklist` | `npm run test:e2e -- --grep @claim:custom-checklist` | PASS |
| `readiness` | `npm run test:e2e -- --grep @claim:readiness` | PASS |
| `standalone-install` | `npm run test:e2e -- --grep @claim:standalone-install` | PASS |
| `paid-license` | `npm run test:e2e -- --grep @claim:paid-license` | PASS |
| `checkout-unavailable` | `npm run test:e2e -- --grep @claim:checkout-unavailable` | PASS |

### Cold live first read

In a new 1440 × 900 browser context, the live landing page gave this answer without scrolling:

- **What it does:** “Prepare your quarterly evidence handoff.”
- **Who it is for:** UK sole traders who keep local books and need a clear pack for an accountant or filing software.
- **What to click first:** the visible **Try it with sample data** action; its adjacent text says it loads one sample quarter and saves nothing.

That action opens the populated sample in one click. The sample has the persistent **Demo — sample data, nothing is saved** banner with **Reset demo** and **Start for real**. This passes the plain-words and demo-sandbox acceptance gate.

## Local quality gates

| Check | Evidence | Result |
| --- | --- | --- |
| Unit and browser suite | `npm test` | PASS — final Playwright result passed; unit phase completed before it |
| Type/lint | `npm run lint` (`tsc --noEmit`) | PASS |
| Production build | `npm run build` | PASS; generated `dist/` |
| URL baseline | `npm run verify:url -- https://mtd-evidence-pack.sociobot.in` | PASS: `lang=en-GB`, one h1, main landmark, no missing image alt or unlabeled button |
| Dependency audit | `npm audit --omit=dev` | PASS: 0 vulnerabilities |
| Mobile performance harness | `npm run test:e2e -- --grep @performance` | PASS: throttled 390 px LCP 812 ms, interaction 48 ms, initial JS 2,165 B, CSS 5,199 B |

The complete built JavaScript is 69.1 KB gzip (including the deferred ZIP module); CSS is 4.9 KB gzip. Both are within the static-product budgets.

## Independent live product exercise

I tested the live deployment separately from its checked-in tests.

- A populated demo rejected `2026-02-30` and a blank amount with a clear error and recovery instruction. A subsequent valid CSV added one record and reported “1 record added. 13 total.”
- Space toggled a focused checklist checkbox. First Tab on a cold page focused **Skip to main content**.
- A live encrypted export produced `evidence-pack-2026-07-05.zip`. Every entry was encrypted; it contained `README.txt`, `manifest.json`, `records/transactions.csv`, `summary/quarterly-handoff.pdf`, three source files, a 12-record manifest, valid 64-character SHA-256 hashes, and a `%PDF-1.4` summary. The entered password was not in local storage.
- On a fresh visit, the live service worker controlled the page and fully precached its five manifest-required entries in `mtd-evidence-pack-v1.0.7`. With the browser forced offline, `/demo` reloaded and exported the encrypted sample pack without console or page errors. The worker uses a versioned cache plus `skipWaiting` and `clients.claim`; `registration.update()` completed cleanly. A real two-version update transition cannot be created from a single deployed candidate.
- At 390 × 844, the demo had 0 px horizontal overflow. With reduced motion, the hero animation was `none` and transition duration was effectively zero.

## Accessibility, routes, privacy, and deployment

- Axe via Playwright found zero serious or critical violations on `/`, `/demo`, `/workspace`, `/privacy`, `/terms`, `/missing-page`, and the 390 px demo. Each route has exactly one h1 and one main landmark. `/missing-page` returns HTTP 404 with the designed recovery page.
- The only console error in the route sweep was the expected network message for the intentionally requested 404; all normal routes were error-free.
- Every discovered internal link returned 200; `mailto:privacy@sociobot.in` was valid as a mail link and the Param Factory external link returned 200.
- A cold/demo/import flow request log contained only `https://mtd-evidence-pack.sociobot.in`. No analytics, font CDN, HMRC, bank, Azure, or AI traffic was requested. The optional licence-restore action is the sole configured external origin (`https://api.sociobot.in`), disclosed on the privacy page.
- Live response headers include a self-restricted CSP with `frame-ancestors 'none'`, HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and a restrictive permissions policy. Hashed assets send `Cache-Control: public, max-age=31536000, immutable`; documents use a short revalidation policy.
- The optional live Sociobot verify endpoint was tested with 40 fresh sequential invalid-token requests from one client. Requests 1–30 returned 200. Requests 31–40 returned **429**; the first 429 included `Retry-After: 4` and `X-RateLimit-After: 4`. Observed allowance: **30 requests per client window**.
- All 22 publicly served candidate build artifacts (HTML, PWA files, routes/404, assets, icons, manifest, worker, robots, and sitemap) matched the deployed bytes exactly.

## Defects by severity

| Severity | Findings |
| --- | --- |
| Critical | None |
| High | None |
| Medium | None |
| Low | None |

## Scope notes

This is a static local-first PWA: there is no sign-in flow, product backend, HMRC credential handling, bank connection, AI feature, library package, or CLI. Entra, backend concurrency/persistence, and consumer package checks therefore do not apply. New licences remain deliberately unavailable, but core CSV import, custom checklist maintenance, attachments, and encrypted export are available without a licence; the public copy and its tagged claim accurately state this limitation.

The Lighthouse CLI itself could not complete in this container because its Chrome tab crashed during startup. This was a tool-environment failure, not a page failure; the independent Playwright mobile performance and axe checks above completed successfully and cover the applicable performance and Lighthouse-class baselines.
