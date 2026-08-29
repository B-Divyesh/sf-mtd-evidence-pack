# Adversarial first-read review 3 — FAIL

**Date:** 29 August 2026  
**URL:** <https://mtd-evidence-pack.sociobot.in>  
**Commit reviewed:** `4479080b405d76a64ceb50175afc42e73d56d008`

## Verdict

**FAIL.** The cold first screen, populated one-click demo, sandbox, all 13
declared claims, routing, accessibility, offline flow, and local quality gates
pass. Seven minor findings remain. Five are copy or claims-contract gaps, one
is inconsistent artifact terminology, and one README link points to the wrong
site. The required zero-finding standard is not met.

There are no blocking findings in this round.

## Findings, ordered by severity

### F-3-1 — Minor: the no-submission boundary is an unlisted claim

**Exact quote/location:** landing, “It does not submit tax returns.”

**Why this fails:** this is an important scope and privacy statement that a
sole trader can rely on, but `.factory/claims.json` has no matching claim or
tagged test. The current suite proves export behavior, not the absence of tax
submission controls or submission requests.

**Concrete fix:** add a `no-tax-submission` claim with this sentence and a
tagged test that completes the real and demo workflows, confirms there is no
submission action, and records that no request is made to an HMRC submission
endpoint.

### F-3-2 — Minor: the public free-feature claim is broader than its declared test

**Exact quotes/locations:** landing, “Import records, maintain your checklist,
and export the encrypted evidence pack without paying.” README, “The core
import, checklist maintenance, attachments, and encrypted export are free.”

**Why this fails:** `free-core-export` only declares “Core pack export is free”
and tests an export without a licence. The public copy additionally promises
free import, checklist maintenance, and attachments. Other tests exercise
parts of that behavior, but no claim entry declares and tests the complete
price boundary in a fresh, unlicensed real workspace.

**Concrete fix:** change the claim to “Import records, maintain the checklist,
attach files, and export an encrypted evidence pack without a licence.” Add one
tagged test that performs all four actions in a fresh real workspace with no
licence token. Alternatively, narrow both public sentences to “Encrypted
evidence pack export is free.”

### F-3-3 — Minor: the licence API destination is an unlisted claim

**Exact quote/location:** README, “Licence verification uses the Sociobot
billing API.”

**Why this fails:** the statement tells a user where a licence token goes, but
the `paid-license` claim only promises that a verified licence enables saved
cover notes. Its `where` field also omits the README. The test happens to mock
the Sociobot endpoint, but the public destination statement is not declared.

**Concrete fix:** extend `paid-license` to state that verification sends the
token to the Sociobot billing API, include the README in `where`, and assert the
request origin and body in its tagged test.

### F-3-4 — Minor: the artwork provenance statement is tested but undeclared

**Exact quote/location:** landing and 404 footer, “Hero artwork was generated
for this product.”

**Why this fails:** this factual public statement has an untagged browser test,
`public footers disclose that the hero artwork was generated`, but no entry in
`.factory/claims.json`. The claims contract requires public claim-like
statements to be listed and tagged, not merely covered by an unrelated test.

**Concrete fix:** add an `artwork-provenance` claim and tag the existing footer
test `@claim:artwork-provenance`. Keep `.factory/design.md` as the provenance
record.

### F-3-5 — Minor: the sample description is subjective and undeclared

**Exact quotes/locations:** README, “The sample contains one realistic
quarter.” Landing, “Loads one sample quarter.”

**Why this fails:** “realistic” is subjective and does not tell the visitor
what is actually available. No claim entry defines the promised sample
contents, even though the populated demo is a central try-first feature.

**Concrete fix:** use “The sample contains 12 categorised records, three source
files, and one open checklist item for one quarter.” Add a `sample-content`
claim whose test asserts those values on `/demo`.

### F-3-6 — Minor: “core pack” gives the evidence pack a second name

**Exact quotes/locations:** landing first-screen fact, “Core pack export is
free”; landing heading, “Keep the core pack free.” Elsewhere the exported
artifact is consistently “evidence pack.”

**Why this fails:** “core pack” can sound like a separate reduced artifact.
“Keep the core pack free” also reads as an instruction to the visitor rather
than a price statement. The plain-words rule requires one term for one thing.

**Concrete fix:** use “Evidence pack export is free” for the fact and “Free
evidence pack export” for the heading. Rename the README section “Free export
and existing licences” and remove “core” where it describes the same pack.

### F-3-7 — Minor: the README Privacy link points to GitHub, not the product

**Exact quote/location:** README, “See the in-product
`[Privacy](/privacy)` page for browser-data controls and licence checks.”

**Why this fails:** on GitHub, the root-relative `/privacy` target resolves on
`github.com`, not `mtd-evidence-pack.sociobot.in`. A reader asking how records
are handled is sent to the wrong privacy page.

**Concrete fix:** link to
`https://mtd-evidence-pack.sociobot.in/privacy` explicitly.

## Cold first read

I opened production in fresh Chromium contexts at 390 × 844 and 1440 × 900,
without scrolling. In my own words:

- **What it does:** prepares one quarter of local bookkeeping records as an
  evidence pack.
- **Who it is for:** UK sole traders who need to give records to an accountant
  or compatible filing software.
- **What to click first:** **Try it with sample data**; the adjacent result says
  “Loads one sample quarter. Nothing is saved.”

All three answers are visible on both first screens. The headline is five
words, the audience sentence is 19 words, and the primary action is visible
beside its result. The three facts state offline behavior, storage location,
and price. Both cold loads made only same-origin requests, produced no console
or page error, and had no horizontal overflow.

## Copy audit

Counts treat hyphenated terms, file paths, commands, and URLs as one word.
Headings, labels, actions, status text, and meaningful image alternatives are
included so every visible landing/README item is accounted for. No item is
over 22 words and no banned marketing word appears. The finding column records
the remaining jargon, inconsistency, subjective wording, and claim gaps.

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
| For UK sole traders who keep local books and need a clear pack for an accountant or filing software. | 19 | Clear audience and outcome |
| Try it with sample data | 5 | Result-naming action |
| Loads one sample quarter. | 4 | F-3-5 |
| Nothing is saved. | 3 | `demo-sandbox` |
| Works after your first visit | 5 | `offline-reload` |
| Records stay on this device | 5 | `local-only` |
| Core pack export is free | 5 | F-3-6; `free-core-export` |
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
| Invoices and receipts can be matched to records | 8 | Sample checklist item |
| How it works | 3 | Clear section label |
| Build the pack in three passes | 6 | Clear process heading |
| Set the period | 3 | Clear step heading |
| Name the quarter and check its start and end dates. | 10 | Concrete instruction |
| Import and match | 3 | Clear step heading |
| Add a categorised CSV. | 4 | `csv-import` |
| Attach statements, invoices, receipts, or an index. | 7 | `source-file-size`, `encrypted-pack` |
| Check and export | 3 | Clear step heading |
| Close each checklist item. | 4 | `readiness` |
| Download one password-protected ZIP with CSV, PDF, files, and hashes. | 10 | `encrypted-pack` |
| What this tool does not do | 6 | Clear limitation label |
| Prepare records before submission | 4 | Clear limitation heading |
| It does not submit tax returns. | 6 | F-3-1 |
| Use compatible filing software or an accountant when you are ready to submit. | 13 | Concrete next step |
| Free core and existing licences | 5 | Clear section label; see F-3-6 |
| Keep the core pack free | 5 | F-3-6 |
| Import records, maintain your checklist, and export the encrypted evidence pack without paying. | 13 | F-3-2 |
| Restore a licence | 3 | Clear section heading |
| Existing licence holders can restore saved cover notes. | 8 | `paid-license` |
| New licences are not currently available. | 6 | `checkout-unavailable` |
| Paste your licence | 3 | Bound field label |
| Verify licence | 2 | Result-naming action |
| Prepare a quarterly evidence pack on your device. | 8 | Clear footer summary |
| Hero artwork was generated for this product. | 7 | F-3-4 |
| Privacy | 1 | Clear footer link |
| Terms | 1 | Clear footer link |
| Built by Param Factory (external site) | 6 | Clear external link |
| v1.0.9 | 1 | Build identifier |

### README

| Exact copy | Words | Result |
|---|---:|---|
| MTD Evidence Pack | 3 | Product name |
| Prepare a quarterly MTD evidence pack from local bookkeeping records. | 10 | Clear summary |
| MTD Evidence Pack is for UK sole traders who keep their own books. | 13 | Clear audience |
| Import a categorised CSV and attach source files. | 8 | `csv-import`, `encrypted-pack` |
| Check one quarter before exporting an encrypted evidence pack for your accountant or compatible filing software. | 15 | `encrypted-pack`, `readiness` |
| Use compatible filing software or an accountant when you are ready to submit. | 13 | Clear next step |
| Try the sample | 3 | Clear section heading |
| Open `/?demo=1` locally or visit `https://mtd-evidence-pack.sociobot.in/?demo=1`. | 6 | Clear instruction |
| The sample contains one realistic quarter. | 6 | F-3-5 |
| Demo changes are kept in memory and disappear on reload. | 10 | `demo-sandbox` |
| `/demo` also opens the sample. | 5 | Clear route instruction |
| What the export contains | 4 | Clear section heading |
| The password-protected ZIP contains: | 4 | `encrypted-pack` |
| `records/transactions.csv` | 1 | Export-list entry |
| `summary/evidence-pack-summary.pdf` | 1 | Export-list entry |
| attached source files | 3 | Export-list entry |
| `manifest.json` with SHA-256 hashes and checklist status | 7 | Export-list entry |
| `README.txt` | 1 | Export-list entry |
| Send the ZIP password through a different channel. | 8 | Concrete security instruction |
| The password is never saved. | 5 | `encrypted-pack` |
| Privacy and offline use | 4 | Clear section heading |
| See the in-product Privacy page for browser-data controls and licence checks. | 11 | F-3-7 |
| The app, sample, and encrypted export work after the first visit. | 11 | `offline-reload` |
| Install it from a supporting browser for a standalone window. | 10 | `standalone-install` |
| Free core and existing licences | 5 | See F-3-6 |
| The core import, checklist maintenance, attachments, and encrypted export are free. | 11 | F-3-2, F-3-6 |
| Existing licence holders can paste a token to restore saved cover notes. | 12 | `paid-license` |
| New licences are not currently available. | 6 | `checkout-unavailable` |
| Licence verification uses the Sociobot billing API. | 7 | F-3-3 |
| Develop | 1 | Clear developer heading |
| Requires Node.js 20 or newer. | 5 | Development prerequisite |
| `npm install` | 2 | Command |
| `npm run dev` | 3 | Command |
| Open `http://localhost:5173`. | 2 | Clear instruction |
| Test and build | 3 | Clear developer heading |
| `npm test` | 2 | Command |
| `npm run build` | 3 | Command |
| `npm test` runs unit and Playwright browser checks, including the tagged claims in `.factory/claims.json`. | 14 | Accurate test description |
| The exact production build command is `npm run build`. | 9 | Build instruction |
| Static output lands in `dist/`, with `dist/index.html` at its root. | 10 | Build result |
| To run one claim: | 4 | Clear instruction |
| `npm run test:e2e -- --grep @claim:offline-reload` | 5 | Command |
| Deploy | 1 | Clear developer heading |
| Deploy the contents of `dist/` to Azure Static Web Apps. | 10 | Deployment instruction |
| `public/staticwebapp.config.json` supplies the explicit product routes, designed 404 response, security headers, and asset policy. | 14 | Deployment description |
| Data format | 2 | Clear section heading |
| CSV headers are `date,description,amount,category,reference`. | 4 | `csv-import` specification |
| Dates use `YYYY-MM-DD`. | 3 | `csv-import` specification |
| Income is positive and expenses are negative. | 7 | `csv-import` specification |
| The `reference` column is optional. | 5 | `csv-import` specification |
| The importer rejects invalid calendar dates, missing amounts, and records outside the selected period. | 14 | `csv-import`, `period-integrity` |
| Valid imports add records without replacing earlier records. | 8 | `csv-import` |
| Licence | 1 | Clear section heading |
| MIT. | 1 | Licence statement |
| See LICENSE. | 2 | Clear reference |

### Terminology and actions

The product consistently uses **record**, **source file**, **period**,
**checklist item**, **demo**, and **licence**. F-3-6 records the remaining
**core pack** / **evidence pack** collision. Landing actions pass the
result-naming check: **Try it with sample data** and **Verify licence** state
their result. Navigation links are clear nouns.

## Demo and sandbox behavior

- The first landing action opens `/?demo=1` in one click.
- The first 390 px demo screen immediately shows the sandbox banner, Rowan
  Field Studio’s Quarter 1 for 2026–27, and an 86% readiness state. The full
  sample contains 12 records, three source files, and one open item.
- The persistent banner says **Demo — sample data, nothing is saved** and
  exposes **Reset demo** and **Start for real**.
- I changed a completed sample check and selected **Reset demo**; the original
  checked state returned.
- In the same fresh context, I first imported an **Existing real record**, then
  entered and reset the demo, selected **Start for real**, and confirmed that
  the real record remained unchanged.
- The complete request log for that real → demo → reset → real flow contained
  only `https://mtd-evidence-pack.sociobot.in`.
- The tagged offline test cached the production chunks, disabled the network,
  reloaded `/demo`, and exported the encrypted sample pack.

The demo and its isolation pass. There is no blocking demo finding.

## Claims verification

I cloned the reviewed commit to `/tmp/mtd-review3-clean.CHtegF`, ran `npm ci`,
and ran every command from `.factory/claims.json` independently. All 13
commands passed:

| Claim id | Result | Observed evidence |
|---|---|---|
| `demo-sandbox` | PASS | Changed sample state reset; demo wording was mode-correct; real IndexedDB stayed unopened |
| `csv-import` | PASS | Impossible dates and blank amounts were rejected; two valid imports accumulated |
| `period-integrity` | PASS | Both boundary dates imported; a mixed outside-period file added no rows |
| `source-file-size` | PASS | 10 MiB attached; 10 MiB plus one byte was rejected without replacement |
| `encrypted-pack` | PASS | Wrong password failed; correct password opened the required CSV, PDF, files, manifest, and valid hashes |
| `free-core-export` | PASS | An encrypted pack downloaded without a licence |
| `local-only` | PASS | A real record persisted in IndexedDB and the request log remained same-origin |
| `offline-reload` | PASS | Cached `/demo` reloaded offline and exported an encrypted ZIP |
| `custom-checklist` | PASS | An unlicensed custom check survived reload |
| `readiness` | PASS | The named open item appeared, then changed to ready after completion |
| `standalone-install` | PASS | Manifest declared standalone mode, a start URL, and 192/512 icons |
| `paid-license` | PASS | A recorded valid verification enabled saved cover notes |
| `checkout-unavailable` | PASS | Public routes exposed no price, checkout link, or purchase action; restore remained |

No declared claim is untested and no declared claim test fails. F-3-1 through
F-3-5 identify public statements that are outside the declared contract.

## Earlier findings retested

I read `.factory/review-1.md`, `.factory/review-2.md`, `.factory/polish-1.md`,
`.factory/polish-2.md`, and the prior handoff. Each prior finding was checked
on production and in current source:

| Earlier id | Live and code result |
|---|---|
| `F-1-1` | FIXED — the plain availability sentence and `checkout-unavailable` claim remain |
| `F-1-2` | FIXED — “versioned evidence checklist” remains absent |
| `F-1-3` | FIXED — the live 404 returns HTTP 404 with metadata and shared Workspace, Privacy, Terms, and footer links |
| `F-1-4` | FIXED — “Readiness preview” remains live and in source |
| `F-1-5` | FIXED — “The product itself” remains absent |
| `F-1-6` | FIXED — the limitation section uses “What this tool does not do” and names the boundary |
| `F-1-7` | FIXED — the hero caption explains that source files stay with one selected quarter |
| `F-1-8` | FIXED — the README introduction remains split and every sentence is under 22 words |
| `F-2-1` | FIXED — demo mode says the sample resets; only the real workspace says work saves on-device |
| `F-2-2` | FIXED for the cited “handoff” wording — it remains absent; F-3-6 records a separate surviving “core pack” collision |
| `F-2-3` | FIXED — “Supported edition” remains absent and the section names existing licences |
| `F-2-4` | FIXED — “app shell” remains absent from public copy |
| `F-2-5` | FIXED — “Generated art disclosed” remains absent; the current direct provenance sentence is assessed separately in F-3-4 |

No earlier ID is reopened as blocking.

## Structure, routing, accessibility, and identity

- `/`, `/?demo=1`, `/demo`, `/workspace`, `/privacy`, and `/terms` return 200.
  An unknown path returns the designed 404 with HTTP 404.
- Every product route has one h1, one main landmark, its own title,
  description, canonical, Open Graph data, Twitter data, and local favicon.
  The root title follows **Product — what it does**.
- The manifest, 192/512 icons, apple-touch icon, social image, `robots.txt`, and
  `sitemap.xml` all return 200. Every internal navigation target and the Param
  Factory external target return 200; `mailto:` is explicit.
- Direct deep links render the correct page. Client navigation and browser Back
  restore `/demo`, focus its h1, and announce the route.
- The first keyboard Tab reaches the skip link. Space toggles a checklist item.
  File inputs receive the designed focus ring. The 390 px and 200% text checks
  have no horizontal overflow.
- Playwright Axe reports no serious or critical violations on all product
  routes and the 404. The live URL verifier reports title, `lang="en-GB"`, one
  h1, main, image alternatives, and button labels with no error.
- The paper-ledger palette, cut-paper night scene, clipped sheets, editorial
  typography, and restrained paper-rise motion are recognisably specific to
  this product. Reduced-motion behavior is present. This is not a generic SaaS
  template.

## Quality-gate evidence

- Clean checkout `npm test`: PASS — 9 unit and 32 browser tests.
- Clean checkout `npm run build`: PASS — `dist/` produced; initial app chunk is
  1.87 kB gzip and the loaded app chunk is 10.62 kB gzip.
- Clean checkout `npm run lint`: PASS.
- Clean checkout `npm audit --omit=dev`: PASS — zero vulnerabilities.
- Live `PLAYWRIGHT_BASE_URL=https://mtd-evidence-pack.sociobot.in npm run
  test:e2e`: PASS — 32/32.
- Live `npm run verify:url -- https://mtd-evidence-pack.sociobot.in`: PASS.
- Live mobile performance check: 572 ms LCP, 24 ms longest interaction,
  2,121 B initial JavaScript, and 5,421 B CSS.

## Missed leverage

No AI, sync, or additional import/export feature is clearly implied. The brief
calls for categorised CSV import, source-file attachment, readiness checks, and
ZIP/CSV/PDF export; all are present. Sending local bookkeeping records to an AI
gateway would add privacy and cost without a clear core benefit. Sync would
conflict with the stated local-first scope unless explicitly requested.

## What would make this perfect

Resolve F-3-1 through F-3-7. In particular, declare and tag every remaining
public claim, replace subjective sample wording with concrete contents, use
**evidence pack** consistently, and point the README Privacy link to the live
product. Then rerun the complete review from a fresh browser context and clean
checkout. A PASS requires zero findings, not only passing behavior.
