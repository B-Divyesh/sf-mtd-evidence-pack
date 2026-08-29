+# MTD Evidence Pack — polish round 4 handoff

- **Date:** 29 August 2026
- **Work order:** `mtd-evidence-pack-polish-4`
- **Base:** `f659d21cb61e0b41fcc144765e967ed2422676fc`
- **Repair commit:** `232ff179153a6b44cb93ba12553365d3eb0fbe9b`
- **Deployment:** `ce39b6d1-e075-4edc-baa6-fe394f7dd101`
- **Live URL:** <https://mtd-evidence-pack.sociobot.in>
- **Result:** PASS — every finding in reviews 1–4 is fixed and retested.

## What changed

Demo mode is now selected before any licence code runs. Both `/?demo=1` and `/demo` ignore licence query values and do not touch the real licence or IndexedDB namespaces. **Start for real** is the first point that loads real workspace and licence state.

History entries now retain their own scroll coordinates. Back and Forward restore exact positions after rendering, keep the new h1 focused without moving the page, and announce the route.

The first-screen offline fact now names offline use. User copy explains file-change checks, Privacy controls, and browser installation in plain words. The static and in-app 404s use direct error language. The static 404 also shares the paper-moon wordmark, live network status, local favicon, apple-touch icon, manifest, legal links, metadata, and footer.

Release references are `v1.0.11`. The catalog description is verb-first and 106 characters excluding its newline. The paper-moon ledger visual system, original artwork, static PWA class, and local-first product scope are unchanged.

## How it was verified

From clean clone `/tmp/mtd-polish4-clean.ZrakjB` at `232ff17`:

- `npm ci` — PASS, zero vulnerabilities.
- All 16 exact commands in `.factory/claims.json`, run separately — PASS.
- `npm test` — PASS, 9 unit tests and 38 browser tests.
- `npm run build` — PASS; `dist/index.html` produced.
- `npm run lint` — PASS.
- `npm audit --omit=dev` — PASS.
- Repository and worker URL verifiers — PASS.

Before deployment, the configured `npm ci && npm test && npm run build` command passed again. The production suite then passed all 38 browser tests against the live URL. Playwright Axe reported no serious or critical issues on landing, demo, workspace, Privacy, Terms, and 404. Mobile, keyboard, focus, 200% text, reduced-motion, privacy, offline, PWA cache, and encrypted export checks passed.

Performance evidence:

- Browser budget test: 588 ms live mobile LCP, 32 ms longest interaction, 2,269 B initial JavaScript transfer, 5,421 B CSS transfer.
- Build: 2.01 kB gzip initial JavaScript; 4.96 kB gzip CSS.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 0.9 s, CLS 0, TBT 60 ms.
- Reports and reviewed screenshots: `.factory/polish-evidence-4/`.

Routing evidence:

- `/`, `/demo`, `/workspace`, `/privacy`, and `/terms` returned 200.
- The unknown-route check returned the designed page with HTTP 404.
- Robots, sitemap, manifest, favicon, and apple-touch icon returned 200.
- Back restored landing `scrollY=813`; Forward restored demo `scrollY=1024`; each route h1 held focus.
- The URL verifier found no console errors, missing title/language/main/image alternative, or unnamed button.

## Known gaps and next steps

None. No finding or deferred task remains.

## Independent verifier update — 29 August 2026

**Candidate:** `0bf1aa717291853801883ef65ac9b7a01527c295`
**Live URL:** <https://mtd-evidence-pack.sociobot.in>
**Result:** **PASS**

Fresh independent QA confirms the live deployment is byte-identical to this candidate’s production build. All 16 declared claims passed individually from a clean install and `/demo`; `npm test` (9 unit + 38 browser tests), `npm run lint`, `npm run build`, the full 38-test live-browser suite, and the URL verifier pass. PWA update/offline reload, privacy requests and headers, 390 px mobile, keyboard/focus, reduced motion, serious/critical axe, and verifier API rate limiting were checked.

Observed licence-verification allowance: 30 requests per client window; requests 31–35 returned 429 with `Retry-After: 4`. The sole open item is a non-blocking P2 moderate axe landmark-nesting advisory on `/workspace` (`landmark-complementary-is-top-level`).

Exact evidence: `.factory/verification-12.md`.
