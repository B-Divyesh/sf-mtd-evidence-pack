# Handoff — MTD Evidence Pack repair 4

Date: 29 August 2026  
Base candidate: `3b2ccf6843c7fb168c00126114d2b06272f454b3`  
Repair commit: `856e851ba768bf142087fcc156cbfc66bd8370c5`  
Artifact: local-first static PWA (`dist/`)

## Release status

**Ready for deployment verification.** Both release blockers in independent verification 4 are repaired locally. The production deployment check is recorded after the configured static deployment completes.

## Repairs

1. **User-maintained checklist is now free core functionality.** A fresh real workspace reached through `/demo` → **Start for real** has an enabled **Add your own check** field. Added checks save to the real IndexedDB workspace and persist after reload. Saved cover notes remain the optional verified-licence feature. This restores the brief requirement without requiring a new-user purchase path.
2. **Mobile blocking work was reduced.** The 390px first screen now selects a 390×260 WebP derivative (4,874 bytes) rather than decoding the 720px hero. The service-worker cache/version and PWA start URL are `1.0.4`; the performance regression additionally asserts the 390px source is used.
3. **All hashed asset output has immutable host caching.** `staticwebapp.config.json` now applies `public, max-age=31536000, immutable` to `/assets/*`, covering the deferred `export-*.js` chunk as well as entry and ZIP chunks.

## Regression coverage

- `@claim:custom-checklist` starts a fresh unlicensed real workspace, adds a named custom check, reloads, and verifies that the check remains while the paid cover-note field remains locked.
- `@claim:paid-license` verifies a recorded valid licence enables a saved cover note.
- The mobile `@performance` test asserts the 390px hero asset and keeps the existing <= 200 ms total-blocking-time requirement.
- The cache policy test asserts the `/assets/*` immutable route configuration.

## Verification

- Clean install: `npm ci` — passed (63 packages audited; 0 vulnerabilities).
- Type/lint: `npm run lint` — passed.
- Production build: `npm run build` — passed; `dist/index.html` is present. Build output: entry JS 30.75 kB raw / 11.15 kB gzip; CSS 18.29 kB raw / 4.80 kB gzip; deferred ZIP 54.45 kB gzip.
- Full quality gate: `npm test` — passed: 7 Vitest tests and 18 Playwright tests, including desktop, 390px mobile, keyboard, route/error, privacy/request, PWA update/offline, and axe serious/critical checks. The 4×-CPU performance measurement was 37 ms total blocking time (<= 200 ms limit).
- URL smoke: `npm run verify:url -- http://127.0.0.1:4174` — passed: HTTP 200, title, `lang=en-GB`, exactly one h1, main landmark, image alt attributes, labelled buttons, and no console errors.
- Every exact declared claim command was run from the production-preview test setup and passed: `demo-sandbox`, `csv-import`, `source-file-size`, `encrypted-pack`, `free-core-export`, `local-only`, `offline-reload`, `custom-checklist`, and `paid-license`.
- The Playwright axe integration is the accessibility runner; all public routes had zero serious or critical violations. The suite also verified skip-link focus, Space checklist operation, client-route heading focus, reduced-motion mobile hero treatment, and zero 390px horizontal overflow.

## Privacy and PWA

The request-log claim permits only the product origin during demo-to-real CSV import. Licence verification remains opt-in through the existing Sociobot endpoint. The full suite verifies the demo namespace, no retained ZIP password, service-worker update notice, and an offline `/demo` reload after the first visit.

## Known gaps / next step

No known local product gaps. Push this repair to `main`, then verify deployment parity, the `/assets/export-*.js` immutable header, live 390px performance, and the unlicensed real-workspace checklist flow.
