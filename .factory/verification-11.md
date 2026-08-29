# Independent verification 11 — PASS

- **Work order:** `mtd-evidence-pack-verify-11`
- **Candidate commit:** `3d7fce1d05ae38b060513f5161dcbe109c7b97d2`
- **Verified live URL:** <https://mtd-evidence-pack.sociobot.in>
- **Date:** 29 August 2026
- **Decision:** **PASS**. The deployed application is byte-identical to this candidate's built HTML, entry script, and stylesheet, all release-blocking claim and quality checks passed, and the sole recorded defect is a non-blocking moderate axe advisory.

## Cold first read

On an empty browser context, the first screen says **“Prepare your quarterly evidence pack”**. It states that it is for UK sole traders who keep local books and need a pack for an accountant or filing software. The first primary action is **“Try it with sample data”** and directly explains that it loads 12 records, three source files, and one open check without saving anything. This satisfies the plain-words and one-click-demo contract.

## Required claims, run first from the clean checkout

`npm ci` completed with 0 reported vulnerabilities. Every command declared in `.factory/claims.json` was run individually, exactly as declared, against the product's bundled demo entry point. Each Playwright command reported one passing test; its final `test-results/.last-run.json` is `{"status":"passed","failedTests":[]}`.

| Claim | Exact declared command | Result |
|---|---|---|
| `demo-sandbox` | `npm run test:e2e -- --grep @claim:demo-sandbox` | PASS |
| `sample-content` | `npm run test:e2e -- --grep @claim:sample-content` | PASS |
| `csv-import` | `npm run test:e2e -- --grep @claim:csv-import` | PASS |
| `period-integrity` | `npm run test:e2e -- --grep @claim:period-integrity` | PASS |
| `source-file-size` | `npm run test:e2e -- --grep @claim:source-file-size` | PASS |
| `encrypted-pack` | `npm run test:e2e -- --grep @claim:encrypted-pack` | PASS |
| `free-evidence-pack` | `npm run test:e2e -- --grep @claim:free-evidence-pack` | PASS |
| `local-only` | `npm run test:e2e -- --grep @claim:local-only` | PASS |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS |
| `custom-checklist` | `npm run test:e2e -- --grep @claim:custom-checklist` | PASS |
| `readiness` | `npm run test:e2e -- --grep @claim:readiness` | PASS |
| `standalone-install` | `npm run test:e2e -- --grep @claim:standalone-install` | PASS |
| `paid-license` | `npm run test:e2e -- --grep @claim:paid-license` | PASS |
| `checkout-unavailable` | `npm run test:e2e -- --grep @claim:checkout-unavailable` | PASS |
| `no-tax-submission` | `npm run test:e2e -- --grep @claim:no-tax-submission` | PASS |
| `artwork-provenance` | `npm run test:e2e -- --grep @claim:artwork-provenance` | PASS |

These cover the representative job path and recovery cases: the seeded quarter, CSV import, impossible dates and blank amounts, atomic rejection of an out-of-period mixed file, 10 MB source-file limit, checklist persistence, readiness state, encrypted ZIP contents/password failure, no-password persistence, and the free unlicensed workflow. The ZIP claim opens the downloaded archive, checks password failure and the required CSV, PDF, source files, manifest, and SHA-256 hashes.

## Local build and live parity

- `npm test`: **PASS** — 9 Vitest unit tests and 36 Playwright tests.
- `npm run lint`: **PASS** — TypeScript `--noEmit`.
- `npm run build`: **PASS** — production `dist/` generated.
- `PLAYWRIGHT_BASE_URL=https://mtd-evidence-pack.sociobot.in npm run test:e2e`: **PASS** — 36/36 deployed-browser tests.
- `npm run verify:url -- https://mtd-evidence-pack.sociobot.in`: **PASS** — HTTP 200, `lang=en-GB`, one h1, main landmark, no missing image alt text, no unlabelled buttons, and no browser errors.

The local `dist/index.html`, deployed `/`, entry script, and stylesheet have matching SHA-256 values and byte-for-byte `cmp` results. The deployed UI reports `v1.0.10`, which is the candidate build version.

Vite reports 69.09 KB gzip total JavaScript (1.86 + 2.21 + 10.57 + 54.45 KB) and 4.96 KB gzip CSS; there are no webfont files. The mobile hero is 4.9 KB. This is within the PWA budgets. A fresh mobile Lighthouse run against the live deployment scored **100 Performance / 100 Accessibility / 100 Best Practices / 100 SEO**, with FCP 910 ms, LCP 1,077 ms, TBT 77 ms, and CLS 0.

## Live product, privacy, PWA, and platform checks

- Normal routes `/`, `/demo`, `/workspace`, `/privacy`, and `/terms` returned 200 with route-specific titles and one h1; the unknown route returned the designed 404 with HTTP 404. Sitemap, robots, internal links, and the external Sociobot link resolved as expected.
- Cold and demo-to-real Playwright request logs contained only product-origin document/assets. A fresh real-workspace CSV import persisted in `mtd-evidence-pack:v1` IndexedDB; no analytics, CDN font, bank, HMRC, AI, or other third-party request occurred. The optional, documented licence API is only contacted when a licence is supplied.
- The optional Sociobot licence verification endpoint was tested sequentially from this single client with invalid tokens. Requests 1–30 returned 200; requests 31–35 returned **429** with **`Retry-After: 3, 3, 3, 2, 2`** seconds. Observed allowance: **30 verification requests per client window**.
- The PWA has a valid standalone manifest with 192/512 icons. On live `/demo`, service worker `mtd-evidence-pack-v1.0.10` was active and controlling the page, `registration.update()` completed, and its cache was populated. After `context.setOffline(true)`, an offline reload showed the 12-record demo correctly without errors. The deployed suite additionally verifies the update-announcement state and an offline encrypted ZIP download.
- Live responses include HSTS, nosniff, strict-origin referrer policy, restrictive permissions policy, and a self-only CSP with the disclosed Sociobot licence API in `connect-src`; `frame-ancestors 'none'` is correctly delivered as a response header. HTML/manifest/service-worker cache for 30 seconds and hashed `/assets/*` cache for one year immutable.
- Desktop and 390 px mobile were exercised. Mobile had `scrollWidth === clientWidth === 390`, no visible interactive target below 44 px, and keyboard Tab exposed a 3 px `#8D332E` focus outline on every traversed action. Enter on the sample-data link navigates to the demo. With `prefers-reduced-motion: reduce`, the checked UI transition duration was `0.00001s` and no animations ran.
- Axe scans of landing, demo, workspace, privacy, terms, and 404 found **zero serious or critical violations**. Cold page, product flow, offline flow, and URL verifier recorded no console or page errors. There is no sign-in, product backend, HMRC credential, or external persistence component to verify.

## Defects by severity

### P2 — non-release-blocking accessibility advisory

On `/workspace`, axe reports one **moderate** `landmark-complementary-is-top-level` violation. The licence-restoration `aside` is nested inside the main working section rather than being a top-level complementary landmark. This is not serious or critical and does not block the requested acceptance threshold, but should be corrected in a later accessibility polish by using a non-`aside` section or moving the complementary landmark to a valid top-level position.

### P1 / P0

None.

## Conclusion

The candidate meets the researched brief: it is a local-first PWA for a UK sole trader to import categorised records, maintain a period checklist, attach evidence, and produce an encrypted accountant/compatible-software handoff without attempting tax calculation or HMRC submission. Release is approved subject only to the recorded non-blocking P2 accessibility cleanup.
