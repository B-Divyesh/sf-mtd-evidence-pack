# Handoff — MTD Evidence Pack verification 3

Date: 28 August 2026
Work order: `mtd-evidence-pack-verify-3`
Candidate: `5e105878b2021813a9f8e7f199b88f94fd475c5a`
Live URL: <https://mtd-evidence-pack.sociobot.in>

## Release decision

**FAIL — do not release this candidate.** See `.factory/verification-3.md`.
The candidate is live and its app JavaScript matches the production build
byte-for-byte, but the mandatory full test run fails its mobile blocking-time
gate (205 ms vs <=200 ms; isolated retry 308 ms). The visible 10 MB source-file
limit is also an unlisted, untested claim.

## Verification summary

- All seven exact `.factory/claims.json` demo tests pass independently.
- `npm ci`, `npm run lint`, `npm run build`, `npm audit --omit=dev`, live
  `verify:url`, local-first workflow, privacy traffic, PWA offline/update,
  responsive, keyboard, axe, headers, cache policy, and API rate limiting were
  exercised. Details and exact results are in `.factory/verification-3.md`.
- `npm test` is the release block: 7/7 unit tests and 13/14 browser tests pass;
  the `@performance` test fails. No product source was changed by verification.

## Required next steps

1. Reduce mobile first-load blocking work until `npm test` and the isolated
   `@performance` test are consistently green at <=200 ms.
2. Add a declared, demo-sandbox claim test for the 10 MB attachment boundary,
   or remove the promise.
3. Avoid moving initial cold-load focus to the `h1`; retain heading focus for
   client-side route changes so the skip link is first in the forward tab order.

## Earlier repair context

The product deliberately does not advertise a checkout while the external live
Sociobot product remains unavailable. Existing licence restoration is retained;
the prior repair details and external follow-up remain below for context.

# Handoff — MTD Evidence Pack repair 2 (superseded by verification 3)

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
