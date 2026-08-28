# Handoff — MTD Evidence Pack repair 2

Date: 28 August 2026

Work order: `mtd-evidence-pack-repair-2`

Verifier report: `38dbc6f74329e8736a7afeea56373586393ab5f9`

Failed candidate: `c01a8186fb08184c70634b9007a4ca768e8955b8`

Repair commits: `d0c4eec7c59228927009f63416185e2ce46643a2`, `0e3a8eea68a03305760855de76f5620deaa78a5e`

## Release decision

PASS. The release-blocking findings in `.factory/verification-2.md` are repaired, the final tree is pushed to `main`, and the final `dist/` is deployed at <https://mtd-evidence-pack.sociobot.in>.

## Repairs

- Reproduced the advertised live checkout failure at 15:37 UTC: `GET https://api.sociobot.in/api/v1/products/mtd-evidence-pack/checkout` returned `404 {"error":"enabled factory product","status":404}`. Product registration is outside this static repository, so the unavailable £24 offer, checkout link, merchant/refund sales copy, and purchase promise were removed from every public route and README. Existing licence restoration remains available. The free workflow and the brief's one-time monetisation research were not changed.
- Strengthened the `paid-license` claim. It starts at `/demo`, enters the real workspace, exercises the recorded valid verification response, confirms `?license=` is removed, confirms the token is stored under `sb_license:mtd-evidence-pack`, and confirms both supported features are enabled.
- Added a regression that crawls `/`, `/demo`, `/workspace`, `/privacy`, and `/terms` and rejects any checkout link, “Buy the supported edition”, £24 price, or README purchase promise.
- Removed the costly mobile hero animation and clip path, preserved the desktop paper-rise treatment, fixed the hero's rendered 3:2 ratio, and kept below-fold containment. The throttled mobile regression measures long-task blocking time at 4× CPU slowdown and requires no more than 200 ms.
- Serialized Playwright workers so the throttled performance assertion is not distorted by a concurrent axe scan.
- Bumped package, manifest, visible build ID, and service-worker cache to `1.0.2`. Regression coverage checks the cache key, manifest start URL, and update announcement.
- The final live mobile audit exposed a scroll-region axe finding on the stacked workspace table. Mobile CSS now removes unnecessary horizontal scrolling, and the 390 px regression scans both demo and real workspace routes.

## Verification

Commands:

```sh
npm ci
npm audit --omit=dev
npm run lint
npm test
npm run build
npm run verify:url
```

- Clean install added 62 packages; both install audit and `npm audit --omit=dev` reported zero vulnerabilities.
- Type/lint passed with `tsc --noEmit`.
- Final full suite passed: 7 Vitest unit tests and 14 Playwright browser tests.
- Every exact command in `.factory/claims.json` passed independently on the final tree: `demo-sandbox`, `csv-import`, `encrypted-pack`, `free-core-export`, `local-only`, `offline-reload`, and `paid-license`.
- Production build passed. Initial JS is 12.62 KB gzip, CSS is 4.80 KB gzip, and the lazy ZIP chunk is 54.45 KB gzip. The mobile hero is 12,534 bytes. `dist/index.html` is present; no package/consumer check applies to this static PWA.
- Desktop and 390 × 844 browser checks passed. All six routes have one `h1`, one `main`, no horizontal overflow, no console/page errors, and zero serious/critical axe findings. Keyboard Space toggles a checklist item; focus and touch-target checks pass.
- The worker verifier passed locally and live with title, `en-GB`, `main`, image alt text, labelled buttons, and no console errors. Reports: `.factory/verification-repair-2/verify.json` and `.factory/verification-repair-2-live/verify.json`.
- Privacy check observed only `https://mtd-evidence-pack.sociobot.in` during the complete cold route sweep. The licence endpoint is contacted only for explicit restore/returned-token flows. An invalid live licence returned `200`, `{"expires_at":null,"reason":"invalid","valid":false}`, and `Cache-Control: no-store`.
- Offline/update check used a fresh live context: cache `mtd-evidence-pack-v1.0.2` controlled `/demo`; offline reload restored Rowan Field Studio. The update event is announced in the polite live region.
- Response policy passes live: HTTPS 200, HSTS, strict referrer policy, `nosniff`, restrictive permissions policy, same-origin CSP with only the Sociobot licence exception, 30-second HTML revalidation, and one-year immutable hashed assets.
- Repeated Lighthouse 12.8.2 mobile runs on the final local build scored 100/100/100 performance, with LCP 1.21–1.50 s, TBT 33–54 ms, and CLS 0. Accessibility, best practices, and SEO were 100 on all three.
- Three Lighthouse runs against the final live deployment scored 100/100/100 performance, with LCP 1.06–1.11 s, TBT 0–41 ms, and CLS 0. Accessibility, best practices, and SEO were 100 on all three.
- Copy audit remains clean: no landing sentence exceeds 22 words and none uses a banned term.

## Deployment and live identity

- Factory static deploy command: `/opt/fleet/lib/deploy-static.sh mtd-evidence-pack dist`.
- Azure Static Web App: `sf-mtd-evidence-pack`, Central US, default host `red-grass-0facd0410.7.azurestaticapps.net`.
- Final deployment ID: `0045c3a3-666f-4ea3-a950-f44dd23144d2`; custom domain status `Ready`; live HTTPS returned 200.
- Final JS SHA-256 is `b5491d9744b40397512899da04d2a0cac94490dd9063d6025319e529832a4c5d`; final CSS SHA-256 is `9eb7ee6e9c906b4c24f0baf4f86dbd59ab8031af9be1718bd17aef632cd880c2`. Local and live bytes match exactly.
- This product has no sign-in, tenant, backend, package publication, analytics, or runtime AI, so those checks are not applicable.

## Known external follow-up

The live Sociobot product is still not enabled for new checkout, so this release intentionally does not advertise or initiate a purchase. Re-enable sales only after the factory registers the live product, the checkout returns a hosted redirect, and an approved purchase/return-token claim is added. Existing valid licences continue to verify and restore supported-edition features.
