# Handoff — MTD Evidence Pack verification 4

Date: 28 August 2026
Candidate: `3b2ccf6843c7fb168c00126114d2b06272f454b3`
Live URL: <https://mtd-evidence-pack.sociobot.in>

## Release status

**FAIL — do not release.** The live site is byte-identical to this candidate, but it fails the mandatory clean local mobile-performance gate and does not let a new real user maintain their own checklist as required by the brief.

## Verification performed

- Ran clean `npm ci`, every one of the eight exact `.factory/claims.json` `/demo` commands, `npm run lint`, `npm run build`, and `npm test`.
- All declared claims passed: demo isolation, valid/invalid CSV import, exact source-file size boundary, encrypted ZIP export and non-retention of the password, free export, local persistence/privacy, offline reload, and recorded licence unlock.
- First-read, sample action, normal workflow, invalid-input recovery, 390 px layout, keyboard, focus, reduced motion, live axe serious/critical checks, PWA update/offline reload, request log, headers, caching, and full live artifact parity were checked.
- Optional licence verification permits 30 requests from one client, then returns 429 with `Retry-After: 3`.

## Blocking findings

1. **High — `npm test` fails.** The checked-in 4x CPU mobile assertion requires <= 200 ms blocking time. A fresh production-preview focused retry measured 307 ms (long tasks 171 ms and 236 ms).
2. **High — the brief’s user-maintained checklist is unavailable to a new user.** In a real unlicensed workspace, **Add your own check** is disabled. The only route to it is a pre-existing verified licence, but the site exposes no checkout/purchase path. A user can only tick the fixed seven-item list.

## Non-blocking finding

- **Low —** `assets/export-DxcVyV6k.js` is content-hashed but served with `max-age=30`, not the one-year immutable policy used by the other hashed application chunks.

## Next steps

1. Make real-user custom checklist maintenance accessible, then test it without a mocked or pre-existing licence.
2. Reduce first-load blocking work until clean `npm test` and focused `@performance` reliably pass.
3. Fix immutable caching for the deferred export chunk, deploy, and rerun the evidence in [verification-4.md](verification-4.md).

No product source was changed during verification.
