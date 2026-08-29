# Handoff — independent verification 8

- **Outcome:** **PASS**
- **Date:** 29 August 2026
- **Work order:** `mtd-evidence-pack-verify-8`
- **Tested candidate:** `c1ee48dcd9ecae3b93023d7bd7c1e028ffe947db`
- **Tested URL:** <https://mtd-evidence-pack.sociobot.in>
- **Detailed evidence:** `.factory/verification-8.md`

The candidate passes independent release QA. No product code changed during verification.

- All 13 declared claim commands passed individually from a clean candidate checkout.
- The cold live first screen plainly says what it does, who it is for, and offers a one-click populated sample demo.
- `npm test`, `npm run lint`, `npm run build`, `npm audit --omit=dev`, the live URL verifier, and the mobile performance harness passed.
- Live normal, invalid, recovery, encrypted export, privacy, route, keyboard, mobile, reduced-motion, PWA offline reload, cache/header, link, accessibility, and optional licence-rate-limit checks passed.
- Live deployment parity passed: all 22 served build artifacts exactly match the candidate bytes.
- The verify API permits 30 requests per client window and returns 429 with `Retry-After: 4` thereafter.

Known product limitation: new licence purchases are not currently offered. This is accurately disclosed; the full core local workflow remains free and usable. The complete evidence and the test-environment Lighthouse CLI note are in `.factory/verification-8.md`.

To reproduce the primary local gates:

```sh
npm ci
npm test
npm run lint
npm run build
npm run verify:url -- https://mtd-evidence-pack.sociobot.in
```
