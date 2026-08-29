# Independent verification 9 — FAIL

**Date:** 29 August 2026

**Candidate tested:** `20c1706a621698a4561198ff6d074faad6715bb8`

**Live URL:** <https://mtd-evidence-pack.sociobot.in>
**Verdict:** **FAIL** — the two essential file-import controls have no visible keyboard focus. This violates the non-negotiable accessibility contract for the product's core workflow.

The previously reported deployment concern is not present in this fresh run. A production build from the candidate matched all 26 publicly served build files byte-for-byte.

## Required checks performed first

### Claims gate — PASS

The checkout started clean at the requested commit. `npm ci` installed 62 packages, audited 63, and found zero vulnerabilities. I then ran every exact `test` command in `.factory/claims.json` separately before broader inspection. Each command ran one passing Playwright test.

| Claim | Exact command | Fresh result |
| --- | --- | --- |
| `demo-sandbox` | `npm run test:e2e -- --grep @claim:demo-sandbox` | PASS — 1 passed |
| `csv-import` | `npm run test:e2e -- --grep @claim:csv-import` | PASS — 1 passed |
| `period-integrity` | `npm run test:e2e -- --grep @claim:period-integrity` | PASS — 1 passed |
| `source-file-size` | `npm run test:e2e -- --grep @claim:source-file-size` | PASS — 1 passed |
| `encrypted-pack` | `npm run test:e2e -- --grep @claim:encrypted-pack` | PASS — 1 passed |
| `free-core-export` | `npm run test:e2e -- --grep @claim:free-core-export` | PASS — 1 passed |
| `local-only` | `npm run test:e2e -- --grep @claim:local-only` | PASS — 1 passed |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS — 1 passed |
| `custom-checklist` | `npm run test:e2e -- --grep @claim:custom-checklist` | PASS — 1 passed |
| `readiness` | `npm run test:e2e -- --grep @claim:readiness` | PASS — 1 passed |
| `standalone-install` | `npm run test:e2e -- --grep @claim:standalone-install` | PASS — 1 passed |
| `paid-license` | `npm run test:e2e -- --grep @claim:paid-license` | PASS — 1 passed |
| `checkout-unavailable` | `npm run test:e2e -- --grep @claim:checkout-unavailable` | PASS — 1 passed |

The test source contains each declared `@claim:<id>` exactly once. Landing and README claims map to these entries; I found no additional material behavioural claim that changes the verdict.

### Cold live first read — PASS

In a fresh 1440 × 900 browser context, before scrolling:

- **What it does:** “Prepare your quarterly evidence pack.”
- **For whom:** UK sole traders who keep local books and need a pack for an accountant or filing software.
- **What to click first:** **Try it with sample data**.
- The adjacent explanation says, “Loads one sample quarter. Nothing is saved.”

The action is on the first screen and opens the populated Rowan Field Studio quarter in one click. The resulting screen includes the demo notice, 12 records, three source files, seven checklist items, and the reset/start-real actions. The mandatory first-read and one-click-demo gate therefore passes.

## Candidate identity and repository gates

| Check | Fresh evidence | Result |
| --- | --- | --- |
| Checkout | `git rev-parse HEAD` → `20c1706a621698a4561198ff6d074faad6715bb8`; initially clean | PASS |
| Install | `npm ci` | PASS; 0 vulnerabilities |
| Full suite | `npm test` | PASS; 9 unit + 27 browser tests |
| Type/lint | `npm run lint` | PASS (`tsc --noEmit`) |
| Production build | `npm run build` | PASS; `dist/` produced |
| Dependency audit | `npm audit --omit=dev` | PASS; 0 vulnerabilities |
| URL baseline | `npm run verify:url -- https://mtd-evidence-pack.sociobot.in` | PASS; title, `lang=en-GB`, one h1, main, alt text, labels, and console |
| Live browser suite | `PLAYWRIGHT_BASE_URL=https://mtd-evidence-pack.sociobot.in npm run test:e2e` | PASS; 27 tests in 58.3 s |
| Candidate/live identity | SHA-256 comparison of every served `dist/` file except host-consumed `staticwebapp.config.json` | PASS; 26/26 exact matches |

The production build contains 68,286 gzip bytes of JavaScript across all four chunks and 4,922 gzip bytes of CSS. Only the 1,889-byte gzip entry chunk is needed for the static first screen; the app and export code are deferred.

## Independent end-to-end exercise

A separate fresh production browser context, not the checked-in test assertions, completed these paths without console or page errors:

- The real workspace began empty and disabled export until records existed.
- An end date before the start date produced a specific error; correcting the date cleared it.
- A missing CSV category header and a non-finite amount were rejected without adding records.
- Exact first/last period dates, a quoted comma, and a zero amount imported successfully.
- A second CSV appended rather than replacing the first import.
- A source file and a 100-character custom check were accepted.
- A seven-character ZIP password was blocked by browser validation. Mismatched valid-length passwords produced the app's recovery message. Correcting them downloaded `evidence-pack-2026-07-05.zip`.
- Records and the source file survived reload. Cancelling deletion preserved them; confirming deletion returned the workspace to its empty state.

A separate sample export contained seven encrypted entries: README, manifest, CSV, PDF, and three source files. All entries reported encryption, the CSV had 12 records, the PDF began `%PDF-1.4`, and all five manifest file hashes matched freshly calculated SHA-256 values.

## Accessibility and responsive checks

- Playwright Axe found zero serious or critical violations on `/`, `/demo`, `/workspace`, `/privacy`, `/terms`, the designed 404, and the 390 px views.
- Lighthouse accessibility scored 100.
- Route navigation and browser back/forward moved focus to the new h1. Space toggled a checklist item. The skip link moved focus to main.
- A 390 px scan found no visible interactive target below 44 px, no horizontal overflow, and the checked-in 200% text test passed.
- Under reduced motion the hero animation was `none`, transition duration was `0.01ms`, scroll behaviour was `auto`, and no infinite animation existed.
- Desktop and 390 × 844 first screens were visually inspected. Copy, hierarchy, and the one-click demo remained clear.

These automated results do not detect the blocking focus defect below.

## Privacy, headers, routing, and rate limiting

During a fresh live `/demo` load, boundary CSV import, and encrypted export, Playwright recorded seven requests: the document, same-origin CSS, image, and four same-origin JS chunks. The only observed origin was `https://mtd-evidence-pack.sociobot.in`; no analytics, font CDN, bank, HMRC, AI, or other third-party request occurred.

The main browser response included:

- `Content-Security-Policy` restricted to self, with only `https://api.sociobot.in` in `connect-src`; `frame-ancestors 'none'` is a response directive.
- `Strict-Transport-Security: max-age=10886400; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- HTML and worker documents use `public, must-revalidate, max-age=30`; hashed assets use `public, max-age=31536000, immutable`.

All normal routes returned 200 with one h1 and one main. The unknown route returned the designed 404. All useful internal links and the Param Factory external link returned 200; the privacy mail link was well formed.

The optional live licence flow sent an invalid token only to the documented Sociobot API, returned a clear error, and removed the rejected token from local storage. In a fresh sequential limit probe from one client, requests 1–30 returned 200 and requests 31–40 returned 429. The first 429 included `Retry-After: 3` (then 2 as the window elapsed). **Observed allowance: 30 verification requests per client window.**

There is no sign-in flow, product backend, HMRC credential handling, bank connection, analytics, runtime AI, library package, or CLI. Entra, backend concurrency/health/persistence, and consumer-package checks do not apply.

## PWA, offline, and performance

- The active worker and controller were both `/sw.js`.
- `registration.update()` completed. The checked-in live test also exercised the update announcement.
- Cache `mtd-evidence-pack-v1.0.8` held 16 entries. With the browser forced offline, `/demo` reloaded with Rowan Field Studio data and downloaded the encrypted sample pack with no browser errors.
- The manifest supplies standalone display, a versioned start URL, and real 192/512 icons. The 192, 512, and Apple icons have the declared dimensions.
- Fresh throttled live Playwright measurements: LCP 708 ms, longest interaction 56 ms, initial JS transfer 2,120 bytes, CSS transfer 5,380 bytes.
- Fresh Lighthouse 12.8.2 mobile run: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.1 s, TBT 0 ms, CLS 0.

## Defects by severity

### High — release blocking

**H1. Core file import controls have no visible keyboard focus.**

On both desktop and 390 px `/demo`, Tab reaches `[data-import-csv]` and `[data-import-docs]`, and Enter/Space can open the chooser. However, the actual focused input has `opacity: 0`; its 3 px outline is therefore invisible. The visible `.file-button` label has `outline: none` because there is no `:focus-within` treatment. During sequential keyboard traversal, focus also remained outside the viewport when it reached the transparent input, so there was no visual indication of the current control.

Measured for both controls at both widths:

```text
input.matches(':focus-visible') = true
input opacity = 0
input outline = rgb(141, 51, 46) solid 3px (invisible with the input)
visible label outline = none 0px
```

This blocks release under the attached accessibility baseline: every interactive element must be keyboard reachable, operable, and have a visible designed focus ring. These controls perform the core CSV and source-document import job.

### Medium

**M1. The required persistent demo banner is not persistent at 390 px.**

At desktop width the banner computes to `position: sticky` and remains at viewport y=0 after scrolling. The `max-width: 640px` rule changes it to `position: relative`. At 390 px after scrolling into the workspace it measured from y=-750.9 to -664.1 and was not visible. This removes the “sample data, nothing is saved”, reset, and start-real controls while a mobile user works lower on the long page, contrary to the demo-sandbox contract's persistent-banner requirement.

### Low

**L1. Generated hero-art provenance is internal only.**

`.factory/design.md` records the model, date, prompt, and original-asset provenance, but no public footer or About content discloses that the hero imagery was generated. The attached image-generation contract asks for public disclosure in the about/footer. This does not affect the core evidence workflow.

## Release decision

**FAIL.** The passing claims, correct deployment, strong privacy/security posture, complete workflow, and excellent performance do not override H1. Add a visible focus treatment to the styled file-control label (for example, a conforming `.file-button:focus-within` ring) and ensure focus scrolls the visible control into view. Retest both file controls by keyboard at desktop and 390 px. M1 and L1 should also be resolved before the next candidate.
