import type { Workspace } from "./types";
import { DEFAULT_CHECKLIST } from "./types";

const rows: Array<[string, string, number, string, string]> = [
  ["2026-04-08", "North Street Studio invoice 1042", 1280, "Sales", "INV-1042"],
  ["2026-04-12", "Paper and printer supplies", -48.9, "Office costs", "RCPT-211"],
  ["2026-04-30", "April bank interest", 3.14, "Other income", "BANK-APR"],
  ["2026-05-04", "Bramble & Co invoice 1043", 760, "Sales", "INV-1043"],
  ["2026-05-09", "Train to client workshop", -67.5, "Travel", "TKT-0509"],
  ["2026-05-16", "Workshop room hire", -180, "Premises", "RCPT-239"],
  ["2026-05-28", "Field House invoice 1044", 940, "Sales", "INV-1044"],
  ["2026-06-02", "Professional indemnity insurance", -126, "Insurance", "POL-622"],
  ["2026-06-11", "Website hosting", -18, "Advertising", "WEB-0611"],
  ["2026-06-19", "Bramble & Co invoice 1045", 420, "Sales", "INV-1045"],
  ["2026-06-23", "Mobile bill business share", -21.4, "Phone", "TEL-JUN"],
  ["2026-07-03", "Accountant bookkeeping review", -95, "Professional fees", "ACC-0703"]
];

export function sampleWorkspace(): Workspace {
  return {
    version: 1,
    traderName: "Rowan Field Studio",
    periodName: "Quarter 1 · 2026–27",
    periodStart: "2026-04-06",
    periodEnd: "2026-07-05",
    coverNote: "Please check the mixed-use mobile cost and confirm the travel treatment.",
    transactions: rows.map(([date, description, amount, category, reference], index) => ({
      id: `sample-${index + 1}`, date, description, amount, category, reference
    })),
    checklist: DEFAULT_CHECKLIST.map((item, index) => ({ ...item, done: index !== 3 })),
    documents: [
      { id: "sample-statement", name: "bank-statement-apr-jun.txt", type: "text/plain", size: 62, addedAt: "2026-07-05T10:00:00.000Z", data: new Blob(["Sample bank statement index. Replace with the original statement."], { type: "text/plain" }) },
      { id: "sample-invoices", name: "sales-invoice-index.txt", type: "text/plain", size: 58, addedAt: "2026-07-05T10:01:00.000Z", data: new Blob(["Sample index: invoices 1042, 1043, 1044 and 1045."], { type: "text/plain" }) },
      { id: "sample-expenses", name: "expense-receipt-index.txt", type: "text/plain", size: 52, addedAt: "2026-07-05T10:02:00.000Z", data: new Blob(["Sample index of receipts. One source receipt is missing."], { type: "text/plain" }) }
    ],
    updatedAt: "2026-07-05T10:02:00.000Z"
  };
}
