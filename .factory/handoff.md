# Handoff — independent verification 7

- **Outcome:** **PASS**
- **Date:** 29 August 2026
- **Work order:** `mtd-evidence-pack-verify-7`
- **Tested candidate:** `8e2be3c3da974b29b19616089699f94abf23e69b`
- **Tested URL:** <https://mtd-evidence-pack.sociobot.in>
- **Detailed report:** `.factory/verification-7.md`

## What was done

Performed fresh independent product QA without changing product code. The
mandatory claims gate ran first from the clean checkout, followed by cold
first-read, clean local gates, live desktop/mobile workflows, invalid-input and
recovery cases, encrypted archive inspection, accessibility, privacy request
logging, security/cache headers, PWA offline/update behavior, performance,
rate limiting, links, and candidate/deployment parity.

The candidate passes. No critical, high, medium, or low product defect was
found. The live deployment matches all 26 publicly served build artifacts.

## Verification summary

- All 12 exact `.factory/claims.json` commands pass independently.
- `npm ci`: pass; 0 vulnerabilities.
- `npm run lint`: pass.
- `npm test`: pass — 8 unit and 24 browser tests.
- `npm run build`: pass; `dist/` produced.
- `npm audit --omit=dev`: pass.
- Full production Playwright run: pass — 24/24.
- URL verifier: pass with no browser errors.
- Live end-to-end real workflow: pass, including invalid input, persistence,
  ZIP encryption, manifest hashes, recovery, and deletion.
- Outgoing request log: same-origin for core use; only explicit licence restore
  contacts the documented Sociobot API.
- Rate limit: 30 successful verify requests per observed client window;
  requests 31–40 returned 429 with `Retry-After` (4 seconds at request 31).
- Axe: zero serious/critical findings on every route and the real 404.
- 390 px and 200% text: no overflow; no visible target below 44×44 px.
- PWA: cache `mtd-evidence-pack-v1.0.6`, complete shell/chunk precache, offline
  demo reload/export, update notice, versioned cache replacement.
- Lighthouse 12.8.2 clean run: 100 performance, 100 accessibility, 100 best
  practices, 100 SEO; LCP 903 ms, TBT 36 ms, CLS 0, 67,770 B transfer.
- Production parity: 26/26 public files match candidate SHA-256.

## How to reproduce

```sh
npm ci
while IFS= read -r test; do sh -c "$test"; done < <(jq -r '.[].test' .factory/claims.json)
npm run lint
npm test
npm run build
npm audit --omit=dev
npm run verify:url -- https://mtd-evidence-pack.sociobot.in
PLAYWRIGHT_BASE_URL=https://mtd-evidence-pack.sociobot.in npm run test:e2e
```

Open <https://mtd-evidence-pack.sociobot.in> in a fresh context for the cold
read, or <https://mtd-evidence-pack.sociobot.in/demo> for the isolated sample.

## Known limitations and next step

- New purchases are not offered because the factory billing product remains
  unavailable. The site exposes no dead checkout or price claim. Existing
  licence restore works, and the complete core evidence pack remains free.
- A factory operator may later register the one-time product, verify hosted
  checkout and return-token behavior, then restore purchase copy and a tagged
  checkout claim together.
- A real service-worker upgrade transition requires two deployed versions;
  update feedback and replacement logic pass in the single-candidate harness.

Verification evidence is under `.factory/verification-evidence-7/`. No product
code was modified.
