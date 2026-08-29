# Independent verification 7 — PASS

- **Work order:** `mtd-evidence-pack-verify-7`
- **Date:** 29 August 2026
- **Candidate commit:** `8e2be3c3da974b29b19616089699f94abf23e69b`
- **Live URL:** <https://mtd-evidence-pack.sociobot.in>
- **Artifact:** local-first static PWA

## Release decision

**PASS — release this candidate.** Fresh testing found no critical, high,
medium, or low product defect. The live deployment is the exact candidate,
the smallest useful workflow works end to end, every declared claim passes,
and the mandatory clean test/build gates pass.

New purchases remain intentionally unavailable because the factory billing
product is not enabled. The candidate does not show a price, checkout link, or
buy action. Existing licence restore remains functional, while the core import,
checklist, attachment, and encrypted export workflow is free. This is an honest
operational limitation, not a broken product path.

## Mandatory claims gate — run first

The clone began clean at the exact candidate. `.factory/claims.json` exists and
contains 12 entries. After the prerequisite `npm ci`, every listed command was
run independently before broader QA. All 12 passed.

| Claim | Result and observed evidence |
| --- | --- |
| `demo-sandbox` | PASS — sample changes disappeared on reload and demo mode opened no real IndexedDB database. |
| `csv-import` | PASS — invalid calendar dates and blank amounts were rejected; two later imports were additive. |
| `period-integrity` | PASS — both boundary dates imported; a mixed inside/outside file was rejected atomically and stale success cleared. |
| `source-file-size` | PASS — exactly 10 MiB attached; 10 MiB plus one byte was rejected without replacement. |
| `encrypted-pack` | PASS — wrong password failed; correct password opened CSV, PDF, source file, manifest, and valid SHA-256 hashes. |
| `free-core-export` | PASS — an unlicensed demo exported the complete encrypted pack. |
| `local-only` | PASS — a real record persisted in IndexedDB and the flow requested only the product origin. |
| `offline-reload` | PASS — after one visit, the sample reloaded offline and exported an encrypted ZIP. |
| `custom-checklist` | PASS — an unlicensed real workspace retained a custom check after reload. |
| `readiness` | PASS — the named open item appeared and completing it produced the ready state. |
| `standalone-install` | PASS — standalone manifest, versioned start URL, and 192/512 icons are present. |
| `paid-license` | PASS — the recorded valid Sociobot verdict enables saved cover notes. |

Each exact command was `npm run test:e2e -- --grep @claim:<id>` as listed in
the manifest. Every ID occurs exactly once as a test tag. The landing page and
README capability promises map to these entries. The sentence explaining that
new purchases are unavailable is a limitation, and a separate checked-in
regression confirms that no checkout, price, or buy copy appears.

## Cold first read

**PASS on desktop and 390 px mobile.** Before scrolling or interacting, a new
browser context shows:

- what it does: “Prepare your quarterly evidence handoff”;
- who it is for: UK sole traders keeping local books for an accountant or
  filing-software handoff;
- what to click: “Try it with sample data”;
- what happens next: “Loads one sample quarter. Nothing is saved.”

The same first viewport includes the offline, local-data, and free-core-export
facts. One click opens Rowan Field Studio's populated quarter and the persistent
“Demo — sample data, nothing is saved” banner with Reset demo and Start for
real.

Evidence:

- `verification-evidence-7/live-first-read-desktop.png`
- `verification-evidence-7/live-first-read-mobile-390.png`
- `verification-evidence-7/live-demo-mobile-390.png`

## Clean local gates

| Command | Result |
| --- | --- |
| `npm ci` | PASS — 62 packages added, 63 audited, 0 vulnerabilities. |
| all 12 claim commands | PASS independently. |
| `npm run lint` | PASS — `tsc --noEmit`. |
| `npm test` | PASS — 8/8 unit tests and 24/24 Playwright tests. |
| `npm run build` | PASS — exact Vite production build created `dist/`. |
| `npm audit --omit=dev` | PASS — 0 vulnerabilities. |
| `npm run verify:url -- https://mtd-evidence-pack.sociobot.in` | PASS — title, `en-GB`, one h1, main, image alternatives, labelled buttons, and no browser errors. |
| live Playwright suite | PASS — 24/24 against production. |

The local throttled browser test measured 732 ms LCP, 32 ms interaction
latency, 2,141 B initial JavaScript, and 5,199 B CSS. Production measured
664 ms LCP, 48 ms interaction, 2,095 B JavaScript, and 5,380 B CSS.

The build contains 3.88 kB raw / 1.84 kB gzip initial JavaScript and 18.74 kB
raw / 4.90 kB gzip CSS. The app chunk is deferred at 10.28 kB gzip; encryption
code is also deferred. The selected mobile hero is 4,874 bytes and no font is
downloaded. These are within the 200 kB JS, 50 kB CSS, 120 kB font, and 300 kB
hero budgets.

Lighthouse 12.8.2 mobile retry completed without a runtime error at 100
performance, 100 accessibility, 100 best practices, and 100 SEO. FCP was
902 ms, LCP 903 ms, TBT 36 ms, CLS 0, and transfer 67,770 bytes. The first
runner process reported a tab crash after still producing a complete 98/100/
100/100 report; the clean immediate retry is the release measurement.

Raw evidence:

- `verification-evidence-7/lighthouse-mobile.json`
- `verification-evidence-7/lighthouse-mobile-2.json`

## Independent end-to-end workflow

A separate live-browser flow, independent of the checked-in assertions,
completed the real job:

- demo began with 12 records, reset a changed check on reload, and created no
  real workspace database;
- Start for real opened a separate empty workspace;
- an inverted period produced a specific recovery message;
- an impossible date and blank amount were rejected without adding rows;
- start-date, end-date, positive, negative, and zero-value records imported;
- a second file added to the first four records instead of replacing them;
- a source index and custom check persisted across reload;
- a short password was invalid, and mismatched passwords gave a clear error;
- a correct password downloaded `evidence-pack-2026-07-05.zip`;
- the wrong password could not read the archive;
- the correct password opened README, manifest, CSV, PDF, and source index;
- the manifest reported five records and every listed file hash matched a
  fresh SHA-256 calculation;
- the password was absent from localStorage;
- cancelling deletion retained the workspace and confirming it removed the
  IndexedDB record.

The complete flow made 17 requests, all to the product origin, and logged no
console or page error. Visual evidence is in
`verification-evidence-7/live-real-workflow-desktop.png`.

## Privacy, headers, caching, and links

- Cold landing, demo, and the full real workflow load no analytics, external
  fonts/scripts, HMRC, bank, Azure, or AI endpoint.
- An explicit invalid-licence restore contacts only the product and
  `https://api.sociobot.in`, removes the invalid token, keeps cover notes
  disabled, and shows a recovery message.
- HTML responses send CSP, HSTS, `nosniff`, strict-origin referrer policy, and
  a restrictive camera/microphone/geolocation policy. `frame-ancestors 'none'`
  is correctly sent as a response header.
- HTML, manifest, service worker, and 404 responses use 30-second revalidation.
  Hashed assets use `public, max-age=31536000, immutable`.
- Every link discovered on `/`, `/demo`, `/workspace`, `/privacy`, and `/terms`
  returned 200, apart from the intentional `mailto:` link.
- The Sociobot verify endpoint returned the invalid verdict for requests 1–30.
  Requests 31–40 returned 429; request 31 included `Retry-After: 4`. The
  observed client allowance is **30 requests per rate-limit window**.

This product has no sign-in, first-party backend, library, or CLI. Entra,
backend concurrency/health, and clean-consumer package checks do not apply.

## PWA, offline, and update behavior

- The active worker is `/sw.js`, scoped to the site, with cache
  `mtd-evidence-pack-v1.0.6`.
- Its cache contains every shell route and every built JS/CSS/export/ZIP chunk.
- With networking disabled, `/demo` reloaded with Rowan Field Studio, all 12
  records, and the visible offline status. No request failed.
- The live claim suite also built and downloaded the encrypted sample pack
  while offline.
- The update-feedback test passes. Code inspection confirms versioned caches,
  old-cache deletion, `skipWaiting()`, `clients.claim()`, and a visible polite
  update notice. A real version-to-version transition cannot be induced from
  one immutable candidate.

Evidence: `verification-evidence-7/live-demo-offline-mobile-390.png`.

## Accessibility, responsive behavior, and visual review

- Independent Axe scans on `/`, `/demo`, `/workspace`, `/privacy`, `/terms`,
  and a real 404 found zero serious or critical violations.
- Every route has `lang="en-GB"`, one h1, one main, header/footer landmarks,
  route-specific title, and no unlabelled image.
- The five product routes have no horizontal overflow at 390 px with 100% or
  200% text. No visible interactive target measured below 44×44 CSS px.
- The first Tab reaches the skip link with a 3 px visible focus ring; Enter
  focuses main. Tab order reaches wordmark, Demo, Workspace, Privacy, primary
  action, and licence form in document order.
- Keyboard Enter on Demo moves focus to the new h1; Space toggles checklist
  items; no trap was found.
- Reduced motion matches, removes the hero animation, makes transitions
  effectively instant, and changes smooth scrolling to `auto`.
- Native validation, `role="alert"`, status/live regions, bound form labels,
  and labelled remove controls are present.
- Manual review found a coherent paper-ledger identity, readable hierarchy,
  visible focus, and no clipping or obscured control on desktop or mobile.

The checked-in design thesis records palette, typography, spacing, motion,
single-mode rationale, original generated-art prompt, generation method, and
provenance. The deterministic local workflow has no missed AI leverage that
would justify sending sensitive bookkeeping data to a model.

## Deployment identity

The fresh production build and live site match for all 26 publicly served
`dist/` artifacts. `dist/staticwebapp.config.json` is host configuration and is
correctly not a public file. Key SHA-256 values:

- `index.html` — `9046671d67b809072348b12c8210c3f60237d138f2a6c167cd567743649fda9a`
- `assets/index-T7O3gvkj.js` — `a05764dc679ccbc23ada6fbc4d6b3aba0a3dbbf515624172668270c571356624`
- `assets/app-D-q3ugE5.js` — `a3d9ec2524ba87949e62b9079aa3f709b9994cafeea3ba083b3fe1ee76f2b5ec`
- `sw.js` — `f45eedceec615d2d4a99cdaf03a0f411e6ea256f3e8414c6bcc0e33cec072eb2`

## Defects by severity

- **Critical:** none.
- **High:** none.
- **Medium:** none.
- **Low:** none.

## Informational limitations

- New one-time purchases are unavailable until a factory operator registers
  and enables the billing product. No unavailable purchase path is exposed.
- A real service-worker version transition needs two deployed versions; the
  candidate's update event, cache replacement logic, and offline behavior were
  tested as far as one immutable deployment permits.

No product code was modified during verification.
