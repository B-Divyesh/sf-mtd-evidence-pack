# Polish 1 — adversarial review repair

**Work order:** `mtd-evidence-pack-polish-1`  
**Base reviewed:** `e9415c79a281c25083cba2614110e43996668828`  
**Product repair:** `c1ee48dcd9ecae3b93023d7bd7c1e028ffe947db`  
**Live URL:** <https://mtd-evidence-pack.sociobot.in>

All findings in `.factory/review-1.md` were repaired. There are no earlier
`.factory/review-*.md` or `.factory/polish-*.md` files; the earlier
`verification-*.md` findings had already been fixed and were re-covered by the
full test suite.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Replaced factory-checkout jargon with “New licences are not currently available.” Added `checkout-unavailable` to claims and a tagged public-route test. | Clean-clone `@claim:checkout-unavailable` passed; live full Playwright passed; landing screenshot: `polish-evidence-1/live-landing-desktop.png`. |
| F-1-2 | Removed the unimplemented “versioned” checklist promise from the README. | README copy audit in `copy-audit.md`; clean-clone full test suite passed. |
| F-1-3 | Added 404 description, canonical, Open Graph and Twitter metadata; restored Workspace in the header and Privacy/Terms in the footer. | `static-host routing keeps product paths and returns the designed 404 page for unknown paths` passed; live `/not-a-real-route` returned HTTP 404 with all elements; screenshot: `polish-evidence-1/live-404-mobile.png`. |
| F-1-4 | Replaced “Field note 01” with “Readiness preview”. | `landing uses the reviewed plain-language wording` passed locally and live; landing screenshot. |
| F-1-5 | Removed “The product itself”; the section now starts with its useful heading. | `landing uses the reviewed plain-language wording` passed locally and live; landing screenshot. |
| F-1-6 | Replaced the mood label with “What this tool does not do” and stated that the tool does not submit tax returns. | `landing uses the reviewed plain-language wording` passed locally and live; landing screenshot. |
| F-1-7 | Replaced the vague hero caption with “Keep source files with the records for one selected quarter.” | `landing uses the reviewed plain-language wording` passed locally and live; landing screenshot. |
| F-1-8 | Split the 25-word README introduction into short, concrete sentences. | `copy-audit.md` records no line over 22 words; clean-clone full test suite passed. |

## Required demo and routing checks

- The first-screen action now opens `/?demo=1`. It is an isolated sample
  workspace, displays **Demo — sample data, nothing is saved**, and provides
  **Reset demo** and **Start for real**. `@claim:demo-sandbox` passed from a
  clean clone and live. Screenshot: `polish-evidence-1/live-demo-query-mobile.png`.
- `/demo` remains a direct demo URL. `/workspace`, `/privacy`, `/terms`, and
  unknown routes are real Static Web App routes. `app routes update title,
  description, and canonical metadata` checks each SPA route; the live cold
  check confirmed its title, description, canonical, one h1, and main.
- The 390 px demo screenshot shows the banner, action targets, and workspace
  without horizontal overflow. The browser suite also runs the 390 px and 200%
  text checks.

## Verification

- Fresh clone: `/tmp/mtd-evidence-pack-clean.aUbxI9` at `c1ee48d`; `npm ci`,
  `npm run build`, every exact command in `.factory/claims.json`, `npm test`,
  `npm audit --omit=dev`, and `npm run verify:url` passed. The last Playwright
  record is `test-results/.last-run.json` with `status: passed`.
- Local browser suite: 8 unit tests and 24 browser tests passed before the
  follow-up wording/metadata regression tests were added; those two follow-up
  tests passed locally and against the live URL before handoff.
- Live: `PLAYWRIGHT_BASE_URL=https://mtd-evidence-pack.sociobot.in npm run
  test:e2e` passed 24 tests before the two follow-up regression tests were
  added. `npm run verify:url -- https://mtd-evidence-pack.sociobot.in` passed.
  The cold route metadata check covered `/`, `/?demo=1`, `/demo`,
  `/workspace`, `/privacy`, `/terms`, and `/not-a-real-route`.
- Accessibility: Playwright Axe scans returned no serious or critical issues on
  all product routes and the 404, including mobile routes. The standalone Axe
  CLI could not locate a system Chrome in this container, so the checked-in
  Playwright Axe integration was used.
- Offline/privacy: the tagged offline encrypted-export claim and same-origin
  request logging passed in the clean clone and production suite.

## Deployment

Deployed the `dist/` build through `/opt/fleet/lib/deploy-static.sh` as Azure
Static Web App deployment `77b69730-9512-45a6-8884-95d94a4aef2d`; production
returned HTTP 200 at the live URL. The static 404 returned HTTP 404.
