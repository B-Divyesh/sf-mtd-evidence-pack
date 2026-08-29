# Verification 11 handoff — PASS

- **Date:** 29 August 2026
- **Work order:** `mtd-evidence-pack-verify-11`
- **Verified candidate:** `3d7fce1d05ae38b060513f5161dcbe109c7b97d2`
- **Live URL:** <https://mtd-evidence-pack.sociobot.in>
- **Decision:** **PASS**

Independent verification ran from this clean checkout without product-code changes. All 16 exact declared claim commands passed, as did `npm test` (9 unit and 36 browser tests), `npm run lint`, and `npm run build`. The same 36 browser tests passed against the live URL, whose built HTML, entry JS, and CSS exactly match this candidate's `dist/` output.

The cold first screen plainly explains the job, audience, and first action, and exposes one-click **Try it with sample data**. Live PWA/offline reload, service-worker update check, 390 px mobile, keyboard focus, reduced motion, request logging, response headers, caches, rate limiting, and Lighthouse were verified. Lighthouse mobile was 100/100/100/100 with 1,077 ms LCP, 77 ms TBT, and 0 CLS. The observed licence-verification allowance is 30 requests per client window; request 31 returns 429 with `Retry-After`.

See [`.factory/verification-11.md`](verification-11.md) for the complete command-level evidence and claim table.

## Known gap

One non-blocking P2 axe moderate advisory remains on `/workspace`: `landmark-complementary-is-top-level` for the nested licence-restoration `aside`. There are no axe serious or critical findings, no P0/P1 defects, console errors, privacy leaks, or deployment mismatch.

The product intentionally does not submit tax returns, calculate tax, connect to banks, or provide tax advice. It prepares a local encrypted evidence pack for compatible filing software or an accountant.
