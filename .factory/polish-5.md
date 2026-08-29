# Polish round 5 — zero-finding repair evidence

- **Date:** 29 August 2026
- **Repair commit:** `2156f318100811c44ebf779c2576225e4d4f55b0`
- **Deployment:** `f766bd9f-d570-45c3-b8c1-bd04dbd2510d` via the static work-order deployment
- **Live URL:** <https://mtd-evidence-pack.sociobot.in>

All 17 exact claim commands passed independently from clean clone
`/tmp/mtd-polish5-clean.UfNAog/repo`. Its aggregate quality run passed 9 unit
tests and 39 browser tests. The same 39 browser tests passed against production
after deployment. The live route Axe assertions allow **zero violations of any
severity**.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Retained plain unavailable-licence wording and the declared no-checkout contract. | `@claim:checkout-unavailable`; `live/landing-mobile.png`; live `/` passed. |
| F-1-2 | Kept the unsupported versioned-checklist promise removed. | `public copy uses one artifact and licence vocabulary`; live `/` passed. |
| F-1-3 | Retained the designed 404 metadata, common header, workspace and legal links. | `static-host routing keeps product paths and returns the designed 404 page for unknown paths`; `live/404-mobile.png`; live unknown URL returned HTTP 404. |
| F-1-4 | Kept the useful “Readiness preview” section label. | `landing uses the reviewed plain-language wording`; `live/landing-mobile.png`; live `/` passed. |
| F-1-5 | Kept the non-informative “The product itself” heading removed. | `landing uses the reviewed plain-language wording`; live `/` passed. |
| F-1-6 | Kept the explicit “What this tool does not do” no-submission boundary. | `@claim:no-tax-submission`; `live/landing-desktop.png`; live `/` passed. |
| F-1-7 | Kept the concrete selected-quarter source-file caption. | `landing uses the reviewed plain-language wording`; `live/landing-desktop.png`; live `/` passed. |
| F-1-8 | Kept the README introduction split into short concrete sentences. | `.factory/copy-audit.md`; `public copy uses one artifact and licence vocabulary`; live `/` passed. |
| F-2-1 | Retained mode-specific save language: demos reset; real work saves locally. | `@claim:demo-sandbox`; `live/demo-query-mobile.png` and `live/workspace-mobile.png`; live `/?demo=1` and `/workspace` passed. |
| F-2-2 | Kept “evidence pack” as the one exported-artifact name. | `@claim:encrypted-pack`; `public copy uses one artifact and licence vocabulary`; live `/demo` passed. |
| F-2-3 | Kept “Free export and existing licences” in place of the vague old label. | `landing uses the reviewed plain-language wording`; `live/landing-mobile.png`; live `/` passed. |
| F-2-4 | Kept implementation jargon out of user-facing README copy. | `public copy uses one artifact and licence vocabulary`; live `/` passed. |
| F-2-5 | Kept the direct generated-art disclosure in shared footers. | `@claim:artwork-provenance`; `live/404-mobile.png`; live `/` and unknown route passed. |
| F-3-1 | Retained the declared no-tax-submission claim and its workflow/request test. | `@claim:no-tax-submission`; `live/landing-desktop.png`; live `/` passed. |
| F-3-2 | Retained the complete unlicensed import, checklist, source-file, and encrypted-export contract. | `@claim:free-evidence-pack`; `live/demo-query-mobile.png`; live `/demo` passed. |
| F-3-3 | Retained the declared Sociobot billing destination and exact-token request assertion. | `@claim:paid-license`; `live/privacy-mobile.png`; live `/privacy` passed. |
| F-3-4 | Retained declared hero-art provenance. | `@claim:artwork-provenance`; `live/landing-desktop.png`; live `/` passed. |
| F-3-5 | Retained the concrete 12-record, three-file, one-open-item sample description. | `@claim:sample-content`; `live/demo-query-mobile.png`; live `/?demo=1` passed. |
| F-3-6 | Kept “core pack” out of public product copy. | `public copy uses one artifact and licence vocabulary`; `live/landing-mobile.png`; live `/` passed. |
| F-3-7 | Retained the README’s direct product Privacy link. | `README links directly to the live product Privacy page`; `live/privacy-mobile.png`; live `/privacy` passed. |
| F-4-1 | Retained early demo-mode isolation: both demo URLs skip real licence and workspace reads/writes until explicit exit. | `@claim:demo-sandbox`; `live/demo-query-mobile.png`; live `/?demo=1` and `/demo` passed. |
| F-4-2 | Retained saved scroll coordinates and focused headings on Back and Forward. | `@routing Back and Forward restore each route's scroll position and focus its heading`; live `/` ↔ `/demo` passed. |
| F-4-3 | Retained the explicit offline first-screen fact. | `@claim:offline-reload`; `live/landing-mobile.png`; live `/` passed. |
| F-4-4 | Retained plain “file-change checks” copy, with SHA-256 only as explanation. | `@claim:encrypted-pack`; `live/landing-desktop.png`; live `/demo` passed. |
| F-4-5 | Retained concrete README privacy guidance about deletion and licence checks. | `README links directly to the live product Privacy page`; `live/privacy-mobile.png`; live `/privacy` passed. |
| F-4-6 | Retained browser Install guidance that names the action and result. | `@claim:standalone-install`; live `/manifest.webmanifest` passed. |
| F-4-7 | Retained the direct 404 section label “Page not found.” | `static-host routing keeps product paths and returns the designed 404 page for unknown paths`; `live/404-mobile.png`; live unknown route passed. |
| F-4-8 | Retained the direct 404 heading “We could not find this page.” | `routes load without browser errors`; `live/404-mobile.png`; live unknown route passed. |
| F-4-9 | Retained the shared wordmark/header and real online status on the 404. | `all product routes have no accessibility violations`; `live/404-mobile.png`; live unknown route passed. |
| F-4-10 | Retained local favicon, apple-touch icon, and manifest links on the static 404. | `static-host routing keeps product paths and returns the designed 404 page for unknown paths`; `live/404-mobile.png`; live unknown route passed. |
| F-5-1 | Replaced the workspace licence prompt’s nested `<aside>` with a non-landmark `<div>` and tightened every Axe check to reject all violations. | `all product routes have no accessibility violations` and `@mobile core demo controls fit a 390px viewport`; `live/workspace-mobile.png`; live `/workspace` passed. |
| F-5-2 | Declared the exact supported range in `package.json`, corrected README wording, and added a lower-bound runtime claim that clones, installs, and builds under Node 20.19.0. | `@claim:node-runtime`; clean-clone `npm run verify:node-runtime`; live `/` passed. |
| F-5-3 | Renamed the repository-permission heading to “Source code licence.” | `README links directly to the live product Privacy page`; `.factory/copy-audit.md`; live `/` passed. |

## Live cold check

Fresh 390 px and 1440 px contexts made no unexpected console/page errors and
had no horizontal overflow. Screenshots are in
`.factory/polish-evidence-5/live/`; `cold-check.json` records the route status,
title, one h1, one main, overflow, and console result for `/`, `/?demo=1`,
`/workspace`, `/privacy`, and the real HTTP 404. The expected browser console
notice for a direct 404 response is excluded by the route-error test.

No review finding remains unresolved.
