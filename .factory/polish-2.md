# Polish 2 — adversarial review repair

**Work order:** `mtd-evidence-pack-polish-2`  
**Base review:** `7e537d710193e2630ee88a12d36067f8a4938ed7`  
**Product repair:** `c82cdc26e9dd3137c2e72c3505c2335ae8d668c2`, metadata/evidence follow-up `15283d5`
**Live URL:** <https://mtd-evidence-pack.sociobot.in>

Every finding in `.factory/review-1.md` and `.factory/review-2.md` was retested. Round 1 remains fixed, and all round 2 findings are fixed.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Kept the plain “New licences are not currently available” wording and its declared claim. | `@claim:checkout-unavailable` passed independently in the clean clone and in the live suite. [Live landing](https://mtd-evidence-pack.sociobot.in/); screenshot: `polish-evidence-2/live-landing-desktop.png`. |
| F-1-2 | Kept “versioned evidence checklist” out of every public file. | `public copy uses one artifact and licence vocabulary` checks the removed promise. [Live landing](https://mtd-evidence-pack.sociobot.in/) is clear; screenshot: `polish-evidence-2/live-landing-desktop.png`. |
| F-1-3 | Retained the designed 404 with its own metadata plus Workspace, Privacy, Terms, and shared footer links. | `static-host routing keeps product paths and returns the designed 404 page for unknown paths` and `routes load without browser errors` passed live. `/not-a-real-route` returned 404; screenshot: `polish-evidence-2/live-404-mobile.png`. |
| F-1-4 | Kept “Readiness preview” in place of the decorative field-note label. | `landing uses the reviewed plain-language wording` passed on the [live landing](https://mtd-evidence-pack.sociobot.in/); screenshot: `polish-evidence-2/live-landing-desktop.png`. |
| F-1-5 | Kept the uninformative “The product itself” heading removed. | `landing uses the reviewed plain-language wording` passed on the [live landing](https://mtd-evidence-pack.sociobot.in/); screenshot: `polish-evidence-2/live-landing-desktop.png`. |
| F-1-6 | Kept “What this tool does not do” and the explicit no-submission boundary. | `landing uses the reviewed plain-language wording` passed on the [live landing](https://mtd-evidence-pack.sociobot.in/); full local screenshot: `polish-evidence-2/local-landing-desktop.png`. |
| F-1-7 | Kept the concrete source-file caption. | `landing uses the reviewed plain-language wording` passed on the [live landing](https://mtd-evidence-pack.sociobot.in/); screenshot: `polish-evidence-2/live-landing-desktop.png`. |
| F-1-8 | Kept the README introduction split into short sentences. | `.factory/copy-audit.md` has no line above 22 words; `public copy uses one artifact and licence vocabulary` passed. [Live landing](https://mtd-evidence-pack.sociobot.in/) screenshot: `polish-evidence-2/live-landing-desktop.png`. |
| F-2-1 | The demo now says “The sample resets when you reload or leave the demo.” The real workspace alone says “Your work saves on this device.” | `@claim:demo-sandbox` asserts the correct sentence is present and the conflicting sentence absent, then checks the inverse after **Start for real**. Passed independently in the clean clone and live. Screenshot: `polish-evidence-2/live-demo-query-mobile.png`; [live demo](https://mtd-evidence-pack.sociobot.in/?demo=1). |
| F-2-2 | Standardised the exported artifact as “evidence pack” across landing, workspace, legal pages, metadata, README, manifest, PDF content, and ZIP path. The PDF is now `summary/evidence-pack-summary.pdf`. | `public copy uses one artifact and licence vocabulary` and `@claim:encrypted-pack` passed locally and live. The latter opened the renamed PDF and verified hashes. [Live workspace](https://mtd-evidence-pack.sociobot.in/workspace); screenshot: `polish-evidence-2/live-demo-query-mobile.png`. |
| F-2-3 | Replaced “Supported edition” with “Free core and existing licences”; workspace and legal copy now say “existing licence”. | `public copy uses one artifact and licence vocabulary`, `@claim:paid-license`, and `@claim:checkout-unavailable` passed against the [live site](https://mtd-evidence-pack.sociobot.in/). Full local screenshot: `polish-evidence-2/local-landing-desktop.png`. |
| F-2-4 | Replaced README’s “app shell” with “app”. | `public copy uses one artifact and licence vocabulary` checks that the jargon is absent. [Live landing](https://mtd-evidence-pack.sociobot.in/) remains clear; screenshot: `polish-evidence-2/live-landing-desktop.png`. |
| F-2-5 | Removed the unavailable disclosure phrase. The footer now shows only `v1.0.8`; provenance remains in `.factory/design.md`. | `landing uses the reviewed plain-language wording` asserts the old phrase is absent and the exact build id is present. [Live 404](https://mtd-evidence-pack.sociobot.in/not-a-real-route) returned 404; screenshot: `polish-evidence-2/live-404-mobile.png`. |

## Acceptance evidence

- Clean clone `/tmp/mtd-polish2-clean.WF7cgR` at `c82cdc2`: `npm ci`, `npm run build`, `npm run lint`, `npm test`, all 13 exact commands from `.factory/claims.json`, and `npm audit --omit=dev` passed. The full suite reported 9 unit and 27 browser tests.
- Every claim id occurs in exactly one tagged browser test, enforced by `claim contract declares each claim tag exactly once`.
- Live `PLAYWRIGHT_BASE_URL=https://mtd-evidence-pack.sociobot.in npm run test:e2e` passed 27 tests. `npm run verify:url -- https://mtd-evidence-pack.sociobot.in` passed.
- Live cold route checks returned 200 for `/`, `/demo`, `/workspace`, `/privacy`, and `/terms`; the designed unknown route returned 404. Every route had one h1, one main, its title, description, canonical and social metadata. All crawled links returned 200.
- Playwright Axe found no serious or critical issue on every route and the 404. Keyboard, focus transfer, 390 px layout, touch targets, and 200% text reflow checks passed.
- The privacy test recorded only `https://mtd-evidence-pack.sociobot.in` during the demo-to-real flow. The offline test cold-reloaded the cached demo and exported its encrypted pack.
- Final live performance test: 616 ms LCP, 32 ms longest interaction, 2,120 B initial JavaScript, and 5,380 B CSS. Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.0 s, CLS 0, TBT 80 ms. Report: `polish-evidence-2/lighthouse-live.json`.
- Final deployment `9c313691-1d89-4c1b-9c44-2046f38043ee` completed through `/opt/fleet/lib/deploy-static.sh` and the custom HTTPS URL returned 200.

No finding or known product gap remains.
