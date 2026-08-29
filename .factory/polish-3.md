# Polish 3 — cumulative adversarial review repair

**Work order:** `mtd-evidence-pack-polish-3`  
**Base candidate:** `98b8d642c99b5b0f4192e47f5ffbc4d267973459`  
**Review repaired:** `e4b9482a8a2198c3d5b3dedcbfbb8588322b4e0c`  
**Product repair:** `19824e2932b7a2e8fedd406c3b3b9f88aeb0eda1`  
**Deployment:** `3281c41f-0fc8-4b5e-ba2e-baa8914d699f`  
**Live URL:** <https://mtd-evidence-pack.sociobot.in>

Every finding from `review-1.md`, `review-2.md`, and `review-3.md` is covered below. Earlier repairs remain in the product and were retested; no finding was waived as minor.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Kept the plain unavailable-licence wording and its no-checkout contract. | `@claim:checkout-unavailable` passed in the clean clone and live 35-test suite; [live landing](https://mtd-evidence-pack.sociobot.in/); `polish-evidence-3/live-landing-mobile.png`. |
| F-1-2 | Kept the unimplemented “versioned” checklist promise out of public copy. | `public copy uses one artifact and licence vocabulary` passed; [live landing](https://mtd-evidence-pack.sociobot.in/). |
| F-1-3 | Kept the designed 404 metadata and shared Workspace, Privacy, and Terms navigation. | `static-host routing keeps product paths and returns the designed 404 page for unknown paths` and the live route audit passed; [live 404](https://mtd-evidence-pack.sociobot.in/not-a-real-route) returned HTTP 404; `polish-evidence-3/live-404-mobile.png`. |
| F-1-4 | Kept “Readiness preview” in place of the decorative field-note label. | `landing uses the reviewed plain-language wording` passed locally and live; landing screenshot. |
| F-1-5 | Kept the non-informative “The product itself” heading removed. | `landing uses the reviewed plain-language wording` passed locally and live; landing screenshot. |
| F-1-6 | Kept the explicit no-submission boundary headed “What this tool does not do.” | `@claim:no-tax-submission` now exercises demo export and real workspace without a tax-submission control or HMRC request; [live landing](https://mtd-evidence-pack.sociobot.in/). |
| F-1-7 | Kept the concrete source-file caption for the selected quarter. | `landing uses the reviewed plain-language wording` passed; landing screenshot. |
| F-1-8 | Kept the README introduction split into short sentences. | `.factory/copy-audit.md` has no landing item over 22 words; `public copy uses one artifact and licence vocabulary` passed. |
| F-2-1 | Kept mode-specific storage wording: demo resets, real work saves locally. | `@claim:demo-sandbox` passed independently and live; [live query demo](https://mtd-evidence-pack.sociobot.in/?demo=1); `polish-evidence-3/live-demo-mobile.png`. |
| F-2-2 | Kept “evidence pack” as the exported artifact throughout public copy and export paths. | `public copy uses one artifact and licence vocabulary` and `@claim:encrypted-pack` passed; the latter verifies `summary/evidence-pack-summary.pdf`. |
| F-2-3 | Kept the licence section as “Free export and existing licences,” replacing the ambiguous old label. | `landing uses the reviewed plain-language wording` passed; [live landing](https://mtd-evidence-pack.sociobot.in/). |
| F-2-4 | Kept “app shell” out of user-facing README copy. | `public copy uses one artifact and licence vocabulary` passed. |
| F-2-5 | Replaced the old unavailable “Generated art disclosed” phrase with a direct, declared provenance statement. | `@claim:artwork-provenance` passed on landing and 404; [live 404](https://mtd-evidence-pack.sociobot.in/not-a-real-route); 404 screenshot. |
| F-3-1 | Added the `no-tax-submission` declared claim and a demo-to-real request/control test. | `@claim:no-tax-submission` passed in clean clone and live; [live landing](https://mtd-evidence-pack.sociobot.in/). |
| F-3-2 | Replaced the narrow free-export promise with a declared, tested free workflow: import, checklist, attachments, and encrypted export without a licence. | `@claim:free-evidence-pack` passed in clean clone and live. |
| F-3-3 | Extended `paid-license` to declare the Sociobot billing API destination and assert the exact verified-token request. | `@claim:paid-license` passed in clean clone and live; [live Privacy page](https://mtd-evidence-pack.sociobot.in/privacy). |
| F-3-4 | Added `artwork-provenance` to claims and tagged the existing public-footer check. | `@claim:artwork-provenance` passed; [live landing](https://mtd-evidence-pack.sociobot.in/); landing and 404 screenshots. |
| F-3-5 | Replaced subjective “realistic” wording with the actual sample contents on the first screen and README. | `@claim:sample-content` asserts 12 records, three files, and one open item; [live demo](https://mtd-evidence-pack.sociobot.in/demo); demo screenshot. |
| F-3-6 | Removed “core pack” terminology: “Evidence pack export is free” and “Free evidence pack export” now name the same artifact everywhere. | `public copy uses one artifact and licence vocabulary` rejects the old terms; landing screenshot. |
| F-3-7 | Changed the README Privacy link to the absolute product URL and added a regression test. | `README links directly to the live product Privacy page` passed; [live Privacy page](https://mtd-evidence-pack.sociobot.in/privacy). |
| Verification-10 H1 | Retained the visible `.file-button:focus-within` ring and scroll-into-view behavior for both file controls. | `@keyboard @mobile file imports show a focus ring and scroll the visible control into view` passed in the live suite. |
| Verification-10 M1 | Retained the sticky mobile demo banner at every viewport width. | `@mobile demo banner remains visible while working lower in the sample` passed live; `polish-evidence-3/live-demo-mobile-scrolled.png`. |
| Verification-10 L1 | Retained the public generated-art disclosure and made it a declared claim. | `@claim:artwork-provenance` passed live; landing and 404 screenshots. |

## Acceptance evidence

- Fresh clone: `/tmp/mtd-evidence-pack-polish3.GvEPQT` at `19824e2`; `npm ci` reported zero vulnerabilities. All 16 exact commands in `.factory/claims.json` passed individually, followed by `npm test` (9 unit tests and 35 browser tests), `npm run lint`, `npm run build`, and `npm audit --omit=dev`.
- Final local suite after the README-link regression test: `npm test` passed 9 unit tests and 36 browser tests; `npm run build`, `npm run lint`, and `npm audit --omit=dev` passed. Built initial entry JavaScript is 1.86 kB gzip; CSS is 4.96 kB gzip.
- Live suite: `PLAYWRIGHT_BASE_URL=https://mtd-evidence-pack.sociobot.in npm run test:e2e` passed 35 browser tests against the deployed product. `npm run verify:url -- https://mtd-evidence-pack.sociobot.in` passed.
- Cold live route audit at 390 × 844: `/`, `/?demo=1`, `/demo`, `/workspace`, `/privacy`, and `/terms` returned 200; each had one h1/main, route-specific title/description/canonical, and zero horizontal overflow. `/not-a-real-route` returned the designed HTTP 404 with its metadata and shared footer.
- Accessibility: the live suite’s Axe checks found no serious or critical violations on landing, demo, workspace, Privacy, Terms, and 404. Keyboard skip link, route-focus transfer, visible file-control focus, Space checklist operation, 390 px reflow, 200% text, and reduced motion all passed.
- Privacy/offline: live `local-only`, `no-tax-submission`, and `offline-reload` claims passed. They verify same-origin product traffic, no HMRC request/control, cached offline demo reload, and encrypted sample export.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.0 s, TBT 80 ms, CLS 0. Report: `polish-evidence-3/lighthouse-live.json`.

No outstanding finding remains.
