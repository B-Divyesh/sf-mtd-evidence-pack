# Adversarial first-read review 4 — FAIL

**Date:** 29 August 2026  
**URL:** <https://mtd-evidence-pack.sociobot.in>  
**Commit reviewed:** `66778d5e7fb4206fc282f42e8e069cc749dbdfbf`

## Verdict

**FAIL.** The first screen is clear, the sample is useful, and all 16 declared
claim commands pass. Two blocking defects remain: a cold demo reads and can
write the real licence namespace, and browser Back loses the previous scroll
position. Eight smaller copy and structure findings also remain. The required
zero-finding standard is not met.

## Findings, ordered by severity

### F-4-1 — BLOCKING: a cold demo touches the real licence namespace

**Exact quote/location:** the `/?demo=1` banner says **“Demo — sample data,
nothing is saved.”** Startup in `src/app.ts` nevertheless calls
`hasCachedLicense()` before it decides whether the route is a demo. Because
`location.pathname !== "/demo"` is true for `/?demo=1`, it also calls
`verifyLicense()`.

**Observed evidence:** in a fresh browser profile I first placed
`real-existing-token` in the real `sb_license:mtd-evidence-pack` key, cleared
its verdict, and then cold-opened `/?demo=1`. While the demo banner was shown,
the page requested
`https://api.sociobot.in/api/v1/products/mtd-evidence-pack/verify?license=real-existing-token`
and wrote a new timestamped verdict to
`sb_license:mtd-evidence-pack:verdict`. The direct `/demo` route skips the
network check but still calls `captureReturnedLicense()` and
`hasCachedLicense()`, so it reads the real namespace; `/demo?license=...` can
also write it.

**Why this fails:** demo mode must not read or write real storage. The banner
is false for a returning licence holder, and the primary query-string demo is
not isolated from real licence state.

**Concrete fix:** decide demo mode before any licence function runs. On both
`/demo` and `?demo=1`, skip licence capture, cached-licence reads, and licence
verification; use demo-only feature state. Load the real licence only after
**Start for real**. Extend `@claim:demo-sandbox` to preload real workspace and
licence keys, cold-open both demo URLs, and assert that no key changes and no
billing request occurs.

### F-4-2 — BLOCKING: browser Back does not restore the prior scroll position

**Exact location:** live History API navigation from the landing page to
`/demo`, then browser Back. `src/app.ts` handles `popstate` by rerendering but
does not store or restore per-entry scroll coordinates.

**Observed evidence:** at 390 × 844 I scrolled the landing page to `scrollY =
813`, opened **Demo**, and pressed Back. The URL and focused h1 returned to the
landing page, but `scrollY` was `0`, not `813`. Forward also opened the demo at
`0`. Route focus and the live announcement worked.

**Why this fails:** the routing contract requires Back and Forward to restore
scroll as well as focus. A visitor returning from the sample loses their
reading position. This is broken history behavior.

**Concrete fix:** save the current scroll position in each history entry,
restore it after rendering on `popstate`, and keep h1 focus with
`preventScroll`. Add a Playwright test that scrolls the landing page, enters
the demo, goes Back and Forward, and asserts the saved position and focused
h1 for each entry.

### F-4-3 — Minor: the offline fact does not say “offline”

**Exact quote/location:** landing first screen, **“Works after your first
visit.”**

**Why this fails:** this is meant to be the mandatory offline fact, but it
does not name offline use. It can be read as a vague availability or
persistence promise.

**Concrete fix:** use **“Works offline after your first visit.”** Update the
`offline-reload` claim text to match; its current test already verifies the
result.

### F-4-4 — Minor: “hashes” is unexplained user-facing jargon

**Exact quotes/locations:** landing, **“Download one password-protected ZIP
with CSV, PDF, files, and hashes.”** README export list,
**“`manifest.json` with SHA-256 hashes and checklist status.”**

**Why this fails:** a sole trader is not told what a hash does or why it is in
the pack. The technical term interrupts an otherwise plain description.

**Concrete fix:** landing: **“Download one password-protected ZIP with
records, a PDF summary, source files, and file-change checks.”** README:
**“`manifest.json`, with checklist status and file-change checks (SHA-256).”**

### F-4-5 — Minor: “browser-data controls” is implementation jargon

**Exact quote/location:** README, **“See the in-product Privacy page for
browser-data controls and licence checks.”**

**Why this fails:** the phrase does not say what a user can do on the Privacy
page.

**Concrete fix:** **“See the in-product Privacy page to learn how to delete
local data and how licence checks work.”**

### F-4-6 — Minor: the installation sentence uses two vague browser terms

**Exact quote/location:** README, **“Install it from a supporting browser for
a standalone window.”**

**Why this fails:** “supporting browser” and “standalone window” do not tell a
visitor what control to look for or what result to expect.

**Concrete fix:** **“If your browser offers Install, use it to open the tool
in its own window.”** Keep the existing manifest claim test.

### F-4-7 — Minor: the 404 section label uses a filing metaphor

**Exact quote/location:** designed 404, **“404 · Misfiled page.”**

**Why this fails:** “misfiled” is brand-lore copy rather than the name of the
error.

**Concrete fix:** use **“Page not found.”**

### F-4-8 — Minor: the 404 h1 uses a metaphor instead of the error

**Exact quote/location:** designed 404 h1, **“This page is not in the pack.”**

**Why this fails:** the visitor must translate the evidence-pack metaphor to
understand that the address was not found.

**Concrete fix:** use **“We could not find this page.”**

### F-4-9 — Minor: the 404 header replaces status with a mood line

**Exact quote/location:** the normal header shows **“Online”** or
**“Offline”**; the 404 uses **“Find your way back.”**

**Why this fails:** the phrase carries no status information and makes the
common header inconsistent. The 404 also substitutes a text `◐` for the
normal paper-moon mark.

**Concrete fix:** reuse the standard wordmark and header markup on the 404,
including real network status when script is available. If the static 404
cannot report status, omit the slot instead of inserting a slogan.

### F-4-10 — Minor: the 404 omits the apple-touch icon

**Exact location:** `public/404.html` includes the SVG favicon but has no
`<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">`. Every app
route includes it.

**Why this fails:** the 404 metadata is inconsistent with the product’s local
icon contract.

**Concrete fix:** add the apple-touch icon link to the static 404 and extend
the 404 regression test to assert both local icon links.

## Cold first read

I opened production without stored site data in separate 390 × 844 and 1440 ×
900 Chromium contexts and did not scroll. In my own words:

- **What it does:** prepares one quarter of bookkeeping records as an evidence
  pack.
- **Who it is for:** UK sole traders giving records to an accountant or
  compatible filing software.
- **What to click first:** **Try it with sample data**; the adjacent result
  says it loads 12 records, three source files, and one open check, and saves
  nothing.

All three answers are visible on both first screens. The h1 has five words,
the audience sentence has 19, the primary action is visible, and there is no
horizontal overflow. Cold loads made only same-origin requests and produced no
console or page error. F-4-3 is a clarity defect in the supporting offline
fact, not a failure of these three first-read answers.

## Copy audit

Counts use rendered, space-separated words. Hyphenated terms, URLs, file
paths, and versions count as one word. Headings, actions, labels, statuses,
meaningful alternative text, commands, and list entries are included for
completeness. No sentence exceeds 22 words and no banned marketing word
appears.

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
| Nothing is saved. | 3 | `demo-sandbox`; see F-4-1 |
| Works after your first visit | 5 | F-4-3 |
| Records stay on this device | 5 | `local-only` |
| Evidence pack export is free | 5 | `free-evidence-pack` |
| Q1—Q4 | 1 | Artwork label |
| Four paper filing houses connected by a coral path under a paper moon. | 13 | Image alternative |
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
| 01 | 1 | Step marker |
| Set the period | 3 | Step heading |
| Name the quarter and check its start and end dates. | 10 | Concrete instruction |
| 02 | 1 | Step marker |
| Import and match | 3 | Step heading |
| Add a categorised CSV. | 4 | `csv-import` |
| Attach statements, invoices, receipts, or an index. | 7 | Attachment instruction |
| 03 | 1 | Step marker |
| Check and export | 3 | Step heading |
| Close each checklist item. | 4 | `readiness` |
| Download one password-protected ZIP with CSV, PDF, files, and hashes. | 10 | F-4-4; `encrypted-pack` |
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
| v1.0.10 | 1 | Build identifier |

### README

| Exact copy | Words | Result |
|---|---:|---|
| MTD Evidence Pack | 3 | Product name |
| Prepare a quarterly MTD evidence pack from local bookkeeping records. | 10 | Plain summary |
| MTD Evidence Pack is for UK sole traders who keep their own books. | 13 | Audience |
| Import a categorised CSV and attach source files. | 8 | Declared import and attachment capabilities |
| Check one quarter before exporting an encrypted evidence pack for your accountant or compatible filing software. | 15 | Declared readiness and export capabilities |
| Use compatible filing software or an accountant when you are ready to submit. | 13 | Concrete next step |
| Try the sample | 3 | Clear heading |
| Open `/?demo=1` locally or visit `https://mtd-evidence-pack.sociobot.in/?demo=1`. | 6 | Clear instruction; see F-4-1 |
| The sample contains 12 categorised records, three source files, and one open checklist item for one quarter. | 17 | `sample-content` |
| Demo changes are kept in memory and disappear on reload. | 10 | `demo-sandbox`; see F-4-1 |
| `/demo` also opens the sample. | 5 | Clear route instruction |
| What the export contains | 4 | Clear heading |
| The password-protected ZIP contains: | 4 | `encrypted-pack` |
| `records/transactions.csv` | 1 | Export entry |
| `summary/evidence-pack-summary.pdf` | 1 | Export entry |
| attached source files | 3 | Export entry |
| `manifest.json` with SHA-256 hashes and checklist status | 7 | F-4-4 |
| `README.txt` | 1 | Export entry |
| Send the ZIP password through a different channel. | 8 | Concrete security instruction |
| The password is never saved. | 5 | `encrypted-pack` |
| Privacy and offline use | 4 | Clear heading |
| See the in-product Privacy page for browser-data controls and licence checks. | 11 | F-4-5 |
| The app, sample, and encrypted export work after the first visit. | 11 | `offline-reload` |
| Install it from a supporting browser for a standalone window. | 10 | F-4-6; `standalone-install` |
| Free export and existing licences | 5 | Clear heading |
| Import records, maintain the checklist, attach source files, and export an encrypted evidence pack without a licence. | 17 | `free-evidence-pack` |
| Existing licence holders can paste a token to restore saved cover notes. | 12 | `paid-license` |
| New licences are not currently available. | 6 | `checkout-unavailable` |
| Licence verification sends its token to the Sociobot billing API. | 10 | `paid-license`; see F-4-1 for demo isolation |
| Develop | 1 | Developer heading |
| Requires Node.js 20 or newer. | 5 | Development prerequisite |
| `npm install` | 2 | Command |
| `npm run dev` | 3 | Command |
| Open `http://localhost:5173`. | 2 | Clear instruction |
| Test and build | 3 | Developer heading |
| `npm test` | 2 | Command |
| `npm run build` | 3 | Command |
| `npm test` runs unit and Playwright browser checks, including the tagged claims in `.factory/claims.json`. | 14 | Accurate test description |
| The exact production build command is `npm run build`. | 9 | Build instruction |
| Static output lands in `dist/`, with `dist/index.html` at its root. | 10 | Build result |
| To run one claim: | 4 | Clear instruction |
| `npm run test:e2e -- --grep @claim:offline-reload` | 6 | Command |
| Deploy | 1 | Developer heading |
| Deploy the contents of `dist/` to Azure Static Web Apps. | 10 | Deployment instruction |
| `public/staticwebapp.config.json` supplies the explicit product routes, designed 404 response, security headers, and asset policy. | 14 | Deployment description |
| Data format | 2 | Clear heading |
| CSV headers are `date,description,amount,category,reference`. | 4 | Data specification |
| Dates use `YYYY-MM-DD`. | 3 | Data specification |
| Income is positive and expenses are negative. | 7 | Data specification |
| The `reference` column is optional. | 5 | Data specification |
| The importer rejects invalid calendar dates, missing amounts, and records outside the selected period. | 14 | `csv-import`, `period-integrity` |
| Valid imports add records without replacing earlier records. | 8 | `csv-import` |
| Licence | 1 | Clear heading |
| MIT. | 1 | Licence statement |
| See LICENSE. | 2 | Clear reference |

### Terminology and actions

The public copy consistently uses **evidence pack**, **record**, **source
file**, **period**, **checklist item**, **demo**, and **licence**. F-4-4 through
F-4-6 record the remaining jargon. Landing actions pass the result-naming
check: **Try it with sample data** and **Verify licence** name their outcomes.
Navigation links are clear nouns.

## Demo and sandbox behavior

- The primary landing action opens `/?demo=1` in one click.
- The first 390 px screen after the click shows the persistent demo banner,
  Quarter 1 of 2026–27, and the top of its 86% readiness result. The full
  sample contains 12 categorised records, three source files, and one named
  open check.
- Changing a completed check and choosing **Reset demo** restored the sample.
  The banner remained sticky beside **Reset demo** and **Start for real** after
  scrolling to the export area.
- With no pre-existing real state, demo use created no IndexedDB database or
  localStorage item and made only same-origin requests.
- I also created an **Existing real record**, entered and reset the demo, chose
  **Start for real**, and confirmed the record remained in IndexedDB and the
  UI. Sample workspace changes do not overwrite real workspace records.
- F-4-1 is still blocking because the separate real licence namespace is read
  on every cold demo startup and is written by the query-string demo when a
  verification is due.

## Claims verification

I cloned the reviewed commit to `/tmp/mtd-review4.GYfJKD`, ran `npm ci`, and
ran every `test` command from `.factory/claims.json` independently. All 16
exact commands passed:

| Claim id | Result | Observed evidence |
|---|---|---|
| `demo-sandbox` | PASS, but incomplete | A fresh-state sample reset and opened no real workspace database; it does not preload a real licence, which leaves F-4-1 untested |
| `sample-content` | PASS | 12 records, three source files, and one named open check appeared |
| `csv-import` | PASS | Invalid dates and blank amounts were rejected; two valid imports accumulated |
| `period-integrity` | PASS | Boundary dates imported; a mixed outside-period file added no rows |
| `source-file-size` | PASS | 10 MiB attached; 10 MiB plus one byte was rejected without replacement |
| `encrypted-pack` | PASS | Wrong password failed; correct password opened required entries and valid SHA-256 values |
| `free-evidence-pack` | PASS | Import, custom check, attachment, and encrypted export completed without a licence |
| `local-only` | PASS | A real record persisted in IndexedDB and the fresh flow remained same-origin |
| `offline-reload` | PASS | The cached demo reloaded offline and exported its encrypted pack |
| `custom-checklist` | PASS | An unlicensed custom check survived reload |
| `readiness` | PASS | The named gap appeared and completion changed the state to ready |
| `standalone-install` | PASS | Manifest mode, start URL, and 192/512 icons matched the claim |
| `paid-license` | PASS | A recorded valid API response enabled saved cover notes and matched the billing API request |
| `checkout-unavailable` | PASS | Public routes had no price, checkout URL, or purchase action |
| `no-tax-submission` | PASS | Demo export and real workspace exposed no submission control or HMRC request |
| `artwork-provenance` | PASS | Landing and 404 footers showed the declared provenance sentence |

No claim command failed and no declared claim was left untested. F-4-1 is a
sandbox scenario omitted by the declared test, not a false report of the
command result. All other landing and README claim-like sentences map to the
entries above; I found no separate unlisted claim.

The clean clone also passed `npm test` (9 unit and 36 browser tests), `npm run
build`, and `npm run lint`. The same 36 browser tests passed against
production. The live URL verifier passed. The live performance test observed
1,752 ms mobile LCP, 24 ms interaction time, 2,119 B initial JavaScript, and
5,421 B CSS.

## Earlier findings retested

I read every earlier `review-*.md`, `polish-*.md`, and the prior handoff. Each
finding was checked in current source and on production:

| Earlier id | Current live and code result |
|---|---|
| `F-1-1` | FIXED — plain unavailable-licence copy and `checkout-unavailable` remain |
| `F-1-2` | FIXED — “versioned evidence checklist” is absent |
| `F-1-3` | FIXED for its exact scope — 404 description, canonical, social metadata, Workspace, Privacy, Terms, and shared footer remain; F-4-10 is new |
| `F-1-4` | FIXED — “Readiness preview” remains |
| `F-1-5` | FIXED — “The product itself” remains absent |
| `F-1-6` | FIXED — the no-submission section is explicit |
| `F-1-7` | FIXED — the source-file caption remains concrete |
| `F-1-8` | FIXED — README introduction remains split below 22 words |
| `F-2-1` | FIXED for workspace copy — demo says it resets and real workspace says it saves; F-4-1 is a separate storage-path defect |
| `F-2-2` | FIXED — exported artifact is consistently “evidence pack” |
| `F-2-3` | FIXED — “Supported edition” remains absent |
| `F-2-4` | FIXED — “app shell” remains absent |
| `F-2-5` | FIXED — old “Generated art disclosed” wording is absent |
| `F-3-1` | FIXED — `no-tax-submission` is declared and passes |
| `F-3-2` | FIXED — the complete free workflow is declared and passes |
| `F-3-3` | FIXED — the billing API destination is declared and its request assertion passes |
| `F-3-4` | FIXED — artwork provenance is declared and tagged |
| `F-3-5` | FIXED — sample contents are concrete and declared |
| `F-3-6` | FIXED — “core pack” is absent from public copy |
| `F-3-7` | FIXED — README Privacy points to the live product page |

No earlier ID is reopened. The two blocking defects and eight minor findings
are new results from the full round-four checklist.

## Structure, accessibility, links, and identity

- `/`, `/demo`, `/workspace`, `/privacy`, and `/terms` return 200. The tested
  unknown route returns the designed static 404 with HTTP 404.
- Each route has one h1, one main, ordered headings, a route-specific title,
  description, canonical, OG/Twitter metadata, and SVG favicon. App routes
  also include the apple-touch icon; F-4-10 records the 404 exception.
- `robots.txt`, `sitemap.xml`, manifest, icons, and social image return 200.
  Every crawled internal link and the Param Factory external link returned
  200; the mail link and skip fragments are explicit.
- Direct deep links work. Client navigation, Back, and Forward restore the
  correct route, focus its h1, and update the polite announcement. F-4-2
  records the missing scroll restoration.
- Cold keyboard Tab reaches the skip link. Space toggles a checklist item.
  File inputs show a visible focus ring. Mobile 390 px, 200% text reflow,
  touch targets, reduced motion, and sticky demo controls pass.
- Playwright Axe integration found no serious or critical issue on the five
  product routes and 404. The URL verifier found no missing title, language,
  main, image alternative, or button label. No unexpected console error was
  observed.
- Security headers include the matching CSP, `frame-ancestors` as a response
  header, `X-Content-Type-Options`, and `Referrer-Policy`.
- The paper-ledger palette, asymmetric editorial first screen, cut-paper moon
  scene, clipped sheets, serif display type, and restrained paper-rise motion
  are recognisably specific to this product. It is not a generic SaaS
  template. F-4-7 through F-4-9 concern plain 404 wording and header reuse, not
  the distinct visual direction.

## Missed leverage

No additional AI, sync, import, or export feature is clearly implied. The
brief asks for categorised CSV import, source-file attachment, a readiness
check, and ZIP/CSV/PDF export; each exists. Sending private bookkeeping data to
an AI gateway would add privacy and cost without an obvious required task.
Sync would contradict the deliberate local-first scope unless the product
introduced accounts and a separate consent model.

## What would make this perfect

Resolve F-4-1 through F-4-10. The essential repairs are to make both demo URLs
completely blind to the real licence namespace and to restore per-history-entry
scroll positions. Then replace the remaining jargon and 404 metaphors, reuse
the full header/icon contract on the 404, extend the missing regression tests,
and rerun every claim plus this complete review from fresh contexts. A PASS
requires zero findings.
