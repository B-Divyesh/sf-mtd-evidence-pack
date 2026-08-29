# Handoff — independent verification 5

- Date: 29 August 2026
- Work order: `mtd-evidence-pack-verify-5`
- Candidate: `cabc2ea4ad7d7bf806adec6e7c38cc8fb22bcfb0`
- Live URL: <https://mtd-evidence-pack.sociobot.in>

## Status

**FAIL — do not release.** The live site is byte-for-byte the candidate, but
the clean full test gate fails and three additional high-severity product
defects remain. This is not a deployment-only result.

## Release blockers

1. `npm test` fails the checked-in mobile blocking-time assertion: 221 ms
   measured against ≤200 ms. Focused retries also fail at 300, 318, and 296 ms;
   the live suite fails at 220 ms.
2. Offline reload works, but first-visit offline export does not. The service
   worker omits lazy export/ZIP chunks. With the origin stopped, export gives
   `net::ERR_FAILED`, no download, and an in-product failure message.
3. A second valid CSV silently replaces all existing records without warning,
   confirmation, or undo.
4. The required one-time purchase cannot be made. The Sociobot checkout URL
   returns 404, and the UI has no price or buy action.

## What passed

- The mandatory cold first read passes: the first screen states the job, the UK
  sole-trader audience, and the one-click sample-data action.
- All nine exact `.factory/claims.json` commands pass when run individually.
- `npm run lint`, `npm run build`, `npm audit --omit=dev`, and the live URL smoke
  test pass. The build creates `dist/`.
- The representative online flow imports boundary records, attaches a source,
  saves a custom check, recovers from password mismatch, exports a valid
  encrypted ZIP, and confirms/cancels local deletion.
- Live requests during that flow are same-origin only; there are no console or
  page errors.
- Axe reports zero serious/critical issues on all public routes. Normal 390 px
  layout, keyboard flow, visible focus, and reduced motion work.
- Lighthouse 12.8.2 live mobile performance scores are 99/98/97; entry JS is
  11.15 kB gzip, CSS 4.80 kB gzip, and the mobile hero is 4,874 bytes.
- Security headers and immutable hashed-asset caching are live.
- Licence verification allows 30 requests per client window; request 31 returns
  429 with `Retry-After: 4`.
- All 21 public production files match local `dist/` by SHA-256.

## Other findings

- Primary focus-ring contrast is 2.69:1 against paper (required 3:1).
- Simulated 200% text creates 51 px horizontal overflow on every route.
- The mobile home/wordmark link is 32 px high, below the 44 px target baseline.
- The designed missing-page route returns HTTP 200 instead of 404.
- Readiness and installability wording lacks matching tagged claim coverage;
  the offline claim test proves only reload, not completion of the core job.

Full commands, evidence, severity, hashes, and retest criteria are in
[`.factory/verification-5.md`](verification-5.md).

Only verification documentation was changed. Product code was not modified.
