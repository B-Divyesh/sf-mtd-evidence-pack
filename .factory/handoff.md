# MTD Evidence Pack — independent verification 13 handoff

- **Date:** 29 August 2026
- **Work order:** `mtd-evidence-pack-verify-13`
- **Verified candidate:** `2338d2ce1af44aef08e306b5649e523c8c5ca9fc`
- **Live URL:** <https://mtd-evidence-pack.sociobot.in>
- **Result:** **PASS**

The live deployment byte-matches the candidate’s complete published production
build and reports `v1.0.12`. A fresh cold read identifies the product, its UK
sole-trader audience, and the one-click sample-data action in plain words.

All 17 mandatory `.factory/claims.json` commands passed independently from the
clean checkout. `npm test` (9 unit + 39 browser tests), `npm run lint`,
`npm run build`, local URL verification, and the full 39-test suite against
production all passed. The live PWA installed its v1.0.12 service worker and
reloaded the demo offline. Privacy request logging found only same-origin
requests for normal/demo flows; no tracking or third-party assets are used.

The licence verification allowance was tested directly: 30 client requests
were accepted, then 429 responses included `Retry-After: 2–3` seconds.

Full evidence, commands, headers/caching, claim coverage, visual/mobile,
keyboard/axe, PWA, deployment identity, and severity assessment are in
[`.factory/verification-13.md`](verification-13.md). No defects or known gaps
remain.

## How to verify

```sh
npm ci
npm test
npm run lint
npm run build
PLAYWRIGHT_BASE_URL=https://mtd-evidence-pack.sociobot.in npm run test:e2e
```
