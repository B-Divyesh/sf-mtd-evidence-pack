import { describe, expect, it } from "vitest";
import { parseCsvLine, parseTransactionsCsv, transactionsToCsv } from "../../src/csv";
import { sampleWorkspace } from "../../src/sample";
import { assessReadiness, buildSummaryPdf } from "../../src/export";

describe("CSV records", () => {
  it("reads commas and escaped quotes", () => {
    expect(parseCsvLine('2026-04-08,"Client, North","A ""draft"""')).toEqual(["2026-04-08", "Client, North", 'A "draft"']);
  });

  it("reports missing columns", () => {
    expect(parseTransactionsCsv("date,description\n2026-04-01,Sale").errors[0]).toContain("amount, category");
  });

  it("round trips transaction values", () => {
    const original = sampleWorkspace().transactions;
    const parsed = parseTransactionsCsv(transactionsToCsv(original));
    expect(parsed.errors).toEqual([]);
    expect(parsed.rows).toHaveLength(original.length);
    expect(parsed.rows[0].description).toBe(original[0].description);
  });
});

describe("handoff output", () => {
  it("names every open check", () => {
    const result = assessReadiness(sampleWorkspace());
    expect(result.percent).toBe(86);
    expect(result.gaps).toContain("Invoices and receipts can be matched to records");
  });

  it("builds a PDF document", async () => {
    const pdf = buildSummaryPdf(sampleWorkspace());
    expect(pdf.type).toBe("application/pdf");
    expect(await pdf.text()).toMatch(/^%PDF-1.4/);
    expect(await pdf.text()).toContain("MTD EVIDENCE PACK");
  });
});
