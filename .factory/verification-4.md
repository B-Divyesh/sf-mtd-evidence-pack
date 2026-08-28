# Independent verification 4 — MTD Evidence Pack

Date: 28 August 2026
Verifier work order: `mtd-evidence-pack-verify-4`
Candidate commit: `3b2ccf6843c7fb168c00126114d2b06272f454b3`
Live URL: <https://mtd-evidence-pack.sociobot.in>

## Verdict

**FAIL — do not release.** Fresh evidence establishes two release blockers:

1. The required clean local `npm test` quality gate fails its checked-in mobile performance assertion. A focused production-build retry measured **307 ms total blocking time**, above the required **<= 200 ms**.
2. The core brief requires a user-maintained quarterly checklist. A new real workspace has both **Add your own check** controls disabled and has no working purchase path to enable them. Only a pre-existing verified licence can enable the feature. A new sole trader therefore cannot maintain the checklist required for their own accountant or filing-software handoff.

The deployed site does match the candidate. This is not a deployment-only failure.

## Clean-install and declared-claim evidence

The repository was already at the requested candidate. The pre-existing uncommitted verifier documents were not treated as evidence. I ran `npm ci` successfully (63 audited packages, zero reported vulnerabilities), then ran every exact command declared in `.factory/claims.json` separately, against the shipped `/demo` entry point and sample data:

| Claim | Exact command | Result |
| --- | --- | --- |
| `demo-sandbox` | `npm run test:e2e -- --grep @claim:demo-sandbox` | PASS — changing a sample check disappears on reload and demo never opens the real IndexedDB database. |
| `csv-import` | `npm run test:e2e -- --grep @claim:csv-import` | PASS — rejects an impossible calendar date and blank/whitespace amounts; then imports a valid two-row categorized CSV. |
| `source-file-size` | `npm run test:e2e -- --grep @claim:source-file-size` | PASS — accepts exactly 10 MiB and rejects 10 MiB plus one byte without displacing the accepted source file. |
| `encrypted-pack` | `npm run test:e2e -- --grep @claim:encrypted-pack` | PASS — wrong password cannot read the ZIP; correct password reveals CSV, PDF, source files, manifest, SHA-256 hashes, and no saved password. |
| `free-core-export` | `npm run test:e2e -- --grep @claim:free-core-export` | PASS — an unlicensed demo exports the encrypted core pack. |
| `local-only` | `npm run test:e2e -- --grep @claim:local-only` | PASS — an imported real-workspace record persists in `mtd-evidence-pack:v1`; the request log contains only the product origin. |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS — after initial visit, offline `/demo` reload retains the Rowan Field Studio sample. |
| `paid-license` | `npm run test:e2e -- --grep @claim:paid-license` | PASS — a recorded successful licence verification enables custom checks and cover notes. |

No declared claim failed. Landing and README claim-like copy was cross-checked against this list: offline-after-first-visit, local browser storage, free core export, 10 MB source limit, encrypted ZIP contents/password non-retention, demo isolation, CSV validation, and licence functionality all have declared observable tests.

## First-read and workflow evidence

**First-read: PASS.** In a cold, uncached 390 px live browser context, the first screen says:

- **What it does:** “Prepare your quarterly evidence handoff.”
- **For whom:** “For UK sole traders who keep local books and need a clear pack for an accountant or filing software.”
- **What to click first:** the visible, one-click **Try it with sample data** action, with “Loads one sample quarter. Nothing is saved.” alongside it.

The action opens `/demo` and a populated Rowan Field Studio quarter. It displays the required persistent **Demo — sample data, nothing is saved** banner with **Reset demo** and **Start for real**. The initial live request log contained only `https://mtd-evidence-pack.sociobot.in` and no console errors.

End-to-end claim flows exercise a representative populated quarter, valid and invalid CSV recovery, the 10 MiB boundary, source-file retention on rejection, password-encrypted ZIP export, demo reset, transition to a persistent real workspace, and offline sample reload. The product accurately presents itself as preparation only: it is not tax advice or filing software and contains no HMRC submission or credential flow.

## Core brief gap

The researched smallest useful product says it “checks completeness against a **user-maintained period checklist**.” In a fresh real workspace reached through `/demo` → **Start for real**, independent browser inspection found:

```text
customInputDisabled: true
customButtonDisabled: true
coverNoteDisabled: true
notice: “Already have a supported-edition licence? Verify it to use saved cover notes and custom checklist items.”
```

The public routes intentionally advertise no checkout link or price, and the checked-in test asserts checkout must not be advertised. Thus a new user can tick the seven fixed items but cannot add, remove, or otherwise maintain their own checklist. This is not merely an optional enhancement: it prevents delivery of the brief’s required, accountant-agreed checklist workflow.

## Local quality gates

| Command | Result |
| --- | --- |
| `npm ci` | PASS — clean dependency installation. |
| `npm run lint` | PASS — `tsc --noEmit`. |
| `npm run build` | PASS — production `dist/` generated. |
| `npm test` | **FAIL** — all seven Vitest CSV tests pass; the Playwright mobile performance assertion fails. |
| `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4174 npm run test:e2e -- --grep @performance` against a fresh production preview | **FAIL** — **307 ms** total blocking time; long tasks 171 ms and 236 ms; limit is <= 200 ms. |

The build reports initial application JavaScript of **30.84 kB raw / 11.15 kB gzip** and CSS of **18.29 kB raw / 4.80 kB gzip**, within the static-product budgets. The deferred ZIP dependency is 54.45 kB gzip and the mobile hero image is 12,534 bytes. The failure is main-thread blocking work under the required 4x CPU-throttled test, not transfer size.

For comparison only, the complete live browser suite (`PLAYWRIGHT_BASE_URL=https://mtd-evidence-pack.sociobot.in npm run test:e2e`) passed and happened to measure 163 ms. It does not override the mandatory clean local quality gate, which failed both in the complete suite and again in the focused production-preview retry.

## Live deployment, PWA, privacy, and accessibility

- Every publicly served build artifact matched the local `dist/` candidate by SHA-256: HTML, all JS/CSS chunks, WebP art, icons, manifest, service worker, offline page, robots, and sitemap. `staticwebapp.config.json` correctly is not publicly served. Candidate deployment parity therefore **passes**.
- `npm run verify:url -- https://mtd-evidence-pack.sociobot.in` **passed**: HTTP 200, title `MTD Evidence Pack — prepare a quarterly handoff`, `lang=en-GB`, one `h1`, a `main`, image alt attributes, labelled buttons, and no browser console errors.
- The live full Playwright suite passed all routes `/`, `/demo`, `/workspace`, `/privacy`, `/terms`, and the designed missing-page route. Its axe integration found **zero serious or critical** violations on each route. Each had one `h1` and one `main`.
- Keyboard tests passed: cold Tab starts on the skip link, client navigation focuses the destination heading, and Space toggles a checklist control. Manual Tab inspection found a visible `3px solid rgb(233, 104, 85)` focus outline. At 390 x 844, live `/demo` had zero horizontal overflow; mobile control and mobile axe checks passed.
- Reduced-motion inspection shows hero animation `none` and `scroll-behavior: auto`. No console/page errors were reported during live route or workflow checks.
- Service worker version `mtd-evidence-pack-v1.0.3` precaches the shell and public assets. The live suite passed its update-announcement check and its actual `context.setOffline(true)` reload of `/demo`, retaining the sample after the first visit.
- A live demo → real workspace → CSV import request log contained only the same product origin. No analytics, HMRC, bank, Azure, or font-CDN traffic was observed. The optional licence verification endpoint is the only allowlisted external `connect-src` origin. There is no sign-in, backend product API, AI feature, library, or CLI; Entra, consumer-install, concurrency, and persistence-boundary checks do not apply.
- Live document and asset responses send a self-restricted CSP (plus only `https://api.sociobot.in` for licence verification), HSTS, `nosniff`, strict-origin referrer policy, restrictive permissions policy, and `frame-ancestors 'none'`.

## Headers, caching, and allowance

Document, manifest, and service-worker responses have `Cache-Control: public, must-revalidate, max-age=30`; primary hashed JS and CSS and the ZIP chunk use `public, max-age=31536000, immutable`.

### Low — content-hashed deferred export chunk is not immutable

`/assets/export-DxcVyV6k.js` is content-hashed but is served with `public, must-revalidate, max-age=30`. The static-host route configuration only covers `/assets/index-*` and `/assets/zip-*`, omitting the deferred export chunk. Offline reload and encrypted export still passed because the service worker caches it when used, but this misses the stated immutable hashed-asset caching policy.

The optional licence verification endpoint was exercised with 40 sequential invalid-token requests from one client. Requests **1–30** returned HTTP 200. Request **31** and every subsequent request returned HTTP **429** with `Retry-After: 3` (also `X-RateLimit-After: 3`). Observed allowance: **30 requests per client window**. This rate-limit requirement passes.

## Defects and retest criteria

### High — core user-maintained checklist is inaccessible to new users

Make custom checklist maintenance available to a normal new user, or provide a functioning one-time purchase/restore path that a new user can obtain. Re-test the unlicensed real workspace, not just the demo or a mocked valid licence.

### High — mandatory mobile performance gate fails

Reduce main-thread blocking work until both `npm test` and the focused `@performance` command reliably pass the checked-in `<= 200 ms` assertion from a clean install and production preview.

### Low — immutable cache coverage is incomplete

Apply the immutable cache policy to every content-hashed `/assets/*` output, including `export-DxcVyV6k.js`, then recheck its live response header.

After repair and deployment, rerun all eight exact claim commands, the clean full test suite, production build, live parity/header checks, and the real unlicensed checklist workflow.
