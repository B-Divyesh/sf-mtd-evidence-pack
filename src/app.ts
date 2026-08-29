import type { Workspace } from "./types";
import { emptyWorkspace } from "./types";
import { sampleWorkspace } from "./sample";
import { loadWorkspace, saveWorkspace, deleteWorkspace } from "./storage";
import { parseTransactionsCsv, CSV_TEMPLATE } from "./csv";
import { assessReadiness } from "./readiness";
import { firstOversizedSourceFile, MAX_SOURCE_FILE_LABEL } from "./files";
import { downloadBlob } from "./download";
import { captureReturnedLicense, hasCachedLicense, restoreLicense, verifyLicense } from "./license";

const app = document.querySelector<HTMLDivElement>("#app")!;
let workspace: Workspace = emptyWorkspace();
let demoMode = false;
let loaded = false;
let licensed = false;
let statusMessage = "";
let errorMessage = "";
let licenseNotice = "";
let shouldScrollTop = false;
let initialRouteOpened = (window as typeof window & { __mtdClientNavigation?: boolean }).__mtdClientNavigation === true;

const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]!);
const money = (value: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(value);
const isDemoRoute = () => location.pathname === "/demo" || new URLSearchParams(location.search).get("demo") === "1";
const metadataFor = (path: string) => isDemoRoute() ? {
  title: "Demo — MTD Evidence Pack",
  description: "Try one sample bookkeeping quarter. Sample changes are not saved."
} : ({
  "/": { title: "MTD Evidence Pack — prepare quarterly records", description: "Import bookkeeping CSV records, check the quarter and export an encrypted evidence pack for your accountant or filing software." },
  "/workspace": { title: "Workspace — MTD Evidence Pack", description: "Prepare a local quarterly evidence pack from bookkeeping records and source files." },
  "/privacy": { title: "Privacy — MTD Evidence Pack", description: "Learn how MTD Evidence Pack stores local browser data and licence details." },
  "/terms": { title: "Terms — MTD Evidence Pack", description: "Read the terms for using MTD Evidence Pack to organise local records." }
}[path] ?? { title: "Page not found — MTD Evidence Pack", description: "The requested MTD Evidence Pack page could not be found." });

function setRouteMetadata(path: string): void {
  const metadata = metadataFor(path);
  document.title = metadata.title;
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  const canonicalPath = isDemoRoute() ? "/demo" : path;
  if (canonical) canonical.href = `https://mtd-evidence-pack.sociobot.in${canonicalPath === "/" ? "/" : canonicalPath}`;
  const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (description) description.content = metadata.description;
  for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) {
    const element = document.querySelector<HTMLMetaElement>(selector);
    if (element) element.content = metadata.title;
  }
  for (const selector of ['meta[property="og:description"]', 'meta[name="twitter:description"]']) {
    const element = document.querySelector<HTMLMetaElement>(selector);
    if (element) element.content = metadata.description;
  }
  const ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
  if (ogUrl) ogUrl.content = `https://mtd-evidence-pack.sociobot.in${canonicalPath}`;
}

function navigate(path: string, replace = false): void {
  shouldScrollTop = true;
  if (replace) history.replaceState({}, "", path); else history.pushState({}, "", path);
  void openRoute();
}

function header(): string {
  return `<a class="skip-link" href="#main">Skip to main content</a>
  <header class="site-header">
    <a class="wordmark" href="/" data-link aria-label="MTD Evidence Pack home"><span class="moon-mark" aria-hidden="true"></span><span>MTD<br>Evidence Pack</span></a>
    <nav aria-label="Main navigation">
      <a href="/demo" data-link>Demo</a><a href="/workspace" data-link>Workspace</a><a href="/privacy" data-link>Privacy</a>
    </nav>
    <span class="network-state" data-network>${navigator.onLine ? "Online" : "Offline — saved work stays available"}</span>
  </header>`;
}

function footer(): string {
  return `<footer class="site-footer"><p>Prepare a quarterly evidence pack on your device.<span class="art-credit">Hero artwork was generated for this product.</span></p><nav aria-label="Footer navigation"><a href="/privacy" data-link>Privacy</a><a href="/terms" data-link>Terms</a><a href="https://sociobot.in" rel="external">Built by Param Factory <span class="sr-only">(external site)</span></a></nav><p class="build-id">v1.0.9</p></footer>`;
}

function shell(content: string, banner = ""): string {
  return `${header()}${banner}<main id="main" tabindex="-1">${content}</main>${footer()}<div class="live-region" aria-live="polite" aria-atomic="true">${escapeHtml(statusMessage || errorMessage)}</div><div id="route-announcer" class="sr-only" aria-live="polite"></div>`;
}

function demoBanner(): string {
  return `<aside class="demo-banner" aria-label="Demo mode"><strong>Demo — sample data, nothing is saved</strong><div><button type="button" class="text-button" data-action="reset-demo">Reset demo</button><button type="button" class="text-button" data-action="start-real">Start for real</button></div></aside>`;
}

function landingPage(): string {
  return shell(`<section class="hero editorial-grid">
    <div class="hero-copy paper-rise">
      <p class="eyebrow">Local quarterly record check</p>
      <h1>Prepare your quarterly evidence pack</h1>
      <p class="lede">For UK sole traders who keep local books and need a clear pack for an accountant or filing software.</p>
      <div class="hero-action"><a class="button primary" href="/?demo=1" data-link>Try it with sample data</a><span>Loads one sample quarter. Nothing is saved.</span></div>
      <ul class="plain-facts" aria-label="Product facts"><li>Works after your first visit</li><li>Records stay on this device</li><li>Core pack export is free</li></ul>
    </div>
    <figure class="hero-art paper-rise"><picture><source media="(max-width: 700px)" srcset="/assets/hero-ledger-390.webp"><img src="/assets/hero-ledger.webp" width="1280" height="853" alt="Four paper filing houses connected by a coral path under a paper moon." fetchpriority="high" decoding="async"></picture><figcaption>Keep source files with the records for one selected quarter.</figcaption></figure>
  </section>
  <section class="preview-section" aria-labelledby="preview-title"><div class="section-number">Readiness preview</div><div><h2 id="preview-title">See what is missing before export</h2><p>The checklist and records stay beside each other. Open items remain named.</p></div>
    <div class="mini-workspace"><div class="mini-head"><strong>Quarter 1 · 2026–27</strong><span>6 of 7 checked</span></div><div class="mini-grid"><div><span class="large-number">12</span><span>bookkeeping records</span></div><div><span class="large-number">3</span><span>source files</span></div><div class="open-item"><span aria-hidden="true">○</span><span>Invoices and receipts can be matched to records</span></div></div></div>
  </section>
  <section class="steps" aria-labelledby="steps-title"><p class="eyebrow">How it works</p><h2 id="steps-title">Build the pack in three passes</h2><ol><li><span>01</span><div><h3>Set the period</h3><p>Name the quarter and check its start and end dates.</p></div></li><li><span>02</span><div><h3>Import and match</h3><p>Add a categorised CSV. Attach statements, invoices, receipts, or an index.</p></div></li><li><span>03</span><div><h3>Check and export</h3><p>Close each checklist item. Download one password-protected ZIP with CSV, PDF, files, and hashes.</p></div></li></ol></section>
  <section class="limits night-section" aria-labelledby="limits-title"><div><p class="eyebrow">What this tool does not do</p><h2 id="limits-title">Prepare records before submission</h2></div><p>It does not submit tax returns. Use compatible filing software or an accountant when you are ready to submit.</p></section>
  <section class="pricing" aria-labelledby="licence-title"><div><p class="eyebrow">Free core and existing licences</p><h2 id="licence-title">Keep the core pack free</h2><p>Import records, maintain your checklist, and export the encrypted evidence pack without paying.</p></div><div class="price-ticket"><h3>Restore a licence</h3><p>Existing licence holders can restore saved cover notes. New licences are not currently available.</p><form data-form="restore-license" class="restore-form"><label for="landing-license">Paste your licence</label><input id="landing-license" name="license" autocomplete="off" required><button class="button small" type="submit" aria-label="Verify licence">Verify licence</button></form></div></section>`, "");
}

function overview(workspace: Workspace): string {
  const readiness = assessReadiness(workspace);
  return `<section class="quarter-overview" aria-label="Quarter status"><div><p class="eyebrow">Current evidence pack</p><h2>${escapeHtml(workspace.periodName)}</h2><p>${escapeHtml(workspace.periodStart)} to ${escapeHtml(workspace.periodEnd)}</p></div><div class="readiness-gauge"><strong>${readiness.percent}%</strong><span>${readiness.complete} of ${readiness.total} checklist items</span><progress max="100" value="${readiness.percent}">${readiness.percent}%</progress></div><dl><div><dt>Records</dt><dd>${workspace.transactions.length}</dd></div><div><dt>Source files</dt><dd>${workspace.documents.length}</dd></div><div><dt>Open checks</dt><dd>${readiness.gaps.length}</dd></div></dl></section>`;
}

function workspacePage(): string {
  if (!loaded) return shell(`<section class="loading-page"><p class="eyebrow">Local workspace</p><h1>Open your evidence workspace</h1><p>Loading records from this device…</p></section>`, demoMode ? demoBanner() : "");
  const readiness = assessReadiness(workspace);
  const income = workspace.transactions.filter(row => row.amount > 0).reduce((sum, row) => sum + row.amount, 0);
  const expenses = Math.abs(workspace.transactions.filter(row => row.amount < 0).reduce((sum, row) => sum + row.amount, 0));
  const rows = workspace.transactions.length ? workspace.transactions.map(row => `<tr><td data-label="Date">${escapeHtml(row.date)}</td><td data-label="Description"><strong>${escapeHtml(row.description)}</strong><small>${escapeHtml(row.reference || "No reference")}</small></td><td data-label="Category">${escapeHtml(row.category)}</td><td data-label="Amount" class="number ${row.amount < 0 ? "expense" : "income"}">${money(row.amount)}</td><td><button class="icon-button" type="button" data-remove-row="${escapeHtml(row.id)}" aria-label="Remove ${escapeHtml(row.description)}">×</button></td></tr>`).join("") : `<tr><td colspan="5" class="empty-cell"><strong>No bookkeeping records yet.</strong><span>Import the CSV template or your own categorised file.</span></td></tr>`;
  const docs = workspace.documents.length ? `<ul class="document-list">${workspace.documents.map(document => `<li><span class="file-mark" aria-hidden="true"></span><span><strong>${escapeHtml(document.name)}</strong><small>${Math.max(1, Math.round(document.size / 1024))} KB</small></span><button class="icon-button" type="button" data-remove-document="${escapeHtml(document.id)}" aria-label="Remove ${escapeHtml(document.name)}">×</button></li>`).join("")}</ul>` : `<div class="empty-state"><strong>No source files attached.</strong><p>Add statements, invoices, receipts, or a document index.</p></div>`;
  const checks = workspace.checklist.map(item => `<li><label><input type="checkbox" data-check="${escapeHtml(item.id)}" ${item.done ? "checked" : ""}><span class="check-box" aria-hidden="true"></span><span>${escapeHtml(item.label)}${item.custom ? " <small>Custom</small>" : ""}</span></label>${item.custom ? `<button type="button" class="icon-button" data-remove-check="${escapeHtml(item.id)}" aria-label="Remove ${escapeHtml(item.label)}">×</button>` : ""}</li>`).join("");
  const gapList = readiness.gaps.length ? `<ul>${readiness.gaps.map(gap => `<li>${escapeHtml(gap)}</li>`).join("")}</ul>` : `<p class="all-clear"><span aria-hidden="true">✓</span> No open checks remain.</p>`;
  const supportNotice = licensed || demoMode ? `<p class="licensed-note">Existing licence features are available${demoMode ? " in this sample" : ""}.</p>` : `<aside class="support-nudge">${licenseNotice ? `<p><strong>${escapeHtml(licenseNotice)}</strong></p>` : ""}<p><strong>Already have an existing licence?</strong></p><p>Verify it to restore saved cover notes. The core workspace and encrypted export stay free.</p><form data-form="restore-license" class="restore-form"><label for="workspace-license">Paste your licence</label><input id="workspace-license" name="license" autocomplete="off" required><button class="button small" type="submit" aria-label="Verify licence">Verify licence</button></form></aside>`;

  return shell(`<section class="workspace-title"><p class="eyebrow">Local quarterly workspace</p><h1>Prepare this quarter’s evidence pack</h1><p>${demoMode ? "The sample resets when you reload or leave the demo." : "Your work saves on this device."}</p></section>
    ${overview(workspace)}
    ${errorMessage ? `<div class="message error" role="alert"><strong>That did not work.</strong><p>${escapeHtml(errorMessage)}</p></div>` : ""}
    ${statusMessage ? `<div class="message success" role="status"><p>${escapeHtml(statusMessage)}</p></div>` : ""}
    <section class="work-section" aria-labelledby="period-title"><div class="section-lead"><span>01</span><div><h2 id="period-title">Set the period</h2><p>Use the dates agreed with your accountant or filing software.</p></div></div><form class="form-grid" data-form="period"><label>Trader or business name<input name="traderName" value="${escapeHtml(workspace.traderName)}" autocomplete="organization"></label><label>Period name<input name="periodName" value="${escapeHtml(workspace.periodName)}" required></label><label>Start date<input name="periodStart" type="date" value="${escapeHtml(workspace.periodStart)}" required></label><label>End date<input name="periodEnd" type="date" value="${escapeHtml(workspace.periodEnd)}" required></label></form></section>
    <section class="work-section" aria-labelledby="records-title"><div class="section-lead"><span>02</span><div><h2 id="records-title">Import categorised records</h2><p>Use date, description, amount, category, and optional reference columns.</p></div></div><div class="import-bar"><label class="file-button">Choose CSV<input type="file" accept=".csv,text/csv" data-import-csv></label><button type="button" class="text-button" data-action="download-template">Download CSV template</button><span>Positive amounts are income. Negative amounts are expenses.</span></div><div class="table-summary"><p><strong>${workspace.transactions.length}</strong> records · <span class="income">${money(income)} income</span> · <span class="expense">${money(expenses)} expenses</span></p></div><div class="table-wrap"><table><thead><tr><th>Date</th><th>Description</th><th>Category</th><th class="number">Amount</th><th><span class="sr-only">Actions</span></th></tr></thead><tbody>${rows}</tbody></table></div></section>
    <section class="work-section" aria-labelledby="files-title"><div class="section-lead"><span>03</span><div><h2 id="files-title">Attach source files</h2><p>The encrypted ZIP keeps these files beside the records and manifest.</p></div></div><div class="import-bar"><label class="file-button">Choose source files<input type="file" multiple data-import-docs></label><span>Each file can be up to 10 MB. Add originals or a clear index.</span></div>${docs}</section>
    <section class="work-section" aria-labelledby="check-title"><div class="section-lead"><span>04</span><div><h2 id="check-title">Check the evidence trail</h2><p>Working checklist v1.0 for UK sole traders, 2026–27. Confirm it with your accountant.</p></div></div><ul class="checklist">${checks}</ul><form data-form="custom-check" class="inline-form"><label for="custom-check">Add your own check</label><div><input id="custom-check" name="label" maxlength="100"><button class="button small" type="submit">Add check</button></div></form>${supportNotice}</section>
    <section class="work-section" aria-labelledby="note-title"><div class="section-lead"><span>05</span><div><h2 id="note-title">Leave a cover note</h2><p>Name any point that needs the accountant’s judgement.</p></div></div><label for="cover-note" class="full-label">Cover note<textarea id="cover-note" data-cover-note rows="4" maxlength="600" ${licensed || demoMode ? "" : "disabled"}>${escapeHtml(workspace.coverNote)}</textarea></label>${!licensed && !demoMode ? `<p class="field-note">Cover notes require a verified existing licence. The free export remains available.</p>` : ""}</section>
    <section class="export-section" aria-labelledby="export-title"><div><p class="eyebrow">Final pass</p><h2 id="export-title">Export one encrypted evidence pack</h2><p>The ZIP contains a CSV, PDF summary, source files, manifest, and SHA-256 file hashes.</p><div class="gaps"><h3>${readiness.gaps.length ? `${readiness.gaps.length} open item${readiness.gaps.length === 1 ? "" : "s"}` : "Ready to share"}</h3>${gapList}</div></div><form data-form="export" class="export-form"><label for="pack-password">ZIP password <span>At least 8 characters</span></label><input id="pack-password" name="password" type="password" minlength="8" autocomplete="new-password" required><label for="pack-password-confirm">Repeat password</label><input id="pack-password-confirm" name="confirm" type="password" minlength="8" autocomplete="new-password" required><button class="button primary" type="submit" ${workspace.transactions.length ? "" : "disabled"}>Export encrypted ZIP</button><p>Send the password by a different channel. It is never saved.</p></form></section>
    <section class="danger-zone" aria-labelledby="delete-title"><div><h2 id="delete-title">Delete this workspace</h2><p>This removes records and source files from this browser.</p></div><button class="button danger" type="button" data-action="delete-workspace">Delete local data</button></section>`, demoMode ? demoBanner() : "");
}

function privacyPage(): string { return shell(`<article class="legal-page"><p class="eyebrow">Plain-language policy · 29 August 2026</p><h1>Understand your browser data</h1><p>MTD Evidence Pack works in your browser. The demo uses sample data. Review the data controls in your browser before using the workspace with your own records.</p><h2>Manage local data</h2><p>Use “Delete local data” in the workspace to remove its local record. Browser site-data settings can also remove local workspace data. Exported ZIP files are outside the browser and remain yours to manage.</p><h2>Licence checks</h2><p>Restoring an existing licence sends its token to Sociobot. The browser stores the token and its daily verification result.</p><h2>Contact</h2><p>Questions can be sent to <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p></article>`); }

function termsPage(): string { return shell(`<article class="legal-page"><p class="eyebrow">Terms · 29 August 2026</p><h1>Use this tool to organise records</h1><p>MTD Evidence Pack helps you prepare a local evidence pack. Obtain suitable advice and use compatible software or an authorised person where needed.</p><h2>Your responsibility</h2><p>Check dates, categories, records, and checklist items before sharing the pack. Keep original records. Use compatible software or an authorised person for any required submission.</p><h2>Existing licences</h2><p>A verified existing licence enables saved cover notes. An expired or revoked licence stops that feature. New licences are not currently available. The core export remains available.</p><h2>Availability and liability</h2><p>The tool is provided without a promise that it fits every tax situation. To the extent allowed by law, we are not liable for tax decisions, missed deadlines, or lost local data.</p><h2>Fair use</h2><p>Do not attempt to disrupt the service or use it for unlawful records.</p></article>`); }

function notFoundPage(): string { return shell(`<section class="not-found"><div class="lost-moon" aria-hidden="true"></div><p class="eyebrow">404 · Misfiled page</p><h1>This page is not in the pack</h1><p>The address may be old or incomplete.</p><a class="button primary" href="/" data-link>Return to the home page</a></section>`); }

async function persist(successMessage = "Saved on this device."): Promise<void> {
  if (demoMode) { statusMessage = successMessage; return; }
  try { await saveWorkspace(workspace); statusMessage = successMessage; }
  catch { statusMessage = ""; errorMessage = "The browser could not save this change. Check available site storage."; }
}

function announceRoute(): void {
  const heading = document.querySelector<HTMLHeadingElement>("h1");
  if (!heading) return;
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  document.querySelector("#route-announcer")!.textContent = heading.textContent ?? "Page changed";
  if (shouldScrollTop) scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  shouldScrollTop = false;
}

async function openRoute(): Promise<void> {
  const path = location.pathname;
  const wasDemo = demoMode;
  demoMode = isDemoRoute();
  if (wasDemo && !demoMode) loaded = false;
  statusMessage = ""; errorMessage = "";
  if (demoMode) { workspace = sampleWorkspace(); loaded = true; }
  else if (path === "/workspace" && !loaded) {
    render();
    try { workspace = await loadWorkspace(); } catch { workspace = emptyWorkspace(); errorMessage = "Stored records could not be opened. Start again or clear this site’s storage."; }
    loaded = true;
  }
  render();
  setRouteMetadata(path);
  if (initialRouteOpened) requestAnimationFrame(announceRoute);
  initialRouteOpened = true;
}

function render(): void {
  const path = location.pathname;
  app.innerHTML = isDemoRoute() ? workspacePage() : path === "/" ? landingPage() : path === "/workspace" ? workspacePage() : path === "/privacy" ? privacyPage() : path === "/terms" ? termsPage() : notFoundPage();
}

app.addEventListener("click", event => {
  const target = event.target as HTMLElement;
  const skipLink = target.closest<HTMLAnchorElement>("a.skip-link");
  if (skipLink) {
    event.preventDefault();
    const main = document.querySelector<HTMLElement>("#main");
    main?.focus({ preventScroll: true });
    main?.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    return;
  }
  const link = target.closest<HTMLAnchorElement>("a[data-link]");
  if (link && link.origin === location.origin) { event.preventDefault(); navigate(link.pathname + link.search); return; }
  const action = target.closest<HTMLElement>("[data-action]")?.dataset.action;
  if (action === "reset-demo") { workspace = sampleWorkspace(); statusMessage = "Sample data reset."; errorMessage = ""; render(); }
  if (action === "start-real") { loaded = false; navigate("/workspace"); }
  if (action === "download-template") downloadBlob(new Blob([CSV_TEMPLATE], { type: "text/csv" }), "mtd-evidence-pack-template.csv");
  if (action === "delete-workspace") {
    if (demoMode) { workspace = sampleWorkspace(); statusMessage = "Sample data reset."; render(); }
    else if (confirm("Delete all local records and source files from this browser?")) void deleteWorkspace().then(() => { workspace = emptyWorkspace(); statusMessage = "Local workspace deleted."; render(); });
  }
  const rowId = target.closest<HTMLElement>("[data-remove-row]")?.dataset.removeRow;
  if (rowId) { workspace.transactions = workspace.transactions.filter(row => row.id !== rowId); void persist().then(render); }
  const documentId = target.closest<HTMLElement>("[data-remove-document]")?.dataset.removeDocument;
  if (documentId) { workspace.documents = workspace.documents.filter(document => document.id !== documentId); void persist().then(render); }
  const checkId = target.closest<HTMLElement>("[data-remove-check]")?.dataset.removeCheck;
  if (checkId) { workspace.checklist = workspace.checklist.filter(item => item.id !== checkId); void persist().then(render); }
});

app.addEventListener("change", async event => {
  const input = event.target as HTMLInputElement;
  if (input.matches("[data-check]")) {
    const item = workspace.checklist.find(check => check.id === input.dataset.check);
    if (item) item.done = input.checked;
    await persist(); render(); return;
  }
  if (input.matches("[data-import-csv]") && input.files?.[0]) {
    const result = parseTransactionsCsv(await input.files[0].text(), { start: workspace.periodStart, end: workspace.periodEnd });
    if (result.errors.length) { statusMessage = ""; errorMessage = `${result.errors.slice(0, 3).join(" ")} Fix the CSV and import it again.`; }
    else {
      workspace.transactions.push(...result.rows);
      errorMessage = "";
      await persist(`${result.rows.length} record${result.rows.length === 1 ? "" : "s"} added. ${workspace.transactions.length} total.`);
    }
    render(); return;
  }
  if (input.matches("[data-import-docs]") && input.files) {
    const files = Array.from(input.files);
    const tooLarge = firstOversizedSourceFile(files);
    if (tooLarge) { statusMessage = ""; errorMessage = `${tooLarge.name} is over ${MAX_SOURCE_FILE_LABEL}. Choose a smaller file.`; }
    else {
      workspace.documents.push(...files.map(file => ({ id: crypto.randomUUID(), name: file.name, type: file.type || "application/octet-stream", size: file.size, addedAt: new Date().toISOString(), data: file })));
      errorMessage = ""; await persist(`${files.length} source file${files.length === 1 ? "" : "s"} attached.`);
    }
    render(); return;
  }
  if (input.form?.dataset.form === "period") {
    const data = new FormData(input.form);
    workspace.traderName = String(data.get("traderName") ?? ""); workspace.periodName = String(data.get("periodName") ?? ""); workspace.periodStart = String(data.get("periodStart") ?? ""); workspace.periodEnd = String(data.get("periodEnd") ?? "");
    if (workspace.periodStart > workspace.periodEnd) { statusMessage = ""; errorMessage = "The start date is after the end date. Change one of the dates."; } else { errorMessage = ""; await persist(); }
    render();
  }
});

app.addEventListener("focusin", event => {
  const input = event.target as HTMLInputElement;
  if (!input.matches("[data-import-csv], [data-import-docs]")) return;
  input.closest<HTMLElement>(".file-button")?.scrollIntoView({
    block: "center",
    inline: "nearest",
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
  });
});

app.addEventListener("input", event => {
  const element = event.target as HTMLTextAreaElement;
  if (element.matches("[data-cover-note]")) { workspace.coverNote = element.value; void persist(); }
});

app.addEventListener("submit", async event => {
  const form = event.target as HTMLFormElement;
  event.preventDefault();
  if (form.dataset.form === "custom-check") {
    const label = String(new FormData(form).get("label") ?? "").trim();
    if (label) { workspace.checklist.push({ id: crypto.randomUUID(), label, done: false, custom: true }); await persist(); statusMessage = "Custom check added."; render(); }
  }
  if (form.dataset.form === "export") {
    const data = new FormData(form); const password = String(data.get("password") ?? ""); const confirmPassword = String(data.get("confirm") ?? "");
    if (password.length < 8) { errorMessage = "The ZIP password needs at least 8 characters. Enter a longer password."; render(); return; }
    if (password !== confirmPassword) { errorMessage = "The passwords do not match. Enter the same password twice."; render(); return; }
    const button = form.querySelector<HTMLButtonElement>("button")!; button.disabled = true; button.textContent = "Building encrypted ZIP…";
    try {
      const { buildEvidenceZip } = await import("./export");
      const blob = await buildEvidenceZip(workspace, password);
      downloadBlob(blob, `evidence-pack-${workspace.periodEnd || "quarter"}.zip`);
      statusMessage = "Encrypted ZIP exported. Send its password separately."; errorMessage = "";
    }
    catch { errorMessage = "The encrypted ZIP could not be built. Try again with this page open."; }
    render();
  }
  if (form.dataset.form === "restore-license") {
    const token = String(new FormData(form).get("license") ?? "");
    if (!token) return;
    const button = form.querySelector<HTMLButtonElement>("button")!; button.disabled = true; button.textContent = "Checking…";
    licensed = await restoreLicense(token); statusMessage = licensed ? "Licence verified. Supported features are available." : ""; errorMessage = licensed ? "" : "The licence was not accepted. Check the token and try again."; render();
  }
});

window.addEventListener("popstate", () => { shouldScrollTop = false; loaded = location.pathname === "/workspace" ? loaded : false; void openRoute(); });
window.addEventListener("online", () => { const state = document.querySelector<HTMLElement>("[data-network]"); if (state) state.textContent = "Online"; });
window.addEventListener("offline", () => { const state = document.querySelector<HTMLElement>("[data-network]"); if (state) state.textContent = "Offline — saved work stays available"; });

captureReturnedLicense();
licensed = hasCachedLicense();
void openRoute();
if (location.pathname !== "/demo") void verifyLicense().then(valid => {
  if (licensed && !valid) licenseNotice = "This licence is no longer active.";
  if (valid !== licensed) { licensed = valid; render(); }
});
