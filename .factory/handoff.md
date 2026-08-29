# MTD Evidence Pack — polish round 5 handoff

- **Date:** 29 August 2026
- **Work order:** `mtd-evidence-pack-polish-5`
- **Repair commit:** `2156f318100811c44ebf779c2576225e4d4f55b0`
- **Deployment:** `f766bd9f-d570-45c3-b8c1-bd04dbd2510d`
- **Live URL:** <https://mtd-evidence-pack.sociobot.in>
- **Result:** PASS — no known gaps or unresolved review findings.

## What changed

- Replaced the nested real-workspace complementary landmark with a normal
  supporting-content container. Axe gates now reject every violation, not just
  serious and critical ones.
- Corrected the documented Node range to **20.19+ or 22.12+**, added the same
  `engines.node` range to package metadata, and added a declared runtime claim.
  Its verifier makes a disposable clone, runs `npm ci`, and builds with Node
  20.19.0.
- Renamed the final README heading to **Source code licence** so it cannot be
  confused with the product’s existing-licence entitlement.
- Bumped the offline cache/build version to `v1.0.12`, preserving the PWA’s
  update path. Updated the verb-first catalog description and copy audit.

## Verification

From clean clone `/tmp/mtd-polish5-clean.UfNAog/repo`:

- `npm ci` — PASS; `npm audit --omit=dev` — PASS, zero vulnerabilities.
- Every exact claim command in `.factory/claims.json` ran independently and
  passed: `demo-sandbox`, `sample-content`, `csv-import`, `period-integrity`,
  `source-file-size`, `encrypted-pack`, `free-evidence-pack`, `local-only`,
  `offline-reload`, `custom-checklist`, `readiness`, `standalone-install`,
  `paid-license`, `checkout-unavailable`, `no-tax-submission`,
  `artwork-provenance`, and `node-runtime`.
- `npm test` — PASS: 9 unit tests and 39 browser tests.
- `npm run lint` — PASS; `npm run build` — PASS; output includes
  `dist/index.html`.
- `npm run verify:url -- http://127.0.0.1:4174/` — PASS: title, `lang`, one
  h1, main landmark, image alternatives, named buttons, and no console errors.
- `npm run verify:node-runtime` — PASS: a disposable clone completed `npm ci`
  and `npm run build` under Node `v20.19.0`.

After deployment through `/opt/fleet/lib/deploy-static.sh mtd-evidence-pack dist`:

- Production serves `v1.0.12` and the deployed static site reported success as
  deployment `f766bd9f-d570-45c3-b8c1-bd04dbd2510d`.
- `PLAYWRIGHT_BASE_URL=https://mtd-evidence-pack.sociobot.in npm run test:e2e`
  — PASS: 39 browser tests, including demo isolation, same-origin privacy,
  offline reload/export, history/focus, routes/titles/canonicals/404, keyboard,
  mobile, and unfiltered Axe (zero violations on all audited routes).
- `npm run verify:url -- https://mtd-evidence-pack.sociobot.in/` — PASS.
- Fresh 390 px and 1440 px screenshots in `.factory/polish-evidence-5/live/`
  show the first-screen action, isolated demo banner, real workspace, Privacy,
  and designed 404. `cold-check.json` records no horizontal overflow and no
  unexpected console/page errors.
- Live Lighthouse report: Performance **100**, Accessibility **100**, Best
  Practices **100**, SEO **100**; LCP **1.0 s**, CLS **0**, TBT **80 ms**.
  Report: `.factory/polish-evidence-5/live/lighthouse.json`.

## Run and deploy

```sh
npm ci
npm test
npm run build
/opt/fleet/lib/deploy-static.sh mtd-evidence-pack dist
```

## Known gaps and next steps

None. The product remains a local-first static PWA; no server-side data or
tracking was added.
