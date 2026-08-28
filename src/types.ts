export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  reference: string;
};

export type ChecklistItem = {
  id: string;
  label: string;
  done: boolean;
  custom?: boolean;
};

export type EvidenceFile = {
  id: string;
  name: string;
  type: string;
  size: number;
  addedAt: string;
  data: Blob;
};

export type Workspace = {
  version: 1;
  traderName: string;
  periodName: string;
  periodStart: string;
  periodEnd: string;
  coverNote: string;
  transactions: Transaction[];
  checklist: ChecklistItem[];
  documents: EvidenceFile[];
  updatedAt: string;
};

export const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: "sales", label: "All sales records for this period are included", done: false },
  { id: "expenses", label: "Business expenses have a category", done: false },
  { id: "statements", label: "Bank or payment account statements are attached", done: false },
  { id: "receipts", label: "Invoices and receipts can be matched to records", done: false },
  { id: "personal", label: "Personal transactions are excluded or marked", done: false },
  { id: "adjustments", label: "Any adjustments are listed for the accountant", done: false },
  { id: "trail", label: "The original digital records are retained", done: false }
];

export function emptyWorkspace(): Workspace {
  return {
    version: 1,
    traderName: "",
    periodName: "Quarter 1 · 2026–27",
    periodStart: "2026-04-06",
    periodEnd: "2026-07-05",
    coverNote: "",
    transactions: [],
    checklist: DEFAULT_CHECKLIST.map(item => ({ ...item })),
    documents: [],
    updatedAt: new Date().toISOString()
  };
}
