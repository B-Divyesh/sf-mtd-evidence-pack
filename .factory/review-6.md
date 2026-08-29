# Adversarial first-read review 6 — PASS

**Date:** 29 August 2026  
**URL:** <https://mtd-evidence-pack.sociobot.in>  
**Commit reviewed:** `4af3311b08eefd7f3a09970bf4c30c7292a69fde`

## Verdict

**PASS.** No blocking or minor finding remains. The cold first screen is clear
at 390 × 844 and 1440 × 900, the one-click demo immediately shows a populated
quarter, its reset and storage isolation work, all 17 declared claim commands
pass independently, and every earlier finding remains fixed in both production
and source. No claim is untested and no public claim-like sentence is unlisted.

## Findings

None.

## Cold first read

I opened production in separate fresh Chromium contexts and did not scroll.
Before interacting, I understood:

- **What it does:** prepares one quarter of bookkeeping records as an evidence
  pack.
- **Who it is for:** UK sole traders giving records to an accountant or
  compatible filing software.
- **What to click first:** **Try it with sample data**. The adjacent result says
  it loads 12 records, three source files, and one open check, and saves nothing.

All three answers are visible at both sizes. The exact first-screen text is
**“Prepare your quarterly evidence pack”**, **“For UK sole traders who keep
local books and need a clear pack for an accountant or filing software”**, and
**“Try it with sample data.”** The 390 px action is fully visible. Both cold
loads have no horizontal overflow, console error, or page error and request
only the product origin.

## Copy audit

Counts use rendered, space-separated words. Hyphenated terms, paths, URLs, and
versions count as one word; standalone punctuation does not. Headings, labels,
actions, statuses, meaningful alternative text, commands, and list entries are
included so that non-sentence interface copy is also checked. No item exceeds
22 words. No banned marketing word, unexplained jargon, metaphor heading,
non-informative slogan, inconsistent product term, or non-result-naming button
remains.

### Landing page

| Exact copy | Words | Result |
|---|---:|---|
| Skip to main content | 4 | Clear action |
| MTD Evidence Pack | 3 | Product name |
| Demo | 1 | Clear navigation |
| Workspace | 1 | Clear navigation |
| Privacy | 1 | Clear navigation |
| Online | 1 | Network status |
| Local quarterly record check | 4 | Clear section label |
| Prepare your quarterly evidence pack | 5 | Plain job headline |
| For UK sole traders who keep local books and need a clear pack for an accountant or filing software. | 19 | Audience and outcome |
| Try it with sample data | 5 | Result-naming action |
| Loads 12 records, 3 source files, and one open check. | 10 | `sample-content` result |
| Nothing is saved. | 3 | `demo-sandbox` |
| Works offline after your first visit | 6 | `offline-reload` |
| Records stay on this device | 5 | `local-only` |
| Evidence pack export is free | 5 | `free-evidence-pack` |
| Q1—Q4 | 1 | Artwork label |
| Four paper filing houses connected by a coral path under a paper moon. | 13 | Useful image alternative |
| Keep source files with the records for one selected quarter. | 10 | Concrete export description |
| Readiness preview | 2 | Clear section label |
| See what is missing before export | 6 | `readiness` |
| The checklist and records stay beside each other. | 8 | Concrete preview description |
| Open items remain named. | 4 | `readiness` |
| Quarter 1 · 2026–27 | 3 | Sample label |
| 6 of 7 checked | 4 | Sample status |
| 12 bookkeeping records | 3 | Sample status |
| 3 source files | 3 | Sample status |
| Invoices and receipts can be matched to records | 8 | Named sample item |
| How it works | 3 | Clear section label |
| Build the pack in three passes | 6 | Process heading |
| 01 / 02 / 03 | 1 each | Structural markers |
| Set the period | 3 | Step heading |
| Name the quarter and check its start and end dates. | 10 | Concrete instruction |
| Import and match | 3 | Step heading |
| Add a categorised CSV. | 4 | `csv-import` |
| Attach statements, invoices, receipts, or an index. | 7 | Source-file instruction |
| Check and export | 3 | Step heading |
| Close each checklist item. | 4 | `readiness` |
| Download one password-protected ZIP with records, a PDF summary, source files, and file-change checks. | 14 | `encrypted-pack` |
| What this tool does not do | 6 | Clear limitation label |
| Prepare records before submission | 4 | Clear limitation heading |
| It does not submit tax returns. | 6 | `no-tax-submission` |
| Use compatible filing software or an accountant when you are ready to submit. | 13 | Concrete next step |
| Free export and existing licences | 5 | Clear price and licence label |
| Free evidence pack export | 4 | Clear price heading |
| Import records, maintain your checklist, attach source files, and export the encrypted evidence pack without a licence. | 17 | `free-evidence-pack` |
| Restore a licence | 3 | Clear section heading |
| Existing licence holders can restore saved cover notes. | 8 | `paid-license` |
| New licences are not currently available. | 6 | `checkout-unavailable` |
| Paste your licence | 3 | Bound field label |
| Verify licence | 2 | Result-naming action |
| Prepare a quarterly evidence pack on your device. | 8 | Footer summary |
| Hero artwork was generated for this product. | 7 | `artwork-provenance` |
| Privacy | 1 | Clear footer link |
| Terms | 1 | Clear footer link |
| Built by Param Factory (external site) | 6 | Clear external link |
| v1.0.12 | 1 | Build identifier |

### README

| Exact copy | Words | Result |
|---|---:|---|
| MTD Evidence Pack | 3 | Product name |
| Prepare a quarterly MTD evidence pack from local bookkeeping records. | 10 | Plain summary |
| MTD Evidence Pack is for UK sole traders who keep their own books. | 13 | Audience |
| Import a categorised CSV and attach source files. | 8 | Declared capabilities |
| Check one quarter before exporting an encrypted evidence pack for your accountant or compatible filing software. | 16 | Declared outcome |
| Use compatible filing software or an accountant when you are ready to submit. | 13 | Concrete next step |
| Try the sample | 3 | Clear heading |
| Open `/?demo=1` locally or visit `https://mtd-evidence-pack.sociobot.in/?demo=1`. | 6 | Clear instruction |
| The sample contains 12 categorised records, three source files, and one open checklist item for one quarter. | 17 | `sample-content` |
| Demo changes are kept in memory and disappear on reload. | 10 | `demo-sandbox` |
| `/demo` also opens the sample. | 5 | Clear route instruction |
| What the export contains | 4 | Clear heading |
| The password-protected ZIP contains: | 4 | `encrypted-pack` |
| `records/transactions.csv` | 1 | Export entry |
| `summary/evidence-pack-summary.pdf` | 1 | Export entry |
| attached source files | 3 | Export entry |
| `manifest.json`, with checklist status and file-change checks (SHA-256) | 8 | Export entry |
| `README.txt` | 1 | Export entry |
| Send the ZIP password through a different channel. | 8 | Concrete security instruction |
| The password is never saved. | 5 | `encrypted-pack` |
| Privacy and offline use | 4 | Clear heading |
| See the in-product Privacy page to learn how to delete local data and how licence checks work. | 17 | Concrete privacy instruction |
| The app, sample, and encrypted export work offline after the first visit. | 12 | `offline-reload` |
| If your browser offers Install, use it to open the tool in its own window. | 15 | `standalone-install` |
| Free export and existing licences | 5 | Clear heading |
| Import records, maintain the checklist, attach source files, and export an encrypted evidence pack without a licence. | 17 | `free-evidence-pack` |
| Existing licence holders can paste a token to restore saved cover notes. | 12 | `paid-license` |
| New licences are not currently available. | 6 | `checkout-unavailable` |
| Licence verification sends its token to the Sociobot billing API. | 10 | `paid-license` |
| Develop | 1 | Developer heading |
| Requires Node.js 20.19+ or 22.12+. | 5 | `node-runtime` |
| `npm install` | 2 | Command |
| `npm run dev` | 3 | Command |
| Open `http://localhost:5173`. | 2 | Clear instruction |
| Test and build | 3 | Developer heading |
| `npm test` | 2 | Command |
| `npm run build` | 3 | Command |
| `npm test` runs unit and Playwright browser checks, including the tagged claims in `.factory/claims.json`. | 14 | Verified developer instruction |
| The exact production build command is `npm run build`. | 9 | Verified developer instruction |
| Static output lands in `dist/`, with `dist/index.html` at its root. | 10 | Verified build result |
| To run one claim: | 4 | Clear instruction |
| `npm run test:e2e -- --grep @claim:offline-reload` | 6 | Command |
| Deploy | 1 | Developer heading |
| Deploy the contents of `dist/` to Azure Static Web Apps. | 10 | Deployment instruction |
| `public/staticwebapp.config.json` supplies the explicit product routes, designed 404 response, security headers, and asset policy. | 14 | Verified deployment description |
| Data format | 2 | Clear heading |
| CSV headers are `date,description,amount,category,reference`. | 4 | `csv-import` specification |
| Dates use `YYYY-MM-DD`. | 3 | `csv-import` specification |
| Income is positive and expenses are negative. | 7 | `csv-import` specification |
| The `reference` column is optional. | 5 | `csv-import` specification |
| The importer rejects invalid calendar dates, missing amounts, and records outside the selected period. | 14 | `csv-import`, `period-integrity` |
| Valid imports add records without replacing earlier records. | 8 | `csv-import` |
| Source code licence | 3 | Clear heading |
| MIT. | 1 | Source-code licence statement |
| See LICENSE. | 2 | Clear reference |

The public terms are consistent: **evidence pack**, **record**, **source file**,
**period**, **checklist item**, **demo**, **licence**, and **share** each name one
concept. Landing actions **Try it with sample data** and **Verify licence** name
their results. Navigation labels are clear nouns.

## Demo and sandbox behaviour

- The first landing action opens `/?demo=1` in one click.
- The first 390 px demo screen already shows the persistent sandbox banner,
  Rowan Field Studio’s Quarter 1 for 2026–27, and the current 86% readiness
  result. The populated workspace contains 12 records, three source files, and
  one named open check.
- The banner says **“Demo — sample data, nothing is saved”** and exposes
  **Reset demo** and **Start for real**. It remains sticky lower in the task.
- Changing a completed sample check and selecting **Reset demo** restores the
  original sample. Reload does the same.
- The isolation test preloads a private real record and real licence keys, then
  cold-opens both demo URL forms with licence query values. Neither URL reads,
  changes, or verifies the real licence. No billing request occurs. **Start for
  real** then loads the untouched real record and only then performs the
  expected licence check.
- Request logging for the demo and normal unlicensed flow contains only the
  product origin. The offline test reloads the cached demo and downloads a
  complete encrypted sample pack with the browser offline.

The demo requirement and storage isolation pass.

## Claims verification

I cloned the reviewed commit without hard links to
`/tmp/mtd-review6.9drmzV/repo`, ran `npm ci`, and ran every exact `test` command
from `.factory/claims.json` independently. All 17 passed.

| Claim id | Result | Observed evidence |
|---|---|---|
| `demo-sandbox` | PASS | Both demo URLs ignored real records and licence keys; reload/reset restored the sample |
| `sample-content` | PASS | 12 records, three source files, and one named open check appeared |
| `csv-import` | PASS | Invalid dates and blank amounts were rejected; valid imports accumulated |
| `period-integrity` | PASS | Boundary dates imported; a mixed outside-period file added no rows |
| `source-file-size` | PASS | 10 MB attached; 10 MB plus one byte was rejected without replacement |
| `encrypted-pack` | PASS | Password protection, required files, and all SHA-256 file-change checks verified |
| `free-evidence-pack` | PASS | Import, custom check, attachment, and encrypted export worked without a licence |
| `local-only` | PASS | A real record persisted in IndexedDB and the flow made no cross-origin request |
| `offline-reload` | PASS | The cached demo reloaded offline and exported its encrypted pack |
| `custom-checklist` | PASS | An unlicensed custom check survived reload |
| `readiness` | PASS | The named gap appeared and completion changed the workspace to ready |
| `standalone-install` | PASS | Manifest mode, start URL, and 192/512 icons matched |
| `paid-license` | PASS | A recorded valid billing response enabled saved cover notes and matched the exact request |
| `checkout-unavailable` | PASS | Public routes showed no price, checkout URL, or purchase action |
| `no-tax-submission` | PASS | Demo export and real workspace exposed no submission control or HMRC request |
| `artwork-provenance` | PASS | Landing and 404 footers displayed the declared provenance statement |
| `node-runtime` | PASS | A clean install and build completed under Node.js 20.19.0 |

The live landing page and README were then reread against this table. Every
product capability, privacy, offline, price, availability, provenance, and
compatibility statement maps to a listed claim and observable test. There is
no unlisted or untested claim.

## Earlier findings retested

I read every earlier `review-*.md`, `polish-*.md`, and the prior handoff. Each
finding was checked in the current source and on production, not accepted from
its repair report.

| Earlier id | Current live and code result |
|---|---|
| `F-1-1` | FIXED — plain unavailable-licence copy and `checkout-unavailable` remain |
| `F-1-2` | FIXED — the unsupported versioned-checklist promise remains absent |
| `F-1-3` | FIXED — the 404 retains route metadata, shared navigation, and legal links |
| `F-1-4` | FIXED — **Readiness preview** remains |
| `F-1-5` | FIXED — **The product itself** remains absent |
| `F-1-6` | FIXED — the no-submission section is explicit and plainly headed |
| `F-1-7` | FIXED — the selected-quarter source-file caption remains concrete |
| `F-1-8` | FIXED — the README introduction remains split below 22 words |
| `F-2-1` | FIXED — demo and real-workspace save wording remain mode-specific |
| `F-2-2` | FIXED — the exported artifact remains **evidence pack** throughout |
| `F-2-3` | FIXED — **Supported edition** remains absent |
| `F-2-4` | FIXED — **app shell** remains absent from user-facing README copy |
| `F-2-5` | FIXED — the public footer gives a direct, declared provenance statement |
| `F-3-1` | FIXED — `no-tax-submission` remains declared and passes |
| `F-3-2` | FIXED — the complete free workflow remains declared and passes |
| `F-3-3` | FIXED — the billing destination remains declared and the exact request passes |
| `F-3-4` | FIXED — artwork provenance remains declared and tagged |
| `F-3-5` | FIXED — sample contents remain concrete and tested |
| `F-3-6` | FIXED — **core pack** remains absent from public copy |
| `F-3-7` | FIXED — the README Privacy link reaches the live product page |
| `F-4-1` | FIXED — both demo URLs ignore real workspace and licence state until explicit exit |
| `F-4-2` | FIXED — Back and Forward restore each saved scroll position and focus the h1 |
| `F-4-3` | FIXED — the first-screen fact explicitly says **offline** |
| `F-4-4` | FIXED — user copy says **file-change checks**; SHA-256 is explanatory |
| `F-4-5` | FIXED — the README plainly names deletion and licence-check information |
| `F-4-6` | FIXED — installation guidance names the browser’s Install action and result |
| `F-4-7` | FIXED — the 404 label is **Page not found** |
| `F-4-8` | FIXED — the 404 h1 directly states that the page could not be found |
| `F-4-9` | FIXED — the 404 reuses the wordmark/header and reports network status |
| `F-4-10` | FIXED — the 404 includes the apple-touch icon and manifest |
| `F-5-1` | FIXED — the licence nudge is a `div`; Axe reports zero route violations |
| `F-5-2` | FIXED — README, `engines`, claim, and Node 20.19.0 build test agree |
| `F-5-3` | FIXED — the final README heading is **Source code licence** |

No earlier ID is reopened.

## Structure, accessibility, links, and identity

- `/`, `/demo`, `/workspace`, `/privacy`, and `/terms` return 200. A tested
  unknown route returns the designed page with HTTP 404.
- Every route has one h1 and one main, `lang="en-GB"`, its own plain title,
  description, canonical, Open Graph and Twitter metadata, local favicon,
  apple-touch icon, and manifest. The landing title is **“MTD Evidence Pack —
  prepare quarterly records.”**
- Direct routes and reloads work. Client navigation and browser Back/Forward
  restore the route, per-entry scroll position, focused h1, and polite route
  announcement.
- A crawl of every rendered link on all product routes and the 404 found 200
  responses for every navigational target. The Privacy mail link is explicit;
  the 404 skip fragment correctly stays on the expected 404 response.
- `robots.txt`, `sitemap.xml`, manifest, social image, favicon, and icons are
  present. Security headers include CSP with `frame-ancestors` in the response,
  `X-Content-Type-Options`, and `Referrer-Policy`.
- The full live Playwright Axe pass reports zero violations of any severity on
  every route and the 404. Keyboard skip, Space operation, visible file-control
  focus, 390 px reflow, 200% text, 44 px targets, reduced motion, image
  alternatives, and console checks pass.
- The clean build creates `dist/`. Initial entry JavaScript is 2.01 kB gzip;
  the lazy ZIP chunk is 54.45 kB gzip. The measured live mobile result was
  576 ms LCP, 24 ms interaction, 2,268 B JavaScript, and 5,421 B CSS.
- The warm paper palette, asymmetric editorial layout, cut-paper ledger scene,
  clipped sheets, serif display type, and restrained paper-rise motion are
  recognisably specific to this bookkeeping product. It is not a generic SaaS
  template.

## Missed leverage

No additional AI, sync, import, or export feature is plainly implied by the
brief. Categorised CSV import, source-file attachment, a user-maintained period
checklist, readiness reporting, and encrypted ZIP/CSV/PDF export are present.
Sending private bookkeeping records to an AI gateway would add disclosure,
cost, and network handling without closing a missing job. Sync would conflict
with the deliberately local-first scope unless accounts and consent were added.

## Verification summary

- Every one of 17 exact claim commands: **passed independently**.
- `npm test`: **9 unit and 39 browser tests passed**.
- `npm run build`: **passed** and produced `dist/`.
- `PLAYWRIGHT_BASE_URL=https://mtd-evidence-pack.sociobot.in npm run test:e2e`:
  **39 live browser tests passed**.
- `npm run verify:url -- https://mtd-evidence-pack.sociobot.in`: **passed**.

## What would make this perfect

Nothing is left to change within the brief and review checklist. Preserve the
declared claim suite, isolated demo, route crawl, zero-violation accessibility
gate, and cumulative earlier-finding checks on future releases.
