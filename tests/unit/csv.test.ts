import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { isGregorianDate, parseCsvLine, parseTransactionsCsv, transactionsToCsv } from "../../src/csv";
import { sampleWorkspace } from "../../src/sample";
import { assessReadiness, buildSummaryPdf } from "../../src/export";

describe("CSV records", () => {
  it("reads commas and escaped quotes", () => {
    expect(parseCsvLine('2026-04-08,"Client, North","A ""draft"""')).toEqual(["2026-04-08", "Client, North", 'A "draft"']);
  });

  it("reports missing columns", () => {
    expect(parseTransactionsCsv("date,description\n2026-04-01,Sale").errors[0]).toContain("amount, category");
  });

  it("rejects overflow and non-leap dates without changing the valid record", () => {
    const result = parseTransactionsCsv([
      "date,description,amount,category",
      "2026-02-30,Impossible day,25,Sales",
      "2026-02-29,Non-leap day,10,Sales",
      "2024-02-29,Leap day,5,Sales"
    ].join("\n"));
    expect(result.errors).toEqual([
      "Row 2 has an invalid date. Use YYYY-MM-DD.",
      "Row 3 has an invalid date. Use YYYY-MM-DD."
    ]);
    expect(result.rows.map(row => row.description)).toEqual(["Leap day"]);
    expect(isGregorianDate("2024-02-29")).toBe(true);
    expect(isGregorianDate("2026-02-30")).toBe(false);
  });

  it("rejects blank and whitespace-only amounts instead of treating them as zero", () => {
    const result = parseTransactionsCsv([
      "date,description,amount,category",
      "2026-04-06,Blank amount,,Sales",
      "2026-04-07,Whitespace amount,   ,Sales",
      "2026-04-08,Zero is valid,0,Sales"
    ].join("\n"));
    expect(result.errors).toEqual([
      "Row 2 has an invalid amount.",
      "Row 3 has an invalid amount."
    ]);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].amount).toBe(0);
  });

  it("accepts period boundaries and rejects every row outside them", () => {
    const result = parseTransactionsCsv([
      "date,description,amount,category",
      "2026-04-05,Before the period,10,Sales",
      "2026-04-06,First boundary,20,Sales",
      "2026-07-05,Last boundary,30,Sales",
      "2026-07-06,After the period,40,Sales"
    ].join("\n"), { start: "2026-04-06", end: "2026-07-05" });
    expect(result.errors).toEqual([
      "Row 2 is outside the selected period (2026-04-06 to 2026-07-05).",
      "Row 5 is outside the selected period (2026-04-06 to 2026-07-05)."
    ]);
    expect(result.rows.map(row => row.description)).toEqual(["First boundary", "Last boundary"]);
  });

  it("round trips transaction values", () => {
    const original = sampleWorkspace().transactions;
    const parsed = parseTransactionsCsv(transactionsToCsv(original));
    expect(parsed.errors).toEqual([]);
    expect(parsed.rows).toHaveLength(original.length);
    expect(parsed.rows[0].description).toBe(original[0].description);
  });
});

describe("evidence pack output", () => {
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

describe("claim contract", () => {
  it("declares each claim tag exactly once", async () => {
    const claims = JSON.parse(await readFile(new URL("../../.factory/claims.json", import.meta.url), "utf8")) as Array<{ id: string; test: string }>;
    const browserTests = await readFile(new URL("../e2e/claims.spec.ts", import.meta.url), "utf8");
    expect(new Set(claims.map(claim => claim.id)).size).toBe(claims.length);
    for (const claim of claims) {
      expect(claim.test).toContain(`@claim:${claim.id}`);
      expect(browserTests.split(`@claim:${claim.id}`).length - 1, claim.id).toBe(1);
    }
  });
});
