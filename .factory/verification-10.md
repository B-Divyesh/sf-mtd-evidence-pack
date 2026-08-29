# Independent verification 10 — PASS

**Date:** 29 August 2026  
**Candidate:** `98b8d642c99b5b0f4192e47f5ffbc4d267973459`  
**Live URL:** <https://mtd-evidence-pack.sociobot.in>  
**Verdict:** **PASS**

The fresh evidence does not reproduce any deployment-only failure. The live deployment matches the tested candidate byte-for-byte for the document, manifest, worker, and all deployed JavaScript/CSS files checked.

## Mandatory first checks

### Claims gate — PASS

Starting from the clean candidate checkout, `npm ci` installed 62 packages and reported 0 vulnerabilities. Before broader QA, every test command declared in `.factory/claims.json` was run individually using the product's demo entry point. All passed.

| Claim | Exact command | Result |
| --- | --- | --- |
| `demo-sandbox` | `npm run test:e2e -- --grep @claim:demo-sandbox` | PASS — 1 test |
| `csv-import` | `npm run test:e2e -- --grep @claim:csv-import` | PASS — 1 test |
| `period-integrity` | `npm run test:e2e -- --grep @claim:period-integrity` | PASS — 1 test |
| `source-file-size` | `npm run test:e2e -- --grep @claim:source-file-size` | PASS — 1 test |
| `encrypted-pack` | `npm run test:e2e -- --grep @claim:encrypted-pack` | PASS — 1 test |
| `free-core-export` | `npm run test:e2e -- --grep @claim:free-core-export` | PASS — 1 test |
| `local-only` | `npm run test:e2e -- --grep @claim:local-only` | PASS — 1 test |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS — 1 test |
| `custom-checklist` | `npm run test:e2e -- --grep @claim:custom-checklist` | PASS — 1 test |
| `readiness` | `npm run test:e2e -- --grep @claim:readiness` | PASS — 1 test |
| `standalone-install` | `npm run test:e2e -- --grep @claim:standalone-install` | PASS — 1 test |
| `paid-license` | `npm run test:e2e -- --grep @claim:paid-license` | PASS — 1 test |
| `checkout-unavailable` | `npm run test:e2e -- --grep @claim:checkout-unavailable` | PASS — 1 test |

### Cold live first read — PASS

In a new browser context, without scrolling, the page said:

- **What it does:** “Prepare your quarterly evidence pack.”
- **For whom:** UK sole traders who keep local books and need a clear pack for an accountant or filing software.
- **What to do first:** click **Try it with sample data**.

The adjacent explanation says “Loads one sample quarter. Nothing is saved.” The one-click action opened a populated sample workspace with a persistent demo banner, reset, and start-real controls. This satisfies the plain-words and demo-sandbox first-screen gate.

## Repository and production checks

| Check | Evidence | Result |
| --- | --- | --- |
| Candidate identity | `git rev-parse HEAD` = `98b8d642c99b5b0f4192e47f5ffbc4d267973459` | PASS |
| Unit + browser suite | `npm test` | PASS — 9 Vitest + 32 Playwright tests |
| Type check | `npm run lint` | PASS — `tsc --noEmit` |
| Production build | `npm run build` | PASS — `dist/` created |
| Dependency audit | `npm audit --omit=dev` | PASS — 0 vulnerabilities |
| URL smoke test | `npm run verify:url -- https://mtd-evidence-pack.sociobot.in` | PASS — title, lang, h1, main, alt text, labelled buttons, no browser errors |
| Full live suite | `PLAYWRIGHT_BASE_URL=https://mtd-evidence-pack.sociobot.in npm run test:e2e` | PASS — 32/32 |
| Candidate/live identity | SHA-256 of `index.html`, asset manifest, manifest, worker, and all five served JS/CSS assets | PASS — 10/10 exact matches |

The production build is within budget: 1.87 KB gzip entry JavaScript, 69.15 KB gzip for all JS chunks, and 4.96 KB gzip CSS. The large ZIP/export code is deferred.

## End-to-end, accessibility, and PWA

The executed claim and full browser suites cover representative sample and real-workspace workflows, invalid calendar dates/amounts, atomic rejection of outside-period files, 10 MB source-file boundary handling, appended imports, checklist persistence, readiness states, encrypted ZIP export and wrong-password recovery, and licence restore fixture handling.

- Axe found **zero serious or critical** violations on landing, demo, workspace, privacy, terms, designed 404, and the 390 px project.
- Keyboard tests passed: skip link, client-route focus transfer, Space checklist operation, visible focus and in-view CSV/source import controls.
- 390 px layout, persistent demo banner, and 200% text reflow passed without horizontal overflow.
- Full live tests passed the real service-worker offline reload and encrypted sample export after first visit. The versioned worker (`mtd-evidence-pack-v1.0.9`) uses `skipWaiting` and `clients.claim`; the update-announcement test passed.
- Manifest is standalone with versioned start URL and real 192/512 maskable icons.
- Fresh mobile Lighthouse evidence is saved at `.factory/verification-evidence-10/lighthouse-live.json`: **100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO**; FCP 0.9 s, LCP 0.9 s, TBT 20 ms, CLS 0.

## Privacy, headers, and allowance

An independent fresh Playwright flow (`/?demo=1` → Start for real → CSV import) recorded five requests, all to `https://mtd-evidence-pack.sociobot.in`: document, entry JS, CSS, hero image, and app chunk. There were no failed, analytics, font-CDN, HMRC, bank, AI, or other third-party requests. The checked-in `local-only` live claim independently asserts the same origin restriction while verifying IndexedDB persistence after leaving demo mode.

Live normal routes returned 200 and the designed unknown route returned 404. Browser response headers included a self-only CSP (with only the disclosed optional `https://api.sociobot.in` licence API in `connect-src`), `frame-ancestors 'none'`, HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and restrictive permissions policy. HTML/worker/manifest cache for 30 seconds; hashed assets use `public, max-age=31536000, immutable`.

The product has no product backend, sign-in, HMRC credentials, or server persistence. Its optional Sociobot licence verification endpoint was probed sequentially from one client using an invalid token: requests 1–30 were 200; requests 31–35 were **429**, each with **`Retry-After: 3`**. Observed allowance: **30 verification requests per client window**.

## Defects by severity

None found. This PWA meets the researched brief: it remains local-first, does not provide tax advice or filing submission, preserves source evidence, checks a selected quarter, and exports a password-protected accountant/software handoff.
