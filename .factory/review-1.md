# Adversarial first-read review 1 — FAIL

**Date:** 29 August 2026
**URL:** <https://mtd-evidence-pack.sociobot.in>
**Commit reviewed:** `30fee0c53bbaa85fef9da1d1ac468537173662bd`

## Verdict

**FAIL.** The core job, demo, sandbox, declared claims, and local quality gates
pass. Eight minor but genuine copy and route-contract findings remain. The
required zero-finding standard is not met.

## Cold first read

In uncached 1440 × 900 and 390 × 844 contexts before scrolling, I understood:

- **What:** prepare a quarterly evidence handoff from local bookkeeping records.
- **Who for:** UK sole traders who keep local books and need a pack for an
  accountant or compatible filing software.
- **First click:** **Try it with sample data**; adjacent copy says “Loads one
  sample quarter. Nothing is saved.”

This passes the first-screen test. Both first loads made only same-origin
requests, had no console/page error, and had no mobile horizontal overflow.

## Findings, ordered by severity

### F-1-1 — Minor: checkout availability is an unlisted public claim

**Quote/location:** landing pricing card: “New purchases are not offered while
checkout is unavailable.” README: “New purchases are not offered while the
factory checkout is unavailable.”

**Why:** availability is a visitor-reliant claim. A browser test checks this
absence, but it is not tagged and there is no `claims.json` entry. “Factory
checkout” is also unexplained jargon.

**Fix:** add a `checkout-unavailable` claim with a tagged test that asserts no
price, checkout URL, or purchase action exists on public routes; use “New
licences are not currently available.” Or remove the statement.

### F-1-2 — Minor: README promises a versioned checklist without proof

**Quote/location:** README introduction: “It imports a categorised CSV, tracks
a versioned evidence checklist, attaches source files, and exports a
password-protected handoff for an accountant or compatible filing software.”

**Why:** no declared claim proves a visitor-visible version history. The code
shows a fixed “Working checklist v1.0” label and editable items, not revisions.

**Fix:** implement visible history plus a `checklist-version-history` claim, or
remove “versioned” as in F-1-8.

### F-1-3 — Minor: the live 404 breaks the metadata and common-skeleton contract

**Evidence/location:** `/not-a-real-route` returns the designed 404 and an
appropriate title, but lacks a meta description and canonical link. Its header
omits **Workspace** and its footer omits **Privacy**, unlike all app routes.

**Why:** every route needs its metadata and the common header/footer. A user
recovering from a bad address loses an advertised destination and a policy link.

**Fix:** add 404-specific description, canonical, OG/Twitter metadata, and the
same header/footer links as the app shell. Test these exact elements.

### F-1-4 — Minor: decorative brand-lore label

**Quote/location:** landing readiness preview: “Field note 01”.

**Why:** it neither names the section nor tells a visitor what they can do.

**Fix:** remove it or replace it with “Readiness preview”.

### F-1-5 — Minor: non-informative heading

**Quote/location:** landing readiness preview: “The product itself”.

**Why:** it makes no sense as a section name out of context and says nothing
beyond the visitor already being on the product page.

**Fix:** remove it; “See what is missing before handoff” is already the useful
section heading. If retained, use “Readiness preview”.

### F-1-6 — Minor: non-goal section starts with a mood heading

**Quote/location:** landing limits eyebrow: “A boundary, kept clear”.

**Why:** this metaphor does not name the essential limitation: the tool
prepares records but does not submit them.

**Fix:** use “What this tool does not do”, followed by: “It does not submit tax
returns. Use compatible filing software or an accountant when you are ready to
submit.”

### F-1-7 — Minor: vague, untested hero caption

**Quote/location:** hero caption: “Four quarters. One traceable path through
the source records.”

**Why:** “traceable path” is neither defined nor an observable claim; “Four
quarters” does not explain that the workspace opens one selected quarter.

**Fix:** replace with “Keep source files with the records for one selected
quarter.” This is useful and matches the encrypted-pack contract.

### F-1-8 — Minor: README introduction exceeds the sentence limit

**Quote/location:** the README sentence quoted in F-1-2 is 25 words.

**Why:** it exceeds the 22-word cap and bundles import, checklist, attachment,
encryption, and recipient into one sentence.

**Fix:** “Import a categorised CSV and attach source files. Check one quarter
before exporting an encrypted handoff for your accountant or compatible filing
software.”

## Copy audit

Counts treat hyphenated terms and URLs as one word. Headings and action labels
are included because the plain-words rule applies to them. F-1-4 through
F-1-7 are the landing flags.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Local quarterly record check | 4 | — |
| Prepare your quarterly evidence handoff | 5 | — |
| For UK sole traders who keep local books and need a clear pack for an accountant or filing software. | 19 | — |
| Try it with sample data | 5 | Result-naming action |
| Loads one sample quarter. | 4 | — |
| Nothing is saved. | 3 | `demo-sandbox` |
| Works after your first visit | 5 | `offline-reload` |
| Records stay on this device | 5 | `local-only` |
| Core pack export is free | 5 | `free-core-export` |
| Four quarters. | 2 | F-1-7 |
| One traceable path through the source records. | 7 | F-1-7 |
| Field note 01 | 3 | F-1-4 |
| The product itself | 3 | F-1-5 |
| See what is missing before handoff | 6 | `readiness` |
| The checklist and records stay beside each other. | 7 | — |
| Open items remain named. | 4 | `readiness` |
| Quarter 1 · 2026–27 | 3 | sample label |
| 6 of 7 checked | 4 | sample label |
| 12 bookkeeping records | 3 | sample label |
| 3 source files | 3 | sample label |
| Invoices and receipts can be matched to records | 8 | sample item |
| How it works | 3 | — |
| Build the pack in three passes | 6 | — |
| Set the period | 3 | — |
| Name the quarter and check its start and end dates. | 10 | — |
| Import and match | 3 | — |
| Add a categorised CSV. | 4 | — |
| Attach statements, invoices, receipts, or an index. | 7 | — |
| Check and export | 3 | — |
| Close each checklist item. | 4 | — |
| Download one password-protected ZIP with CSV, PDF, files, and hashes. | 10 | `encrypted-pack` |
| A boundary, kept clear | 4 | F-1-6 |
| Prepare records for the next handoff | 6 | — |
| Use compatible filing software or an accountant when you are ready to submit. | 13 | — |
| Confirm checklist changes with them. | 5 | — |
| Supported edition | 2 | — |
| Keep the core pack free | 5 | `free-core-export` |
| Import records, maintain your checklist, and export the encrypted pack without paying. | 10 | declared import/checklist/export claims |
| Restore a licence | 3 | — |
| Existing licence holders can restore saved cover notes. | 8 | `paid-license` |
| New purchases are not offered while checkout is unavailable. | 9 | F-1-1 |
| Paste your licence | 3 | — |
| Verify licence | 2 | Result-naming action |
| Prepare a quarterly evidence handoff on your device. | 8 | — |
| Built by Param Factory | 4 | — |
| v1.0.6 · Generated art disclosed | 4 | — |

Navigation labels—MTD Evidence Pack, Demo, Workspace, Privacy, and Terms—are
clear nouns rather than sentences. The action controls are recorded above.

### README

| Copy | Words | Result |
| --- | ---: | --- |
| MTD Evidence Pack | 3 | — |
| Prepare a quarterly MTD evidence pack from local bookkeeping records. | 10 | — |
| MTD Evidence Pack is for UK sole traders who keep their own books. | 13 | — |
| It imports a categorised CSV, tracks a versioned evidence checklist, attaches source files, and exports a password-protected handoff for an accountant or compatible filing software. | 25 | F-1-2, F-1-8 |
| Use compatible filing software or an accountant when you are ready to submit. | 13 | — |
| Try the sample | 3 | — |
| Open `/demo` locally or visit the live demo URL. | 9 | — |
| The sample contains one realistic quarter. | 6 | — |
| Demo changes are kept in memory and disappear on reload. | 10 | `demo-sandbox` |
| What the export contains | 4 | — |
| The password-protected ZIP contains: | 4 | `encrypted-pack` |
| Send the ZIP password through a different channel. | 8 | — |
| The password is never saved. | 5 | `encrypted-pack` |
| Privacy and offline use | 4 | — |
| See the in-product Privacy page for browser-data controls and licence checks. | 11 | — |
| The app shell, sample, and encrypted export work after the first visit. | 12 | `offline-reload` |
| Install it from a supporting browser for a standalone window. | 10 | `standalone-install` |
| Supported edition | 2 | — |
| The core import, checklist maintenance, attachments, and encrypted export are free. | 11 | declared core claims |
| Existing licence holders can paste a token to restore saved cover notes. | 12 | `paid-license` |
| New purchases are not offered while the factory checkout is unavailable. | 11 | F-1-1 |
| Licence verification uses the Sociobot billing API. | 7 | implementation statement |
| Develop | 1 | — |
| Requires Node.js 20 or newer. | 5 | — |
| Open the local development URL. | 5 | — |
| Test and build | 3 | — |
| `npm test` runs unit and Playwright browser checks, including the tagged claims in `.factory/claims.json`. | 14 | — |
| The exact production build command is `npm run build`. | 9 | — |
| Static output lands in `dist/`, with `dist/index.html` at its root. | 10 | — |
| To run one claim: | 4 | — |
| Deploy | 1 | — |
| Deploy the contents of `dist/` to Azure Static Web Apps. | 10 | — |
| `public/staticwebapp.config.json` supplies the explicit product routes, designed 404 response, security headers, and asset policy. | 14 | — |
| Data format | 2 | — |
| CSV headers are `date,description,amount,category,reference`. | 4 | — |
| Dates use `YYYY-MM-DD`. | 3 | — |
| Income is positive and expenses are negative. | 7 | — |
| The `reference` column is optional. | 5 | — |
| The importer rejects invalid calendar dates, missing amounts, and records outside the selected period. | 14 | import/period claims |
| Valid imports add records without replacing earlier records. | 8 | `csv-import` |
| Licence | 1 | — |
| MIT. See LICENSE. | 3 | — |

## Demo, claims, structure, and history

- The visible demo opens a populated Rowan Field Studio quarter in one click.
  It shows the required persistent banner, **Reset demo**, and **Start for
  real**. Reload restores the sample; the sandbox test confirms no real
  IndexedDB workspace opens.
- A temporary clean clone completed `npm ci` with zero vulnerabilities. Every
  exact command in `.factory/claims.json` passed independently against the live
  `/demo` entry point (12 claims, implemented by 11 tests because encrypted
  export/free export share a tagged test).
- Request logs for cold landing, demo, and local-only work contained only the
  product origin. The offline claim passed with an encrypted demo export after
  first visit. No demo work persisted to real storage.
- Local `npm test` passed (8 unit and 24 browser tests); its mobile test logged
  552 ms LCP, 32 ms interaction, 2,141 B initial JS and 5,199 B CSS. `npm run
  build`, `npm run verify:url`, and `npm audit --omit=dev` passed. `dist/` was
  produced.
- Live `/`, `/demo`, `/workspace`, `/privacy`, and `/terms` have one h1/main,
  route-specific titles/canonicals, working back navigation and heading focus.
  Internal links, robots, sitemap, manifest, favicon, social card and the
  Param Factory link returned 200. Unknown routes return HTTP 404. F-1-3 is
  the remaining 404 contract issue.
- The design is product-specific rather than a generic SaaS template. The brief
  does not imply a useful AI step; sensitive local bookkeeping should not be
  sent to a model merely to add one. Import, attachments, encrypted export and
  PWA offline behavior already cover the implied leverage.

### Earlier-review retest

There are no earlier `review-*` or `polish-*` files. I read every
`verification*.md` and the prior handoff. Previous findings are actually fixed:
the dead £24 checkout is no longer exposed; the mobile interaction gate passes;
the 10 MiB limit has a tagged boundary test; the cold first Tab reaches the
skip link; unlicensed custom checks save; imports add rather than replace;
out-of-period imports reject atomically; the encrypted export works offline;
hashed chunks are immutable; the styled unknown route returns 404; and prior
accessibility/touch/stale-status concerns pass the current tests. F-1-1 is a
new claim-contract gap in the replacement wording, and F-1-3 is a separate 404
metadata/skeleton defect.

## What would make this perfect

Repair F-1-1 through F-1-8, then rerun this complete cold first-read review.
The resulting product would be clear, tryable, private by default, and free of
remaining copy or route-contract ambiguity.
