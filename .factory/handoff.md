# Repair handoff — PASS

- **Date:** 29 August 2026
- **Work order:** `mtd-evidence-pack-repair-7`
- **Verifier base:** `20c1706a621698a4561198ff6d074faad6715bb8` (`.factory/verification-9.md`)
- **Repair commit:** `d586c95b8132ee529228ca54582900932a9a922b`
- **Release:** `1.0.9`
- **Live URL:** <https://mtd-evidence-pack.sociobot.in>
- **Deployment:** Azure Static Web Apps `d15eb8f1-7b38-45b6-a81c-a38abe7483ef` — succeeded 29 August 2026.

## Findings repaired

| Verifier finding | Root cause | Repair | Regression evidence |
|---|---|---|---|
| H1: CSV and source-file imports had no visible keyboard focus. | The focusable file inputs were transparent, small absolute elements. Their visible `.file-button` labels had no focus-within style, and browser focus did not scroll those labels into view. | Each transparent input now covers its visible label. `.file-button:focus-within` draws the designed 3 px `#8D332E` ring, and a `focusin` handler scrolls the visible label into view. | `@keyboard @mobile file imports show a focus ring and scroll the visible control into view` uses real Tab traversal for both controls. It ran in desktop and 390 px projects. Live measurements: desktop controls y=821–869 and y=801–849; mobile y=754–802 and y=765–813; each had a `3px solid` ring. |
| M1: the demo banner scrolled out of view at 390 px. | The mobile media rule overrode `position: sticky` with `position: relative`. | The mobile layout still stacks banner content but no longer changes its positioning. | `@mobile demo banner remains visible while working lower in the sample` scrolls to the export panel and asserts the banner plus both controls remain visible. Live: desktop sticky y=0–58; 390 px sticky y=0–87. |
| L1: hero-image provenance was only internal. | The exact generation provenance existed in `.factory/design.md`, but no public page said the hero was generated. | Every application footer and the separate 404 footer now state: “Hero artwork was generated for this product.” The landing copy audit records the seven-word disclosure. | `public footers disclose that the hero artwork was generated` covers landing and designed 404. |

No researched-brief behavior or declared claim was removed or weakened. The release bumps the PWA cache and start URL to `1.0.9`, so installed clients receive the repair through the normal worker update path.

## Verification

### Clean local gates

- `npm ci` — installed 62 packages; audit reported 0 vulnerabilities.
- Ran every exact command in `.factory/claims.json` from the clean install. All 13 declared claims passed: demo sandbox, CSV import, period integrity, source-file size, encrypted pack, free export, local-only storage, offline reload, custom checklist, readiness, standalone install, licence restore, and checkout unavailable.
- `npm test` — PASS: 9 Vitest unit tests and 32 Playwright browser tests.
- `npm run lint` — PASS (`tsc --noEmit`).
- `npm run build` — PASS; `dist/index.html` is present.
- `npm audit --omit=dev` — PASS: 0 vulnerabilities.
- `npm run verify:url -- http://127.0.0.1:4173` — PASS: title, `lang=en-GB`, one h1, main landmark, image alternatives, labelled buttons, and no console errors.
- Browser integration uses Axe on landing, demo, workspace, privacy, terms, designed 404, and mobile views; no serious or critical violations. It also covers keyboard skip navigation, Space checklist operation, 200% text, reduced motion, 390 px overflow, PWA update, and real offline reload/export.

### Production gates

- `npm run verify:url -- https://mtd-evidence-pack.sociobot.in` — PASS with no browser errors.
- `PLAYWRIGHT_BASE_URL=https://mtd-evidence-pack.sociobot.in npm run test:e2e` — PASS: 32/32 in 47.8 s, including the complete encrypted export, privacy-request, offline/reload, worker-update, desktop, keyboard, and 390 px paths.
- A SHA-256 comparison of every publicly served build file except host-consumed `staticwebapp.config.json` matched **26/26** files byte-for-byte.
- Live response policy: HTTPS 200; `Strict-Transport-Security`, `Referrer-Policy`, `X-Content-Type-Options`, `Permissions-Policy`, and the configured self-only CSP with `frame-ancestors 'none'` are present. `connect-src` permits only the disclosed optional Sociobot licence API in addition to same origin.
- Live Lighthouse 12.8.2 mobile retry: **100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO**; FCP 0.9 s, LCP 0.9 s, TBT 60 ms, CLS 0.
- Production build output: initial entry JavaScript is 1.87 KB gzip; all JavaScript chunks total 69.15 KB gzip; CSS is 4.96 KB gzip. Deferred app/export/ZIP chunks preserve the static first-screen budget.

## Privacy, PWA, and scope

- The production `local-only` claim records only the product origin during the demo-to-real workflow. There are no analytics, third-party fonts, bank/HMRC, AI, or unapproved runtime requests.
- The `offline-reload` claim verifies cache `mtd-evidence-pack-v1.0.9`, forced offline reload of the sample workspace, and an encrypted sample export. The worker update-announcement test also passes.
- This remains the original static, local-first PWA deployment class. There is no backend, sign-in tenant, package artifact, CLI, or consumer package to test. The optional licence flow remains the only appropriate external integration and is covered with its recorded response fixture.

## Known gaps and next steps

None. The product is deployed and ready for release verification.
