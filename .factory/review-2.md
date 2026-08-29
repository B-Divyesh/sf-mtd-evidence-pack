# Adversarial first-read review 2 — FAIL

**Date:** 29 August 2026  
**URL:** <https://mtd-evidence-pack.sociobot.in>  
**Commit reviewed:** `85592a75dab278ea6694510d177e78a35c23756f`

## Verdict

**FAIL.** The first screen is clear, the one-click sample is populated, all 13
declared claim commands pass, and the live structure and accessibility checks
pass. One statement on the first demo screen directly contradicts the demo
sandbox. Four smaller copy findings also remain. The required zero-finding
standard is therefore not met.

## Findings, ordered by severity

### F-2-1 — BLOCKING: the first demo screen contradicts its sandbox banner

**Exact quote/location:** on `/?demo=1` and `/demo`, the banner says **“Demo —
sample data, nothing is saved”** while the subtitle immediately below the h1
says **“Your work saves on this device.”** Both statements appear in the first
390 px demo viewport.

**Why this fails:** the second statement describes real-workspace behaviour,
but it is rendered in demo mode, where changes remain only in page memory and
reset on reload. A first-time visitor cannot tell which adjacent promise is
true. This makes the otherwise working sandbox dishonest at the point where
the visitor is deciding whether it is safe to try.

**Concrete fix:** render mode-specific copy. In demo mode use **“The sample
resets when you reload or leave the demo.”** Keep **“Your work saves on this
device.”** only in the real workspace. Extend `@claim:demo-sandbox` to assert
the demo sentence is present and the real-workspace sentence is absent while
the demo banner is shown.

### F-2-2 — Minor: the exported artifact has two names

**Exact quotes/locations:** landing h1 **“Prepare your quarterly evidence
handoff”**; landing heading **“See what is missing before handoff”**; landing
heading **“Prepare records for the next handoff”**; landing footer **“Prepare a
quarterly evidence handoff on your device.”**; README introduction **“Check one
quarter before exporting an encrypted handoff for your accountant or
compatible filing software.”** Elsewhere the same deliverable is an **“evidence
pack”**, **“core pack”**, **“encrypted pack”**, or ZIP.

**Why this fails:** “handoff” sometimes names the act and sometimes the file.
The product name and workspace use “evidence pack,” so a cold visitor should
not have to decide whether a handoff is a separate output.

**Concrete fix:** use **“evidence pack”** for the exported artifact everywhere.
For example: **“Prepare your quarterly evidence pack”**, **“See what is missing
before export”**, and **“Check one quarter before exporting an encrypted
evidence pack for your accountant or compatible filing software.”** Reserve
“handoff” only for the act of giving the pack to someone.

### F-2-3 — Minor: “Supported edition” does not name the section plainly

**Exact quote/location:** landing eyebrow and README heading: **“Supported
edition.”** The same section then uses **“core pack”** and **“licence.”**

**Why this fails:** “supported” could mean maintained, compatible, or paid. It
does not tell a scanning visitor that the core workflow is free and only old
licences can be restored.

**Concrete fix:** use **“Free core and existing licences”** as the landing and
README section heading. Keep **“Restore a licence”** for the form.

### F-2-4 — Minor: “app shell” is unexplained README jargon

**Exact quote/location:** README, “Privacy and offline use”: **“The app shell,
sample, and encrypted export work after the first visit.”**

**Why this fails:** “app shell” is an implementation term, not a user-visible
result. A sole trader cannot tell whether it means the full tool or only its
layout.

**Concrete fix:** **“The app, sample, and encrypted export work after the first
visit.”** Keep the existing `offline-reload` claim test.

### F-2-5 — Minor: the footer points to an unavailable disclosure

**Exact quote/location:** landing footer: **“v1.0.7 · Generated art disclosed.”**

**Why this fails:** “disclosed” does not say where the disclosure is. The
public page has no artwork-provenance link, so the phrase gives the visitor no
usable information.

**Concrete fix:** show **“v1.0.7”** alone and retain provenance in
`.factory/design.md`, or link a plain **“Artwork provenance”** label to a public
page that states the method and date.

## Cold first read

I opened production in fresh Chromium contexts at 390 × 844 and 1440 × 900 and
recorded the following before scrolling:

- **What it does:** turns one quarter of bookkeeping records into an evidence
  pack for handoff.
- **Who it is for:** UK sole traders who keep their own books and need to give
  records to an accountant or filing product.
- **What to click first:** **Try it with sample data**; the adjacent text says
  it loads one sample quarter and saves nothing.

All three answers are available on both first screens. The headline is five
words, the audience sentence is 19 words, the action is visually primary, and
the three facts cover offline use, device storage, and price. There was no
horizontal overflow or browser error. This part is not blocking.

## Copy audit

Counts treat hyphenated terms, versions, file paths, and URLs as one word.
Headings, actions, labels, statuses, sample labels, and meaningful alternative
text are included so the audit also covers non-sentence interface copy.
Numbers `01`, `02`, and `03` are structural markers rather than copy. No item
exceeds 22 words and no banned marketing word appears.

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
| Prepare your quarterly evidence handoff | 5 | F-2-2 |
| For UK sole traders who keep local books and need a clear pack for an accountant or filing software. | 19 | Clear audience and outcome |
| Try it with sample data | 5 | Result-naming action |
| Loads one sample quarter. | 4 | Clear demo result |
| Nothing is saved. | 3 | `demo-sandbox` |
| Works after your first visit | 5 | `offline-reload` |
| Records stay on this device | 5 | `local-only` |
| Core pack export is free | 5 | `free-core-export` |
| Q1—Q4 | 1 | Artwork label |
| Four paper filing houses connected by a coral path under a paper moon. | 13 | Image alternative |
| Keep source files with the records for one selected quarter. | 10 | `encrypted-pack` |
| Readiness preview | 2 | Clear section label |
| See what is missing before handoff | 6 | F-2-2; `readiness` |
| The checklist and records stay beside each other. | 8 | Visible preview description |
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
| Prepare records for the next handoff | 6 | F-2-2 |
| It does not submit tax returns. | 6 | Clear non-goal |
| Use compatible filing software or an accountant when you are ready to submit. | 13 | Clear next step |
| Supported edition | 2 | F-2-3 |
| Keep the core pack free | 5 | Free-core heading |
| Import records, maintain your checklist, and export the encrypted pack without paying. | 12 | Declared import/checklist/export claims |
| Restore a licence | 3 | Clear section heading |
| Existing licence holders can restore saved cover notes. | 8 | `paid-license` |
| New licences are not currently available. | 6 | `checkout-unavailable` |
| Paste your licence | 3 | Clear field label |
| Verify licence | 2 | Result-naming action |
| Prepare a quarterly evidence handoff on your device. | 8 | F-2-2 |
| Privacy | 1 | Clear footer link |
| Terms | 1 | Clear footer link |
| Built by Param Factory (external site) | 6 | Clear external link |
| v1.0.7 · Generated art disclosed | 4 | F-2-5 |

### README

Commands and export-list entries are included for completeness even though
they are not grammatical sentences.

| Exact copy | Words | Result |
|---|---:|---|
| MTD Evidence Pack | 3 | Clear product name |
| Prepare a quarterly MTD evidence pack from local bookkeeping records. | 10 | Clear summary |
| MTD Evidence Pack is for UK sole traders who keep their own books. | 13 | Clear audience |
| Import a categorised CSV and attach source files. | 8 | Declared import/attachment claims |
| Check one quarter before exporting an encrypted handoff for your accountant or compatible filing software. | 15 | F-2-2 |
| Use compatible filing software or an accountant when you are ready to submit. | 13 | Clear next step |
| Try the sample | 3 | Clear section heading |
| Open `/?demo=1` locally or visit `https://mtd-evidence-pack.sociobot.in/?demo=1`. | 6 | Clear instruction |
| The sample contains one realistic quarter. | 6 | Demo description |
| Demo changes are kept in memory and disappear on reload. | 10 | `demo-sandbox` |
| `/demo` also opens the sample. | 5 | Direct route |
| What the export contains | 4 | Clear section heading |
| The password-protected ZIP contains: | 4 | `encrypted-pack` |
| `records/transactions.csv` | 1 | Export-list entry |
| `summary/quarterly-handoff.pdf` | 1 | Export-list entry |
| attached source files | 3 | Export-list entry |
| `manifest.json` with SHA-256 hashes and checklist status | 7 | Export-list entry |
| `README.txt` | 1 | Export-list entry |
| Send the ZIP password through a different channel. | 8 | Clear security instruction |
| The password is never saved. | 5 | `encrypted-pack` |
| Privacy and offline use | 4 | Clear section heading |
| See the in-product Privacy page for browser-data controls and licence checks. | 11 | Clear route reference |
| The app shell, sample, and encrypted export work after the first visit. | 12 | F-2-4; `offline-reload` |
| Install it from a supporting browser for a standalone window. | 10 | `standalone-install` |
| Supported edition | 2 | F-2-3 |
| The core import, checklist maintenance, attachments, and encrypted export are free. | 11 | Declared core claims |
| Existing licence holders can paste a token to restore saved cover notes. | 12 | `paid-license` |
| New licences are not currently available. | 6 | `checkout-unavailable` |
| Licence verification uses the Sociobot billing API. | 7 | Exercised by `paid-license` |
| Develop | 1 | Clear developer heading |
| Requires Node.js 20 or newer. | 5 | Development prerequisite |
| `npm install` | 2 | Command |
| `npm run dev` | 3 | Command |
| Open `http://localhost:5173`. | 2 | Clear instruction |
| Test and build | 3 | Clear developer heading |
| `npm test` | 2 | Command |
| `npm run build` | 3 | Command |
| `npm test` runs unit and Playwright browser checks, including the tagged claims in `.factory/claims.json`. | 14 | Test description |
| The exact production build command is `npm run build`. | 9 | Build instruction |
| Static output lands in `dist/`, with `dist/index.html` at its root. | 10 | Build result |
| To run one claim: | 4 | Clear instruction |
| `npm run test:e2e -- --grep @claim:offline-reload` | 5 | Command |
| Deploy | 1 | Clear developer heading |
| Deploy the contents of `dist/` to Azure Static Web Apps. | 10 | Deployment instruction |
| `public/staticwebapp.config.json` supplies the explicit product routes, designed 404 response, security headers, and asset policy. | 14 | Deployment description |
| Data format | 2 | Clear section heading |
| CSV headers are `date,description,amount,category,reference`. | 4 | Data specification |
| Dates use `YYYY-MM-DD`. | 3 | Data specification |
| Income is positive and expenses are negative. | 7 | Data specification |
| The `reference` column is optional. | 5 | Data specification |
| The importer rejects invalid calendar dates, missing amounts, and records outside the selected period. | 14 | `csv-import`, `period-integrity` |
| Valid imports add records without replacing earlier records. | 8 | `csv-import` |
| Licence | 1 | Clear section heading |
| MIT. | 1 | Licence statement |
| See LICENSE. | 2 | Clear reference |

### Terminology check

The code and existing copy audit intend **evidence pack** to name the exported
collection. F-2-2 records the remaining uses of **evidence handoff** and
**handoff** for that same object. F-2-3 records **supported edition**, which is
not explained as an old paid licence. Other repeated terms—record, source file,
period, checklist item, demo, and licence—are used consistently.

Buttons on the landing page pass the result-naming check: **Try it with sample
data** and **Verify licence** state their result. Navigation links are clear
nouns rather than actions.

## Demo and sandbox behaviour

- The primary landing action reaches `/?demo=1` in one click.
- The first demo screen already shows Rowan Field Studio, Quarter 1 of 2026–27,
  12 records, three source files, 86% readiness, and one open check.
- The persistent banner contains **Reset demo** and **Start for real**. Reset
  restored a changed sample checkbox.
- In a fresh context, demo use did not create the real
  `mtd-evidence-pack:v1` IndexedDB database.
- In a second context, I created an **Existing real record**, entered and
  changed the demo, reset it, chose **Start for real**, and confirmed the real
  record was unchanged.
- A Playwright request log covering landing → demo → reset → back contained
  only `https://mtd-evidence-pack.sociobot.in`.
- The demo implementation is sound, but F-2-1 makes its first-screen copy
  contradictory and therefore blocking.

## Claims verification

I cloned the reviewed commit to `/tmp/mtd-review2-clean.X8d568`, ran `npm ci`,
and ran every command exactly as listed in `.factory/claims.json`. All passed:

| Claim id | Result | Observed evidence |
|---|---|---|
| `demo-sandbox` | PASS | Changed sample state reset on reload; real IndexedDB stayed unopened |
| `csv-import` | PASS | Invalid rows rejected; two valid imports accumulated |
| `period-integrity` | PASS | Boundary rows accepted; mixed out-of-period file rejected atomically |
| `source-file-size` | PASS | 10 MiB accepted; 10 MiB + 1 byte rejected |
| `encrypted-pack` | PASS | Wrong password failed; correct password opened ZIP with required entries and SHA-256 hashes |
| `free-core-export` | PASS | The same encrypted pack exported with no licence |
| `local-only` | PASS | Record appeared in IndexedDB; request log was same-origin only |
| `offline-reload` | PASS | Cached demo reloaded offline and exported its encrypted ZIP |
| `custom-checklist` | PASS | Unlicensed custom item survived reload |
| `readiness` | PASS | Named open item changed to ready after completion |
| `standalone-install` | PASS | Manifest declared standalone mode, start URL, and 192/512 icons |
| `paid-license` | PASS | Recorded valid verification enabled saved cover notes |
| `checkout-unavailable` | PASS | Public routes had no price, checkout link, or purchase action; restore remained |

The clean clone then passed `npm test` (8 unit tests and 26 browser tests),
`npm run lint`, and `npm run build`; `dist/` was produced. The full 26-test
browser suite also passed against production. The live performance check
reported 876 ms mobile LCP, 56 ms interaction time, 2,121 B initial JavaScript,
and 5,380 B CSS.

All landing/README capability, privacy, price, availability, and offline
claims map to the entries above. F-2-1 is not an untested capability; it is a
mode error where the real-workspace storage claim is displayed in the
non-persistent demo.

## Earlier findings retested

I read `.factory/review-1.md`, `.factory/polish-1.md`, and the prior handoff.
Each earlier finding was checked in both the current source and production:

| Earlier id | Live and code result |
|---|---|
| `F-1-1` | FIXED — public wording is “New licences are not currently available”; `checkout-unavailable` exists and passed |
| `F-1-2` | FIXED — README no longer claims a versioned checklist |
| `F-1-3` | FIXED — live unknown route returns HTTP 404 with description, canonical, OG/Twitter metadata, Workspace/Privacy/Terms links, and the shared footer |
| `F-1-4` | FIXED — “Readiness preview” replaced “Field note 01” live and in source |
| `F-1-5` | FIXED — “The product itself” is absent live and in source |
| `F-1-6` | FIXED — the limit is labelled “What this tool does not do” and explicitly says it does not submit tax returns |
| `F-1-7` | FIXED — the hero caption now says source files stay with the selected quarter’s records |
| `F-1-8` | FIXED — the README introduction is split into 13-, 8-, and 15-word sentences |

No earlier finding is being reopened. F-2-1 through F-2-5 are separate issues
found by rerunning the review from scratch.

## Site structure, accessibility, and links

- `/`, `/?demo=1`, `/demo`, `/workspace`, `/privacy`, and `/terms` return 200;
  an unknown route returns the designed HTTP 404.
- Every tested route has one h1, one main landmark, and its required
  route-specific title, description, and canonical. The root title follows
  **Product — what it does**. OG/Twitter metadata, local favicon, app icons,
  manifest, robots, sitemap, and security headers are present.
- Direct deep links load the correct content. Client navigation and browser
  Back restore the route; the restored h1 receives focus and route changes are
  announced.
- The cold first Tab reaches the skip link. Space toggles a checklist item.
  The 390 px and 200% text checks pass without horizontal overflow.
- Playwright Axe found no serious or critical issue on every app route and the
  404. The URL verifier found no missing title, language, main, alt text, or
  button label. No unexpected console/page error occurred.
- A live crawl found 200 responses for every internal destination and the
  Param Factory external link. `mailto:privacy@sociobot.in` is explicit. Hash
  skip links resolve to an existing `#main`; the one on the intentional 404
  stays within that already-loaded 404 document.
- The paper-ledger palette, cut-paper moon artwork, clipped sheets, editorial
  typography, and non-looping paper-rise motion are product-specific. This is
  not a generic centred-hero/three-card SaaS template, and reduced motion is
  respected.

## Missed leverage

No additional AI, sync, import, or export feature is implied strongly enough
to add a finding. CSV import, source-file attachment, encrypted ZIP/CSV/PDF
export, and offline local storage cover the brief. Sending sensitive books to
an AI gateway would add privacy and cost without an obvious core task benefit.

## What would make this perfect

Fix F-2-1 through F-2-5, add the mode-specific demo assertion described in
F-2-1, and rerun the full review. A PASS requires the demo to make one
unambiguous storage promise and the landing/README to use one artifact and
licence vocabulary with no unexplained footer or implementation copy.
