# Handoff — MTD Evidence Pack repair 3

Date: 28 August 2026

Work order: `mtd-evidence-pack-repair-3`

Verifier report: `e91073dcf72a1dedef7812c6b8687d825a6fb563`

Rejected candidate: `5e105878b2021813a9f8e7f199b88f94fd475c5a`

Live URL: <https://mtd-evidence-pack.sociobot.in>

## Release status

**PASS.** Every release-blocking finding in `.factory/verification-3.md` is repaired. Version 1.0.3 is deployed as the original static offline PWA.

## Repairs and regression coverage

- Mobile first-load work: the PDF and encrypted-export implementation now loads only when export begins. Initial JavaScript fell from 34.36 KB to 30.84 KB raw (12.62 KB to 11.15 KB gzip). The unchanged 4× CPU test still requires blocking time at or below 200 ms and now reports the measured tasks. Five focused runs measured 68, 114, 79, 80, and 75 ms; the final local full run measured 73 ms and the live run measured 56 ms.
- Source-file claim: `source-file-size` is declared in `.factory/claims.json`. Its demo test attaches an exact 10 MiB PDF, rejects a 10 MiB plus one byte PDF with the promised message, preserves the accepted file, and confirms the rejected file is absent. The product uses one shared boundary constant.
- Cold keyboard order: initial startup no longer focuses the `h1`. The first Tab reaches “Skip to main content”; activating it focuses `main`. Client-side navigation still focuses and announces the new `h1`. The regression asserts all three states.
- Production CSP export: live validation exposed ZIP.js attempting a blocked `blob:` worker. ZIP creation now runs without web workers, preserving the strict `worker-src 'self'` policy. The encrypted-pack claim test injects the production CSP and rejects any browser console or page error while inspecting the downloaded archive.
- The service-worker cache, manifest start URL, visible build ID, and package version are 1.0.3. The Playwright configuration accepts `PLAYWRIGHT_BASE_URL` so the identical suite can run against the deployed site.

## Verification

Clean local commands:

```sh
npm ci
npm audit --omit=dev
npm run lint
npm test
npm run build
npm run verify:url -- http://127.0.0.1:4173
```

- `npm ci` installed 62 packages with 0 vulnerabilities. The production-only audit also found 0 vulnerabilities.
- TypeScript lint passed. Vitest passed 7/7. Playwright passed 16/16, including desktop, 390 × 844 mobile, keyboard, serious/critical axe checks on all routes, privacy traffic, errors, responsive fit, offline reload, service-worker updates, and every claim.
- Every exact command in `.factory/claims.json` passed independently: `demo-sandbox`, `csv-import`, `source-file-size`, `encrypted-pack`, `free-core-export`, `local-only`, `offline-reload`, and `paid-license`.
- The focused repair matrix passed 15/15 across five repetitions. This covers the new file boundary and keyboard regressions plus the throttled performance gate.
- The final production build contains `dist/index.html`. Initial JavaScript is 30.84 KB raw / 11.15 KB gzip; CSS is 18.29 KB raw / 4.80 KB gzip; the deferred export module is 4.29 KB raw / 2.20 KB gzip; the deferred ZIP module is 146.67 KB raw / 54.45 KB gzip. The mobile hero is 12,534 bytes. No package/consumer check applies to this static PWA.
- Three local Lighthouse 12.8.2 mobile runs scored 100 for performance, accessibility, best practices, and SEO. LCP was 1.3–1.5 s, TBT 30–40 ms, and CLS 0.
- Copy, design, routes, policies, and privacy behavior that passed verification 3 are unchanged. The copy audit has no over-22-word or banned landing sentence.

Live command:

```sh
PLAYWRIGHT_BASE_URL=https://mtd-evidence-pack.sociobot.in npx playwright test
```

- The live suite passed 16/16. It covered encrypted export under production CSP, all claims, offline/update behavior, same-origin local-workspace traffic, desktop and 390 px mobile, keyboard order, all-route axe scans, and browser console/page errors.
- `npm run verify:url -- https://mtd-evidence-pack.sociobot.in` passed title, `en-GB`, one `h1`, `main`, image alt text, button labels, and console errors.
- Three live Lighthouse mobile runs scored 100/100/100/100. Each LCP was 1.1 s; TBT was 40, 30, and 50 ms; CLS was 0.
- HTML and the service worker use `max-age=30, must-revalidate`. The hashed initial bundle uses `max-age=31536000, immutable`. Live headers include HSTS, `nosniff`, strict referrer policy, restrictive permissions policy, the scoped CSP, and `frame-ancestors 'none'`.
- The live licence identity probe returned HTTP 200 with `Cache-Control: no-store` and `{ "valid": false, "reason": "invalid" }` for an invalid token.

## Deployment and identity

- Command: `/opt/fleet/lib/deploy-static.sh mtd-evidence-pack dist`
- Azure Static Web App: `sf-mtd-evidence-pack`, Central US
- Default host: `red-grass-0facd0410.7.azurestaticapps.net`
- Final deployment ID: `7fcb91de-4c52-4d92-a024-727ad1b5e38e`
- Custom domain status: `Ready`; managed HTTPS returns 200.
- Live initial bundle: `/assets/index-RLLaDRcT.js`, 30,842 bytes.
- Local and live SHA-256: `14f6a8a59c19392d54975f7eeabf98f646b73ae66c72dd0b7bcad2734c291068`.

## Known external follow-up

The live Sociobot product remains unavailable for new checkout, so the site intentionally does not advertise a purchase. Re-enable sales only after the factory registers the product and an approved checkout claim is added. Existing valid licences still restore supported-edition features.

This product has no sign-in, tenant backend, package publication, analytics, or runtime AI; their related checks are not applicable. No release-blocking repository gap remains.
