# Adversarial first-read review 5 — FAIL

**Date:** 29 August 2026

**URL:** <https://mtd-evidence-pack.sociobot.in>

**Commit reviewed:** `de239265c9b3f1f179026b81b327a3bf3e2128ce`

## Verdict

**FAIL.** The first screen, demo, sandbox, routes, and all 16 declared claims
pass. Three minor findings remain: one moderate semantic-landmark violation,
one inaccurate and undeclared Node.js support claim, and one ambiguous README
heading. The required zero-finding standard is not met.

No blocking finding was observed.

## Cold first read

I opened production in separate fresh Chromium contexts at 390 × 844 and
1440 × 900. Before scrolling, I understood:

- **What it does:** prepares one quarter of bookkeeping records as an evidence
  pack.
- **Who it is for:** UK sole traders who keep their own books and need to give
  records to an accountant or compatible filing product.
- **What to click first:** **Try it with sample data**. The adjacent result says
  it loads 12 records, three source files, and one open check, and saves
  nothing.

All three answers are visible at both sizes. The 390 px action begins at
`y=548` and is fully visible. Both cold loads made only same-origin requests,
had no console or page error, and had no horizontal overflow.

## Findings, ordered by severity

### F-5-1 — Minor: the real workspace contains a nested complementary landmark

**Exact location:** live `/workspace`, `<aside class="support-nudge">` inside
`<main>`. Axe reports `landmark-complementary-is-top-level` with moderate
impact: “Aside should not be contained in another landmark.” The demo does not
show the issue because the licence nudge is absent there.

**Why this fails:** the licence prompt is supporting content within the main
task, not a page-level complementary landmark. Exposing it as an `aside`
creates a misleading landmark for screen-reader navigation. The current Axe
test filters out moderate findings, so its green result hides this defect.

**Concrete fix:** change this wrapper to a non-landmark element such as
`<div class="support-nudge">` or give it another appropriate non-landmark
semantic. Change the route accessibility assertion to require zero Axe
violations, not only zero serious or critical violations.

### F-5-2 — Minor: the README overstates and does not declare Node.js support

**Exact quote/location:** README, Develop: **“Requires Node.js 20 or newer.”**

**Why this fails:** the pinned Vite 7.3.6 dependency declares
`^20.19.0 || >=22.12.0`. The README therefore includes unsupported releases
such as Node 20.0.0. This is also a claim-like compatibility sentence with no
entry in `.factory/claims.json`.

**Concrete fix:** write **“Requires Node.js 20.19+ or 22.12+.”**, declare the
same range in `package.json#engines`, and add a `node-runtime` claim whose test
runs a clean install and build at the lowest supported Node version.

### F-5-3 — Minor: “Licence” names two different things in the README

**Exact quotes/locations:** README heading **“Free export and existing
licences”** refers to the paid cover-note entitlement; the final heading
**“Licence”** refers to the repository’s MIT source-code licence.

**Why this fails:** the same unqualified term names two different concepts.
A heading read out of context does not tell a reader whether it concerns a
product token or permission to reuse the source.

**Concrete fix:** rename the final heading **“Source code licence”** and keep
“existing licence” for the product entitlement.

## Copy audit

Counts use rendered, space-separated words. Hyphenated terms, URLs, file
paths, and versions count as one word. Headings, actions, labels, statuses,
list entries, and meaningful alternative text are included. No item exceeds
22 words and no banned marketing word appears.

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
| Loads 12 records, 3 source files, and one open check. | 10 | `sample-content` |
| Nothing is saved. | 3 | `demo-sandbox` |
| Works offline after your first visit | 6 | `offline-reload` |
| Records stay on this device | 5 | `local-only` |
| Evidence pack export is free | 5 | `free-evidence-pack` |
| Q1—Q4 | 1 | Artwork label |
| Four paper filing houses connected by a coral path under a paper moon. | 13 | Useful image alternative |
| Keep source files with the records for one selected quarter. | 10 | `encrypted-pack` |
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
| 01 / 02 / 03 | 1 each | Structural step markers |
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
| Terms | 1 | Clear footer link |
| Built by Param Factory (external site) | 6 | Clear external link |
| v1.0.11 | 1 | Build identifier |

### README

| Exact copy | Words | Result |
|---|---:|---|
| MTD Evidence Pack | 3 | Product name |
| Prepare a quarterly MTD evidence pack from local bookkeeping records. | 10 | Plain summary |
| MTD Evidence Pack is for UK sole traders who keep their own books. | 13 | Audience |
| Import a categorised CSV and attach source files. | 8 | `csv-import`, `encrypted-pack` |
| Check one quarter before exporting an encrypted evidence pack for your accountant or compatible filing software. | 16 | `readiness`, `encrypted-pack` |
| Use compatible filing software or an accountant when you are ready to submit. | 13 | Concrete next step |
| Try the sample | 3 | Clear heading |
| Open `/?demo=1` locally or visit <https://mtd-evidence-pack.sociobot.in/?demo=1>. | 6 | Clear instruction |
| The sample contains 12 categorised records, three source files, and one open checklist item for one quarter. | 17 | `sample-content` |
| Demo changes are kept in memory and disappear on reload. | 10 | `demo-sandbox` |
| `/demo` also opens the sample. | 5 | Clear route instruction |
| What the export contains | 4 | Clear heading |
| The password-protected ZIP contains: | 4 | `encrypted-pack` |
| `records/transactions.csv` | 1 | Export entry |
| `summary/evidence-pack-summary.pdf` | 1 | Export entry |
| attached source files | 3 | Export entry |
| `manifest.json`, with checklist status and file-change checks (SHA-256) | 8 | `encrypted-pack` |
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
| Develop | 1 | Clear developer heading |
| Requires Node.js 20 or newer. | 5 | F-5-2 |
| `npm install` | 2 | Command |
| `npm run dev` | 3 | Command |
| Open `http://localhost:5173`. | 2 | Clear instruction |
| Test and build | 3 | Clear developer heading |
| `npm test` | 2 | Command |
| `npm run build` | 3 | Command |
| `npm test` runs unit and Playwright browser checks, including the tagged claims in `.factory/claims.json`. | 14 | Verified developer instruction |
| The exact production build command is `npm run build`. | 9 | Verified developer instruction |
| Static output lands in `dist/`, with `dist/index.html` at its root. | 10 | Verified build result |
| To run one claim: | 4 | Clear instruction |
| `npm run test:e2e -- --grep @claim:offline-reload` | 6 | Command |
| Deploy | 1 | Clear developer heading |
| Deploy the contents of `dist/` to Azure Static Web Apps. | 10 | Deployment instruction |
| `public/staticwebapp.config.json` supplies the explicit product routes, designed 404 response, security headers, and asset policy. | 14 | Verified deployment description |
| Data format | 2 | Clear heading |
| CSV headers are `date,description,amount,category,reference`. | 4 | `csv-import` specification |
| Dates use `YYYY-MM-DD`. | 3 | `csv-import` specification |
| Income is positive and expenses are negative. | 7 | `csv-import` specification |
| The `reference` column is optional. | 5 | `csv-import`, `period-integrity` |
| The importer rejects invalid calendar dates, missing amounts, and records outside the selected period. | 14 | `csv-import`, `period-integrity` |
| Valid imports add records without replacing earlier records. | 8 | `csv-import` |
| Licence | 1 | F-5-3 |
| MIT. | 1 | Source-code licence statement |
| See LICENSE. | 2 | Clear reference |

### Terminology

| Concept | Term used | Result |
|---|---|---|
| Exported collection | evidence pack | Consistent |
| Imported bookkeeping line | record | Consistent |
| Supporting attachment | source file | Consistent |
| Time window | period | Consistent |
| Completion control | checklist item | Consistent |
| Sample environment | demo | Consistent |
| Paid entitlement | existing licence | F-5-3 at the final README heading |
| Repository permission | source code licence | F-5-3; heading currently says only “Licence” |

The landing actions are result-naming verbs. README development terms such as
Playwright and Azure Static Web Apps occur only in developer instructions.
F-5-3 is the sole terminology collision. F-5-2 is the sole unlisted public
compatibility claim; every product capability, privacy, price, availability,
and provenance statement maps to a declared claim below.

## Demo and sandbox behaviour

- The first landing action opens `/?demo=1` in one click.
- The first 390 px demo screen already shows the demo banner, Rowan Field
  Studio’s Quarter 1 for 2026–27, 86% readiness, 12 records, three source
  files, and one open check.
- **Reset demo** restored a changed checklist item. Reload also restored the
  sample.
- The banner remains available with **Reset demo** and **Start for real**.
- A fresh demo flow left localStorage empty and opened no IndexedDB database.
  Its request log contained only
  `https://mtd-evidence-pack.sociobot.in`.
- The stronger declared test preloaded a real record and real licence keys,
  cold-opened both demo URL forms with licence query values, and confirmed no
  real key changed and no billing request occurred. **Start for real** then
  loaded the untouched real record and made the expected licence check.
- The offline claim reloaded the cached demo without a network and downloaded
  the complete encrypted evidence pack.

The demo requirement passes and is not blocking.

## Claims verification

I cloned the reviewed commit to `/tmp/mtd-review5.r31qhn`, ran `npm ci`, and
ran every `test` command in `.factory/claims.json` independently.

| Claim id | Result | Observed evidence |
|---|---|---|
| `demo-sandbox` | PASS | Real workspace/licence state stayed untouched; reset restored the sample; no demo billing request |
| `sample-content` | PASS | 12 records, three files, and one named open item |
| `csv-import` | PASS | Invalid dates and blank amounts rejected; valid imports accumulated |
| `period-integrity` | PASS | Boundary dates accepted; mixed outside-period file added no rows |
| `source-file-size` | PASS | 10 MiB accepted; 10 MiB plus one byte rejected without replacement |
| `encrypted-pack` | PASS | Password protection, required entries, and every SHA-256 value verified |
| `free-evidence-pack` | PASS | Import, custom check, attachment, and encrypted export completed without a licence |
| `local-only` | PASS | Real record persisted in IndexedDB; request log stayed same-origin |
| `offline-reload` | PASS | Cached demo reloaded offline and exported the encrypted pack |
| `custom-checklist` | PASS | Unlicensed custom check survived reload |
| `readiness` | PASS | Named gap appeared and completion produced the ready state |
| `standalone-install` | PASS | Manifest mode, start URL, and 192/512 icons matched |
| `paid-license` | PASS | Recorded valid API response enabled saved cover notes and matched the billing request |
| `checkout-unavailable` | PASS | Public routes had no price, checkout URL, or purchase action |
| `no-tax-submission` | PASS | Demo export and real workspace exposed no submission control or HMRC request |
| `artwork-provenance` | PASS | Landing and 404 displayed the declared provenance sentence |

No listed claim failed or remained untested. F-5-2 records the one unlisted
claim-like README sentence.

The same clean clone passed `npm test` with 9 unit tests and 38 browser tests,
`npm run build`, `npm run lint`, and `npm audit --omit=dev`. The build produced
`dist/index.html`; its initial entry JavaScript is 2.01 kB gzip. The complete
38-test browser suite passed against production. The live URL verifier also
passed. The local and live asset manifests are identical.

## Earlier findings retested

I read every `review-*.md`, `polish-*.md`, and the prior handoff. Each prior
finding was checked against both current source and production.

| Earlier id | Current result |
|---|---|
| `F-1-1` | FIXED — plain unavailable-licence copy and `checkout-unavailable` remain |
| `F-1-2` | FIXED — the unsupported versioned-checklist promise is absent |
| `F-1-3` | FIXED — the 404 retains metadata, shared navigation, and legal links |
| `F-1-4` | FIXED — “Readiness preview” remains |
| `F-1-5` | FIXED — “The product itself” remains absent |
| `F-1-6` | FIXED — the no-submission section is explicit |
| `F-1-7` | FIXED — the selected-quarter source-file caption remains concrete |
| `F-1-8` | FIXED — the README introduction remains split below 22 words |
| `F-2-1` | FIXED — demo and real-workspace save wording remain mode-specific |
| `F-2-2` | FIXED — the exported artifact remains “evidence pack” |
| `F-2-3` | FIXED — “Supported edition” remains absent |
| `F-2-4` | FIXED — “app shell” remains absent from the README |
| `F-2-5` | FIXED — the old unavailable disclosure wording remains absent |
| `F-3-1` | FIXED — `no-tax-submission` remains declared and passes |
| `F-3-2` | FIXED — the full free workflow remains declared and passes |
| `F-3-3` | FIXED — the billing destination remains declared and its request passes |
| `F-3-4` | FIXED — artwork provenance remains declared and tagged |
| `F-3-5` | FIXED — sample contents remain concrete and tested |
| `F-3-6` | FIXED — “core pack” remains absent from public copy |
| `F-3-7` | FIXED — the README Privacy link reaches the live product page |
| `F-4-1` | FIXED — both demo URLs ignore real workspace/licence state until exit |
| `F-4-2` | FIXED — Back and Forward restore saved scroll and focused h1 |
| `F-4-3` | FIXED — the first-screen fact explicitly says “offline” |
| `F-4-4` | FIXED — user copy says “file-change checks”; SHA-256 appears as explanation |
| `F-4-5` | FIXED — the README names deletion and licence-check information plainly |
| `F-4-6` | FIXED — installation guidance names the browser’s Install action and result |
| `F-4-7` | FIXED — the 404 label is “Page not found” |
| `F-4-8` | FIXED — the 404 h1 states the error directly |
| `F-4-9` | FIXED — the 404 reuses the wordmark/header and reports network status |
| `F-4-10` | FIXED — the 404 includes the apple-touch icon and manifest |

No earlier review ID is reopened. F-5-1 independently confirms the moderate
Axe advisory disclosed in the prior handoff; it did not have an earlier
review ID.

## Structure, accessibility, links, and identity

- `/`, `/demo`, `/workspace`, `/privacy`, and `/terms` return 200. An unknown
  route returns the designed page with HTTP 404.
- Each route has one h1 and main, `lang="en-GB"`, a route-specific title,
  description, canonical, OG/Twitter metadata, local favicon, apple-touch
  icon, and manifest. Titles follow the required pattern.
- Direct routes and reloads work. Client navigation and browser Back/Forward
  restore the correct route, scroll position, focused h1, and live
  announcement.
- The union of links on all routes has no dead target. Product routes and the
  Param Factory destination return 200; skip fragments and the mail link are
  valid explicit exceptions.
- Security headers include CSP with `frame-ancestors` as a response header,
  `X-Content-Type-Options`, and `Referrer-Policy`. No CSP or console error was
  observed.
- Keyboard operation, visible focus, 390 px reflow, 200% text, touch targets,
  reduced motion, image alternatives, and same-origin privacy checks pass.
  Axe reports only F-5-1.
- The warm paper palette, asymmetric editorial layout, cut-paper ledger scene,
  clipped sheets, serif headings, and paper-rise motion are specific to this
  product. It is not a generic SaaS template.

## Missed leverage

No additional AI, sync, import, or export feature is clearly implied. The
brief requires categorised CSV import, source-file attachment, a period
readiness check, and a ZIP containing CSV, PDF, source files, and a manifest;
all are present. Sending private bookkeeping records to an AI gateway would
add disclosure, cost, and network handling without an obvious missing job.
Sync would conflict with the stated local-first scope unless accounts and an
explicit consent model were introduced.

## What would make this perfect

Resolve F-5-1 through F-5-3: remove the nested complementary landmark and make
the Axe gate reject moderate violations, state and enforce the exact Node.js
engine range with a declared test, and rename the MIT section “Source code
licence.” Then rerun every declared claim and this complete first-read review.
A PASS requires zero findings.
