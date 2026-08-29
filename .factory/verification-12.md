# Independent verification 12 — PASS

- **Work order:** `mtd-evidence-pack-verify-12`
- **Candidate commit:** `0bf1aa717291853801883ef65ac9b7a01527c295`
- **Verified URL:** <https://mtd-evidence-pack.sociobot.in>
- **Date:** 29 August 2026
- **Decision:** **PASS**

Fresh evidence confirms the live deployment is the candidate rather than a stale deployment. The locally built `dist/index.html` and live document share SHA-256 `a29f7d4169a5071d28e31c27bd3b0533ad1305dd57367cf7cd5a26d518838643`; every published JS, CSS, image, manifest, service worker, offline page, 404 asset, and asset manifest also matched the local production build byte-for-byte. The page reports `v1.0.11`, matching this candidate.

## Cold first read

In an empty browser context the first screen says **“Prepare your quarterly evidence pack.”** It says it is **for UK sole traders who keep local books** and need a pack for **an accountant or filing software**. The first primary action is **“Try it with sample data,”** immediately explained as loading 12 records, 3 source files, and one open check without saving anything. It answers what, who for, and what to click first in plain words, and meets the one-click demo contract.

## Required claims — run first from this clean checkout

`npm ci` succeeded (0 reported vulnerabilities). `.factory/claims.json` exists. Before any other QA, each of its 16 declared commands was run individually against the demo entry point; all passed (one Playwright test each; logs at `/tmp/mtd-claims-12/`).

| Claim | Exact command | Result |
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

This covers the useful normal and recovery path: valid and malformed CSV, invalid dates and blank amounts, atomic mixed-period rejection, inclusive date boundaries, 10 MB source-file limit, checklist persistence and readiness, ZIP password failure plus required contents/hashes, no saved password, unlicensed export, demo separation, local-only requests, and offline export.

## Local and deployed suite

- `npm test`: **PASS** — 9 Vitest tests and 38 Playwright tests.
- `npm run lint`: **PASS** — `tsc --noEmit`.
- `npm run build`: **PASS** — production `dist/` created.
- `PLAYWRIGHT_BASE_URL=https://mtd-evidence-pack.sociobot.in npm run test:e2e`: **PASS** — 38/38 on the live deployment.
- `npm run verify:url -- https://mtd-evidence-pack.sociobot.in`: **PASS** — HTTP 200, `lang=en-GB`, one h1, main landmark, no missing alt/unlabelled controls, no browser errors.

Build output: 69.48 KB gzip JavaScript total (2.01 + 2.22 + 10.80 + 54.45 KB), 4.96 KB gzip CSS, no webfonts, and a 4.9 KB mobile hero. The live 390 px throttled test passed LCP <2.5 s, interaction <=200 ms, JS <=200 KB, and CSS <=50 KB.

## Browser, privacy, PWA, and platform checks

- `/`, `/demo`, `/workspace`, `/privacy`, `/terms`, `robots.txt`, and `sitemap.xml` return 200; an unknown URL returns the designed 404 with HTTP 404.
- Fresh desktop and 390 px mobile flows had no console or page errors; mobile `scrollWidth === clientWidth === 390`. Deployed tests pass 200% text reflow, sticky demo banner, history/focus restoration, and keyboard Space operation.
- Tab starts at the skip link. Sampled interactive elements show a 3 px solid visible focus outline. Reduced motion yields 0.00001 s transitions/animations.
- Fresh `/demo` request logging found only the product origin. No analytics, CDN fonts, HMRC, bank, or AI request occurred. The tested real-workspace flow persists only to local IndexedDB. The optional documented Sociobot licence request occurs only after an explicit token.
- The live service worker controls `/demo`, its `mtd-evidence-pack-v1.0.11` cache is active, and `registration.update()` succeeded. After first visit, an offline reload restored the demo with 12 records and no errors; the live claim suite also completed offline encrypted export.
- Manifest, standalone display, local PWA icons, cache update, and offline behavior pass. There is no sign-in or HMRC credential path.
- Headers include HSTS, `nosniff`, strict-origin referrer policy, restrictive permissions policy, and a self-only CSP with response-header `frame-ancestors 'none'`. HTML/manifest/service worker cache for 30 seconds; hashed assets use `public, max-age=31536000, immutable`.
- Axe scans of landing, demo, workspace, Privacy, Terms, and 404 have **zero serious or critical findings**.
- The Sociobot licence verification endpoint received 35 unique invalid-token requests from one client: requests 1–30 returned 200; 31–35 returned **429** with **`Retry-After: 4`**. Observed allowance: **30 verification requests per client window**.

## Defects by severity

### P2 — non-blocking accessibility advisory

`/workspace` has one axe **moderate** `landmark-complementary-is-top-level` result: the licence-restoration `aside` is nested in the main working section. It is below the required serious/critical acceptance threshold and does not break the tested keyboard flow. A later polish should use a regular section or a top-level complementary landmark.

### P1 / P0

None.

## Conclusion

The candidate meets the brief: a local-first PWA for UK sole traders to import categorised CSV records, maintain a quarter checklist, attach evidence, identify missing work, and export an encrypted accountant/compatible-software handoff, without tax calculation or HMRC submission. The earlier deployment-only concern is not reproduced; current live content is byte-identical to candidate `0bf1aa717291853801883ef65ac9b7a01527c295`.
