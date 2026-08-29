# Handoff — perfection loop round 2

- **Outcome:** PASS — all findings from review rounds 1 and 2 are fixed.
- **Date:** 29 August 2026
- **Work order:** `mtd-evidence-pack-polish-2`
- **Repair commits:** `c82cdc26e9dd3137c2e72c3505c2335ae8d668c2`, `15283d5`
- **Deployment:** `9c313691-1d89-4c1b-9c44-2046f38043ee`
- **Live URL:** <https://mtd-evidence-pack.sociobot.in>
- **Finding map:** `.factory/polish-2.md`

## What changed

- Added honest mode-specific first-screen copy: demo changes reset; real workspace changes save locally.
- Standardised the artifact name to “evidence pack” across UI, legal pages, metadata, README, manifest, PDF content, and ZIP paths.
- Replaced vague licence wording with “Free core and existing licences”.
- Removed README implementation jargon and the unusable generated-art disclosure from the public footer.
- Bumped the PWA and cache version to 1.0.8.
- Extended tests for demo isolation copy, vocabulary, root/social metadata, every claim tag, and the renamed encrypted-pack contents.
- Updated `.factory/claims.json`, `.factory/demo.md`, `.factory/copy-audit.md`, and the 69-character verb-first catalog description.

The paper-moon ledger identity, original illustration, local-first PWA class, and static deployment model are unchanged.

## Verification

From clean clone `/tmp/mtd-polish2-clean.WF7cgR` at `c82cdc2`:

```sh
npm ci                         # pass; 0 vulnerabilities
npm run build                  # pass; dist/index.html produced
npm run lint                   # pass
npm test                       # pass; 9 unit + 27 browser tests
npm audit --omit=dev           # pass; 0 vulnerabilities
```

Every one of the 13 exact claim commands in `.factory/claims.json` was run independently and passed: `demo-sandbox`, `csv-import`, `period-integrity`, `source-file-size`, `encrypted-pack`, `free-core-export`, `local-only`, `offline-reload`, `custom-checklist`, `readiness`, `standalone-install`, `paid-license`, and `checkout-unavailable`.

Production checks:

```sh
PLAYWRIGHT_BASE_URL=https://mtd-evidence-pack.sociobot.in npm run test:e2e
# 27 passed

npm run verify:url -- https://mtd-evidence-pack.sociobot.in
# passed: status, title, lang, one h1, main, alt text, button labels, console
```

- Live cold checks found no console errors and only same-origin demo requests.
- `/`, `/demo`, `/workspace`, `/privacy`, and `/terms` returned 200 with route-specific metadata; `/not-a-real-route` returned the designed 404.
- Every crawled product and footer link returned 200; the mail link is explicit.
- Playwright Axe found zero serious or critical violations across all routes and the 404.
- Keyboard Space, skip link, route focus, 44 px targets, 390 px layout, and 200% text reflow passed.
- Offline reload and encrypted ZIP export passed from the cached demo.
- Final live performance test: LCP 616 ms, longest interaction 32 ms, initial JS 2,120 B, CSS 5,380 B.
- Live Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.0 s, CLS 0, TBT 80 ms.

Evidence is in `.factory/polish-evidence-2/`, including live landing, demo, 404 screenshots and Lighthouse JSON.

## Known gaps and next steps

None. No review finding or acceptance gap remains.
