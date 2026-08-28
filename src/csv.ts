import type { Transaction } from "./types";

export type CsvResult = { rows: Transaction[]; errors: string[] };

export function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"' && quoted && line[index + 1] === '"') { value += '"'; index += 1; }
    else if (character === '"') quoted = !quoted;
    else if (character === "," && !quoted) { cells.push(value.trim()); value = ""; }
    else value += character;
  }
  cells.push(value.trim());
  return cells;
}

/** Accept only real Gregorian calendar dates, not dates that JavaScript normalises. */
export function isGregorianDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  if (year < 1 || month < 1 || month > 12 || day < 1) return false;
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= daysInMonth[month - 1];
}

export function parseTransactionsCsv(input: string): CsvResult {
  const lines = input.replace(/^\uFEFF/, "").split(/\r?\n/).filter(line => line.trim());
  if (lines.length < 2) return { rows: [], errors: ["The CSV needs a header row and at least one record."] };
  const headers = parseCsvLine(lines[0]).map(header => header.toLowerCase().replace(/\s+/g, "_"));
  const required = ["date", "description", "amount", "category"];
  const missing = required.filter(name => !headers.includes(name));
  if (missing.length) return { rows: [], errors: [`The CSV is missing: ${missing.join(", ")}.`] };
  const rows: Transaction[] = [];
  const errors: string[] = [];
  lines.slice(1).forEach((line, offset) => {
    const rowNumber = offset + 2;
    const cells = parseCsvLine(line);
    const read = (name: string) => cells[headers.indexOf(name)]?.trim() ?? "";
    const amountText = read("amount").replace(/[£,]/g, "").trim();
    const amount = Number(amountText);
    const date = read("date");
    if (!isGregorianDate(date)) errors.push(`Row ${rowNumber} has an invalid date. Use YYYY-MM-DD.`);
    else if (!read("description")) errors.push(`Row ${rowNumber} needs a description.`);
    else if (!read("category")) errors.push(`Row ${rowNumber} needs a category.`);
    else if (!amountText || !Number.isFinite(amount)) errors.push(`Row ${rowNumber} has an invalid amount.`);
    else rows.push({ id: crypto.randomUUID(), date, description: read("description"), amount, category: read("category"), reference: read("reference") });
  });
  return { rows, errors };
}

const quote = (value: string | number) => {
  const text = String(value);
  const unsafeFormula = /^[=+@]/.test(text) || (/^-/.test(text) && !/^-\d+(\.\d+)?$/.test(text));
  const safe = typeof value === "string" && unsafeFormula ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
};

export function transactionsToCsv(rows: Transaction[]): string {
  const header = "date,description,amount,category,reference";
  return [header, ...rows.map(row => [row.date, row.description, row.amount.toFixed(2), row.category, row.reference].map(quote).join(","))].join("\r\n");
}

export const CSV_TEMPLATE = "date,description,amount,category,reference\r\n2026-04-06,Example client invoice,500.00,Sales,INV-001\r\n2026-04-07,Example business expense,-25.00,Office costs,RCPT-001\r\n";
