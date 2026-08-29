+# Polish 4 — cumulative adversarial review repair

**Work order:** `mtd-evidence-pack-polish-4`  
**Base candidate and review:** `f659d21cb61e0b41fcc144765e967ed2422676fc`  
**Product repair:** `232ff179153a6b44cb93ba12553365d3eb0fbe9b`  
**Deployment:** `ce39b6d1-e075-4edc-baa6-fe394f7dd101`  
**Live URL:** <https://mtd-evidence-pack.sociobot.in>

Every finding from reviews 1–4 was treated as acceptance work. Earlier repairs remain present, and the ten round-four findings are fixed and verified on the deployed site.

Screenshot and report paths in the table are relative to `.factory/polish-evidence-4/`.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Kept the plain unavailable-licence copy and declared no-checkout claim. | `@claim:checkout-unavailable`; `live/landing-desktop.png`; live `/`. |
| F-1-2 | Kept the unsupported “versioned” promise out of README and public copy. | `public copy uses one artifact and licence vocabulary`; `live/landing-desktop.png`; live `/`. |
| F-1-3 | Kept 404 description, canonical, social metadata, Workspace/Privacy/Terms links, and shared footer. | `static-host routing keeps product paths and returns the designed 404 page for unknown paths`; `live/404-mobile.png`; live `/not-a-real-route` returned 404. |
| F-1-4 | Kept “Readiness preview” instead of the decorative label. | `landing uses the reviewed plain-language wording`; `live/back-restored-mobile.png`; live `/`. |
| F-1-5 | Kept “The product itself” removed. | `landing uses the reviewed plain-language wording`; `live/back-restored-mobile.png`; live `/`. |
| F-1-6 | Kept the explicit no-submission section and declared claim. | `@claim:no-tax-submission`; `live/landing-desktop.png`; live `/`. |
| F-1-7 | Kept the concrete selected-quarter source-file caption. | `landing uses the reviewed plain-language wording`; `live/back-restored-mobile.png`; live `/`. |
| F-1-8 | Kept the README introduction split below 22 words. | `public copy uses one artifact and licence vocabulary`; `local/landing-desktop-viewport.png`; live `/`. |
| F-2-1 | Kept mode-specific save wording: the demo resets and the real workspace saves locally. | `@claim:demo-sandbox`; `live/demo-query-mobile.png`; live `/?demo=1`. |
| F-2-2 | Kept “evidence pack” as the sole name for the exported artifact. | `public copy uses one artifact and licence vocabulary` and `@claim:encrypted-pack`; `live/file-change-copy-mobile.png`; live `/demo`. |
| F-2-3 | Kept “Free export and existing licences” as the licence section label. | `landing uses the reviewed plain-language wording`; `live/landing-desktop.png`; live `/`. |
| F-2-4 | Kept “app shell” out of the README. | `public copy uses one artifact and licence vocabulary`; `live/landing-mobile.png`; live `/`. |
| F-2-5 | Kept the direct generated-art disclosure in both public footers. | `@claim:artwork-provenance`; `live/404-mobile.png`; live `/` and `/not-a-real-route`. |
| F-3-1 | Kept the no-tax-submission claim and its request/control test. | `@claim:no-tax-submission`; `live/landing-desktop.png`; live `/`. |
| F-3-2 | Kept the complete unlicensed import/checklist/attachment/export workflow declared and tested. | `@claim:free-evidence-pack`; `live/demo-query-mobile.png`; live `/demo`. |
| F-3-3 | Kept the billing destination in the declared licence claim and exact-request test. | `@claim:paid-license`; `live/privacy-mobile.png`; live `/privacy`. |
| F-3-4 | Kept artwork provenance declared and tagged. | `@claim:artwork-provenance`; `live/404-mobile.png`; live `/` and unknown route. |
| F-3-5 | Kept the sample description concrete: 12 records, three files, one open item. | `@claim:sample-content`; `live/demo-query-mobile.png`; live `/?demo=1`. |
| F-3-6 | Kept “core pack” out of public copy. | `public copy uses one artifact and licence vocabulary`; `live/landing-mobile.png`; live `/`. |
| F-3-7 | Kept the README Privacy link pointed at the product site. | `README links directly to the live product Privacy page`; `live/privacy-mobile.png`; live `/privacy` returned 200. |
| F-4-1 | Demo mode is decided before licence startup. Both demo forms refuse licence capture, reads, writes, and verification; only Start for real loads real state. | `@claim:demo-sandbox sample changes are not saved and real storage stays untouched` preloads real IndexedDB/licence data, cold-opens both demo URLs with licence queries, asserts unchanged keys and zero billing requests, then proves real data loads only after exit. `live/demo-query-mobile.png`; live `/?demo=1` and `/demo`. |
| F-4-2 | Each history entry now stores its own scroll coordinates. Popstate restores them after rendering while focusing the h1 with `preventScroll`. | `@routing Back and Forward restore each route's scroll position and focus its heading` passed live with landing 813 px and demo 1024 px restored exactly. `live/back-restored-mobile.png`; live `/` ↔ `/demo`. |
| F-4-3 | Changed the first-screen fact and claim to “Works offline after your first visit.” | `@claim:offline-reload` and `landing uses the reviewed plain-language wording`; `live/landing-mobile.png`; live `/`. |
| F-4-4 | Replaced “hashes” with “file-change checks”; technical contexts explain “(SHA-256)”. Updated landing, workspace, README, exported README, and claim wording. | `landing uses the reviewed plain-language wording`, README copy regression, and `@claim:encrypted-pack`; `live/file-change-copy-mobile.png`; live `/` and `/demo`. |
| F-4-5 | Rewrote the README Privacy sentence to say users can learn how to delete local data and how licence checks work. | `README links directly to the live product Privacy page`; `live/privacy-mobile.png`; live `/privacy`. |
| F-4-6 | Rewrote Install guidance as “If your browser offers Install, use it to open the tool in its own window.” | README copy regression and `@claim:standalone-install`; `live/landing-mobile.png`; live `/manifest.webmanifest` returned 200 with standalone mode. |
| F-4-7 | Replaced “404 · Misfiled page” with “Page not found.” | Static 404 regression; `live/404-mobile.png`; live unknown route returned 404. |
| F-4-8 | Replaced the metaphorical h1 with “We could not find this page.” | `routes load without browser errors`; `live/404-mobile.png`; live unknown route returned 404. |
| F-4-9 | Reused the standard paper-moon wordmark and header structure. A local script reports the real Online/Offline status. | Static 404 regression plus route Axe/console checks; `live/404-mobile.png`; live unknown route showed “Online.” |
| F-4-10 | Added the local apple-touch icon and manifest links to the static 404. | Static 404 regression asserts SVG favicon and apple-touch icon; `live/404-mobile.png`; both icon URLs returned 200. |

## Verification evidence

- Clean clone `/tmp/mtd-polish4-clean.ZrakjB` at `232ff17`: `npm ci` passed with zero vulnerabilities. Every one of the 16 exact claim commands in `.factory/claims.json` passed independently.
- The same clean clone passed `npm test` (9 unit and 38 browser tests), `npm run build`, `npm run lint`, `npm audit --omit=dev`, the repository URL verifier, and the worker URL verifier.
- The deployment work-order command `npm ci && npm test && npm run build` passed before upload. The build produced `dist/index.html`; initial entry JavaScript was 2.01 kB gzip and CSS was 4.96 kB gzip.
- Production `PLAYWRIGHT_BASE_URL=https://mtd-evidence-pack.sociobot.in npm run test:e2e` passed all 38 browser checks. This includes Playwright Axe on every route, keyboard navigation, mobile 390 px, 200% text, reduced motion, demo privacy, same-origin storage, offline reload/export, routing metadata, 404 behavior, and history focus/scroll.
- Production URL verifiers passed with no console errors: title present, `lang="en-GB"`, one h1, one main, all images with alternatives, and all buttons named.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 0.9 s, CLS 0, TBT 60 ms. Report: `live/lighthouse.json`.
- Live route check: `/`, `/demo`, `/workspace`, `/privacy`, `/terms`, robots, sitemap, manifest, favicon, and apple-touch icon returned 200. The designed unknown route returned 404 with CSP, Referrer-Policy, and X-Content-Type-Options.
- Visual evidence lives in `.factory/polish-evidence-4/`. The cold landing, one-click demo, Privacy page, restored Back position, file-change copy, and 404 were inspected after deployment at 390 px; the landing was also inspected at 1440 px.

No review finding remains unresolved.
