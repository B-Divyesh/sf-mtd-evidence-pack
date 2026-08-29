import type { Workspace } from "./types";
import { transactionsToCsv } from "./csv";
import { assessReadiness } from "./readiness";
export { assessReadiness } from "./readiness";
export { downloadBlob } from "./download";

function ascii(value: string): string {
  return value.normalize("NFKD").replace(/[£]/g, "GBP ").replace(/[–—]/g, "-").replace(/[^\x20-\x7E]/g, "?");
}

function pdfEscape(value: string): string { return ascii(value).replace(/([\\()])/g, "\\$1"); }

export function buildSummaryPdf(workspace: Workspace): Blob {
  const readiness = assessReadiness(workspace);
  const income = workspace.transactions.filter(row => row.amount > 0).reduce((sum, row) => sum + row.amount, 0);
  const expenses = Math.abs(workspace.transactions.filter(row => row.amount < 0).reduce((sum, row) => sum + row.amount, 0));
  const categoryTotals = new Map<string, number>();
  workspace.transactions.forEach(row => categoryTotals.set(row.category, (categoryTotals.get(row.category) ?? 0) + row.amount));
  const lines = [
    "MTD EVIDENCE PACK - QUARTERLY RECORDS",
    workspace.traderName || "Trader name not provided",
    `${workspace.periodName} | ${workspace.periodStart} to ${workspace.periodEnd}`,
    "",
    "PACK STATUS",
    `${readiness.complete} of ${readiness.total} checklist items complete (${readiness.percent}%)`,
    `${workspace.transactions.length} bookkeeping records | ${workspace.documents.length} source files`,
    "",
    "BOOKKEEPING SUMMARY - NOT A TAX CALCULATION",
    `Income records: GBP ${income.toFixed(2)}`,
    `Expense records: GBP ${expenses.toFixed(2)}`,
    ...Array.from(categoryTotals.entries()).slice(0, 12).map(([category, amount]) => `${category}: GBP ${amount.toFixed(2)}`),
    "",
    "CHECKLIST",
    ...workspace.checklist.slice(0, 14).map(item => `${item.done ? "[x]" : "[ ]"} ${item.label}`),
    "",
    "COVER NOTE",
    workspace.coverNote || "No cover note supplied.",
    "",
    "This pack organises records. It is not tax advice or filing software.",
    "Checklist version: UK sole trader evidence v1.0 (2026-27 working copy).",
    `Created ${new Date().toISOString().slice(0, 10)}.`
  ].slice(0, 48);

  const commands = lines.map((line, index) => index === 0
    ? `BT /F1 15 Tf 58 780 Td (${pdfEscape(line)}) Tj ET`
    : `BT /F1 ${line === line.toUpperCase() && line ? 10 : 9} Tf 58 ${780 - index * 15} Td (${pdfEscape(line.slice(0, 95))}) Tj ET`).join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${new TextEncoder().encode(commands).length} >>\nstream\n${commands}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
  ];
  let content = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => { offsets.push(new TextEncoder().encode(content).length); content += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xrefOffset = new TextEncoder().encode(content).length;
  content += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  content += offsets.slice(1).map(offset => `${String(offset).padStart(10, "0")} 00000 n \n`).join("");
  content += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new Blob([content], { type: "application/pdf" });
}

async function sha256(blob: Blob): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", await blob.arrayBuffer());
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}

function safeName(name: string): string { return name.replace(/[^a-zA-Z0-9._ -]/g, "_").slice(0, 90) || "document"; }

export async function buildEvidenceZip(workspace: Workspace, password: string): Promise<Blob> {
  if (password.length < 8) throw new Error("Use a password with at least 8 characters.");
  const { configure, ZipWriter, BlobWriter, BlobReader, TextReader } = await import("@zip.js/zip.js");
  configure({ useWebWorkers: false });
  const csv = new Blob([transactionsToCsv(workspace.transactions)], { type: "text/csv" });
  const pdf = buildSummaryPdf(workspace);
  const readiness = assessReadiness(workspace);
  const files = [
    { path: "records/transactions.csv", blob: csv },
    { path: "summary/evidence-pack-summary.pdf", blob: pdf },
    ...workspace.documents.map((document, index) => ({ path: `source-files/${String(index + 1).padStart(2, "0")}-${safeName(document.name)}`, blob: document.data }))
  ];
  const manifest = {
    product: "MTD Evidence Pack",
    formatVersion: 1,
    createdAt: new Date().toISOString(),
    traderName: workspace.traderName,
    period: { name: workspace.periodName, start: workspace.periodStart, end: workspace.periodEnd },
    readiness: { completed: readiness.complete, total: readiness.total, gaps: readiness.gaps },
    recordCount: workspace.transactions.length,
    checklist: workspace.checklist.map(({ label, done }) => ({ label, done })),
    files: await Promise.all(files.map(async file => ({ path: file.path, bytes: file.blob.size, sha256: await sha256(file.blob) }))),
    notice: "This pack organises records. It is not tax advice, filing software, or legal certification."
  };
  const writer = new ZipWriter(new BlobWriter("application/zip"), { password, encryptionStrength: 3 });
  await writer.add("README.txt", new TextReader("Encrypted quarterly evidence pack\n\nOpen this ZIP with the password supplied separately. Check manifest.json for file-change checks (SHA-256). This is a read-only snapshot, not tax advice or filing software.\n"));
  await writer.add("manifest.json", new TextReader(JSON.stringify(manifest, null, 2)));
  for (const file of files) await writer.add(file.path, new BlobReader(file.blob));
  return writer.close();
}
