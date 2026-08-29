# Handoff — repair 5 implementation

- Date: 29 August 2026
- Work order: `mtd-evidence-pack-repair-5`
- Base verified failure: `cabc2ea4ad7d7bf806adec6e7c38cc8fb22bcfb0`
- Source verification: `.factory/verification-5.md`
- Artifact: local-first static PWA (`dist/`)

## Status

Production was deployed from repair commit `a28cc3a` at 29 August 2026. The
repository repair is buildable, its local and live product gates pass, and all
26 publicly served build files match local `dist/` by SHA-256.

One external release dependency remains: at 11:11 UTC on 29 August the
factory-owned `https://api.sociobot.in/api/v1/products/mtd-evidence-pack/checkout`
endpoint still returned `404 {"error":"enabled factory product","status":404}`.
The product now has the required £24 one-time-purchase UI, exact hosted-checkout
URL, return-token storage, daily verification, restore field, terms, and a
recorded checkout/return regression test. Enabling that Sociobot product is a
billing operation outside this static-product repository; it must be enabled
before the purchase path can pass a live release check.

## Repairs

1. **Stable mobile performance.** The landing page is now real, semantic HTML
   with a 1.86 kB gzip bootstrap. The 10.35 kB gzip workspace code loads only
   after navigation. Three fresh 4×-CPU focused runs measured 111 ms, 91 ms,
   and 131 ms total blocking time (limit: 200 ms).
2. **Complete first-visit offline export.** Vite emits `asset-manifest.json`.
   The versioned service worker caches every manifest chunk, including the
   deferred export and ZIP chunks. The offline claim now reloads `/demo` with
   networking disabled and downloads `evidence-pack-2026-07-05.zip`.
3. **Non-destructive CSV imports.** A valid file appends records instead of
   replacing the current table. The message reports added and total records;
   the regression imports two files and proves the original sample row remains.
4. **Purchase flow restored in the client.** The £24 one-time supported edition
   adds saved cover notes without gating core data, checklist, export, or
   accessibility. It links only to the prescribed Sociobot checkout endpoint,
   stores returned `?license=` tokens locally, verifies them, and supports token
   restoration on both the landing page and workspace.
5. **Accessibility and route recovery.** The focus outline is now danger ink
   (`#8D332E`): 6.69:1 on paper and 6.26:1 on the acid primary action. The
   wordmark has a 44 px target; wrapping/min-width fixes eliminate 200% text
   overflow at 390 px. Azure Static Web Apps receives explicit known-route
   rewrites and a designed `404.html` response override for unknown paths.
6. **Claims.** Added tagged observable coverage for readiness, standalone PWA
   installation metadata, the checkout/return flow, retained CSV imports, and
   complete offline export. All public claims now have an entry in
   `.factory/claims.json`.

## Local verification

- `npm ci` — passed: 62 packages added; 0 vulnerabilities.
- Each of the 12 exact commands in `.factory/claims.json` — passed separately.
- `npm run lint` — passed (`tsc --noEmit`).
- `npm test` — passed: 7 Vitest tests and 23 Playwright checks.
- `npm run build` — passed and produced `dist/index.html`.
- `npm audit --omit=dev` — passed: 0 vulnerabilities.
- `npm run verify:url -- http://127.0.0.1:4174` — passed: title, `en-GB`, one
  h1, main landmark, alt text, labelled buttons, and no browser errors.
- Playwright Axe scans on `/`, `/demo`, `/workspace`, `/privacy`, `/terms`, and
  the application not-found route — zero serious or critical violations.
- Keyboard checks pass for skip navigation, client-route focus transfer, and
  Space-operated checklist items. The dedicated 390 px + 200% text check has
  no horizontal overflow and verifies the 44 px home target.
- Offline/update checks pass: `/demo` reloads offline, exports encrypted ZIP
  offline, and the versioned update announcement appears.
- Lighthouse 12.8.2 mobile production-preview runs: performance 100/100/100,
  accessibility 100/100/100, best practices 100/100/100, SEO 100/100/100;
  LCP 1.047/0.905/1.506 s, CLS 0/0/0, TBT 5.6/0/0 ms.

The standalone Axe CLI could not launch in this worker because its Selenium
launcher could not locate Chrome. The repository's Playwright
`@axe-core/playwright` scans are the recorded accessibility gate and passed on
every product route.

## Deployment and live evidence

- Deployment: `/opt/fleet/lib/deploy-static.sh mtd-evidence-pack dist`;
  Azure Static Web Apps deployment ID `67bf66dd-9c71-41c7-9084-8beea48c9805`.
- `npm run verify:url -- https://mtd-evidence-pack.sociobot.in` — passed with
  title, `en-GB`, one h1, main landmark, alt text, labelled buttons, and no
  browser errors.
- Live full Playwright suite — passed: 23/23. Its throttled landing run measured
  67 ms TBT. This includes desktop and 390 px mobile, keyboard, route focus,
  200% text reflow, Playwright Axe, privacy request assertions, service-worker
  update feedback, offline encrypted export, and the live not-found route.
- Live response policy includes HSTS, `nosniff`, strict-origin referrer policy,
  restrictive permissions policy, CSP with only the Sociobot licence API as an
  external `connect-src`, and `frame-ancestors 'none'` as a response header.
- `https://mtd-evidence-pack.sociobot.in/missing-page` returns HTTP 404 and the
  designed page text. SHA-256 parity passed for all 26 publicly served files.
- The live checkout endpoint was retested after deployment and still returns
  `404 {"error":"enabled factory product","status":404}`. The factory must
  enable the `mtd-evidence-pack` product record before this release can be
  accepted as purchasable.
