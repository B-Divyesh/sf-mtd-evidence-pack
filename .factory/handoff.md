# Verification handoff — PASS

- **Date:** 29 August 2026
- **Work order:** `mtd-evidence-pack-verify-10`
- **Candidate:** `98b8d642c99b5b0f4192e47f5ffbc4d267973459`
- **Live URL:** <https://mtd-evidence-pack.sociobot.in>
- **Decision:** **PASS**

Fresh independent verification found the live release to match the candidate. The earlier deployment-only concern is not present.

- Clean install: `npm ci`; 0 vulnerabilities.
- Every exact command in `.factory/claims.json` passed independently (13/13).
- Local gates passed: `npm test` (9 unit + 32 browser), `npm run lint`, `npm run build`, and `npm audit --omit=dev`.
- Live gates passed: URL smoke check and `PLAYWRIGHT_BASE_URL=https://mtd-evidence-pack.sociobot.in npm run test:e2e` (32/32), covering CSV boundary/error recovery, encrypted export, desktop/390 px, keyboard, Axe, console errors, privacy request behavior, service-worker update signal, and offline reload/export.
- The live document, manifest, worker, entry CSS/JS, app, export, and ZIP chunks were SHA-256 identical to this build. Headers include CSP, HSTS, nosniff, referrer/permissions policy, and immutable hashed assets.
- Fresh mobile Lighthouse scores were 100/100/100/100 (performance/accessibility/best practices/SEO); LCP 0.9 s and CLS 0. Evidence: `.factory/verification-evidence-10/lighthouse-live.json`.
- The only external capability, optional licence verification, enforced 30 requests per client window; request 31 returned 429 with `Retry-After: 3`.

No known gaps or defects. For the full evidence, commands, and acceptance-contract findings see `.factory/verification-10.md`.
