import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";
import { BlobReader, TextWriter, ZipReader } from "@zip.js/zip.js";

test("@claim:demo-sandbox sample changes are not saved", async ({ page }) => {
  await page.goto("/demo");
  const first = page.locator('[data-check="sales"]');
  await expect(first).toBeChecked();
  await first.uncheck();
  await page.reload();
  await expect(page.locator('[data-check="sales"]')).toBeChecked();
  expect(await page.evaluate(async () => (await indexedDB.databases()).map(database => database.name))).not.toContain("mtd-evidence-pack:v1");
  await page.getByRole("button", { name: "Start for real" }).click();
  await expect(page.getByText("No bookkeeping records yet.")).toBeVisible();
});

test("@claim:csv-import imports categorised CSV records", async ({ page }) => {
  await page.goto("/demo");
  await page.locator("[data-import-csv]").setInputFiles({
    name: "quarter.csv", mimeType: "text/csv",
    buffer: Buffer.from("date,description,amount,category,reference\n2026-04-10,Oak Studio invoice,400,Sales,I-1\n2026-04-11,Printer paper,-20,Office costs,R-1\n")
  });
  await expect(page.locator(".message.success").getByText("2 records imported.")).toBeVisible();
  await expect(page.getByText("Oak Studio invoice")).toBeVisible();
  await expect(page.getByText("Printer paper")).toBeVisible();
});

test("@claim:encrypted-pack @claim:free-core-export exports a password-protected ZIP with its listed files", async ({ page }) => {
  await page.goto("/demo");
  await page.locator("#pack-password").fill("correct-horse-26");
  await page.locator("#pack-password-confirm").fill("correct-horse-26");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export encrypted ZIP" }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).not.toBeNull();
  const data = await readFile(path!);
  const archiveBytes = Uint8Array.from(data).buffer;
  const wrongReader = new ZipReader(new BlobReader(new Blob([archiveBytes])), { password: "wrong-password" });
  const wrongEntries = await wrongReader.getEntries();
  expect(wrongEntries[0].encrypted).toBe(true);
  await expect(wrongEntries[0].getData!(new TextWriter())).rejects.toThrow();
  await wrongReader.close();
  const reader = new ZipReader(new BlobReader(new Blob([archiveBytes])), { password: "correct-horse-26" });
  const entries = await reader.getEntries();
  expect(entries.map(entry => entry.filename)).toEqual(expect.arrayContaining(["README.txt", "manifest.json", "records/transactions.csv", "summary/quarterly-handoff.pdf"]));
  expect(entries.some(entry => entry.filename.startsWith("source-files/"))).toBe(true);
  const pdfEntry = entries.find(entry => entry.filename === "summary/quarterly-handoff.pdf")!;
  expect(await pdfEntry.getData!(new TextWriter())).toMatch(/^%PDF-1.4/);
  const manifestEntry = entries.find(entry => entry.filename === "manifest.json")!;
  const manifest = JSON.parse(await manifestEntry.getData!(new TextWriter())) as { recordCount: number; files: Array<{ sha256: string }> };
  expect(manifest.recordCount).toBe(12);
  expect(manifest.files.every(file => /^[a-f0-9]{64}$/.test(file.sha256))).toBe(true);
  expect(await page.evaluate(password => Object.values(localStorage).includes(password), "correct-horse-26")).toBe(false);
  await reader.close();
});

test("@claim:local-only demo activity makes no cross-origin request", async ({ page }) => {
  const origins = new Set<string>();
  page.on("request", request => origins.add(new URL(request.url()).origin));
  await page.goto("/demo");
  await page.locator('[data-check="sales"]').uncheck();
  await page.getByRole("button", { name: "Reset demo" }).click();
  expect([...origins]).toEqual(["http://127.0.0.1:4173"]);
});

test("@claim:offline-reload opens the sample workspace offline after one visit", async ({ page, context }) => {
  await page.goto("/demo");
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise<void>(resolve => navigator.serviceWorker.addEventListener("controllerchange", () => resolve(), { once: true }));
    await registration.update();
  });
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1, name: "Prepare this quarter’s evidence pack" })).toBeVisible();
  await expect(page.locator('[name="traderName"]')).toHaveValue("Rowan Field Studio");
});

test("@claim:paid-license a verified licence adds custom checks and cover notes", async ({ page }) => {
  await page.route("https://api.sociobot.in/**", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ valid: true, reason: "ok" }) }));
  await page.goto("/");
  await expect(page.getByText("£24")).toBeVisible();
  await expect(page.getByRole("link", { name: "Buy the supported edition" })).toHaveAttribute("href", /api\.sociobot\.in/);
  await page.goto("/workspace?license=sample-valid-token");
  await expect(page.locator("#custom-check")).toBeEnabled();
  await expect(page.locator("#cover-note")).toBeEnabled();
});

test("landing and workspace have no serious accessibility violations", async ({ page }) => {
  for (const path of ["/", "/demo", "/privacy", "/terms", "/missing-page"]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter(violation => ["serious", "critical"].includes(violation.impact ?? "")), path).toEqual([]);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main")).toHaveCount(1);
  }
});

test("routes load without browser errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", error => errors.push(error.message));
  for (const path of ["/", "/demo", "/workspace", "/privacy", "/terms", "/missing-page"]) await page.goto(path);
  expect(errors).toEqual([]);
});

test("@mobile core demo controls fit a 390px viewport", async ({ page }) => {
  await page.goto("/demo");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.getByRole("button", { name: "Reset demo" }).focus();
  await expect(page.getByRole("button", { name: "Reset demo" })).toBeFocused();
});
