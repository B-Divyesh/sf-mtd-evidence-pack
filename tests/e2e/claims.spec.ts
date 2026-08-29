import { test, expect, type Locator, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";
import { BlobReader, TextWriter, ZipReader } from "@zip.js/zip.js";

async function tabTo(page: Page, target: Locator): Promise<void> {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    await page.keyboard.press("Tab");
    if (await target.evaluate(element => document.activeElement === element)) return;
  }
  throw new Error("Keyboard focus did not reach the expected control.");
}

test("@claim:demo-sandbox sample changes are not saved", async ({ page }) => {
  await page.goto("/?demo=1");
  await expect(page).toHaveURL("/?demo=1");
  await expect(page.getByText("Demo — sample data, nothing is saved")).toBeVisible();
  await expect(page.getByText("The sample resets when you reload or leave the demo.")).toBeVisible();
  await expect(page.getByText("Your work saves on this device.", { exact: true })).toHaveCount(0);
  const first = page.locator('[data-check="sales"]');
  await expect(first).toBeChecked();
  await first.uncheck();
  await page.reload();
  await expect(page.locator('[data-check="sales"]')).toBeChecked();
  expect(await page.evaluate(async () => (await indexedDB.databases()).map(database => database.name))).not.toContain("mtd-evidence-pack:v1");
  await page.getByRole("button", { name: "Start for real" }).click();
  await expect(page.getByText("No bookkeeping records yet.")).toBeVisible();
  await expect(page.getByText("Your work saves on this device.", { exact: true })).toBeVisible();
  await expect(page.getByText("The sample resets when you reload or leave the demo.")).toHaveCount(0);
});

test("@claim:csv-import rejects impossible dates and missing amounts, then safely adds valid CSV records", async ({ page }) => {
  await page.goto("/demo");
  await page.locator("[data-import-csv]").setInputFiles({
    name: "invalid-quarter.csv", mimeType: "text/csv",
    buffer: Buffer.from("date,description,amount,category,reference\n2026-02-30,Impossible day,25,Sales,BAD-1\n2026-04-11,Blank amount,,Sales,BAD-2\n2026-04-12,Whitespace amount,   ,Sales,BAD-3\n")
  });
  await expect(page.locator(".message.error")).toContainText("Row 2 has an invalid date. Use YYYY-MM-DD.");
  await expect(page.locator(".message.error")).toContainText("Row 3 has an invalid amount.");
  await expect(page.locator(".message.error")).toContainText("Row 4 has an invalid amount.");
  await expect(page.locator(".table-summary")).toContainText("12 records");
  await page.locator("[data-import-csv]").setInputFiles({
    name: "quarter.csv", mimeType: "text/csv",
    buffer: Buffer.from("date,description,amount,category,reference\n2026-04-10,Oak Studio invoice,400,Sales,I-1\n2026-04-11,Printer paper,-20,Office costs,R-1\n")
  });
  await expect(page.locator(".message.success").getByText("2 records added. 14 total.")).toBeVisible();
  await expect(page.getByText("Oak Studio invoice")).toBeVisible();
  await expect(page.getByText("Printer paper")).toBeVisible();
  await expect(page.getByText("North Street Studio invoice 1042")).toBeVisible();
  await page.locator("[data-import-csv]").setInputFiles({
    name: "second-import.csv", mimeType: "text/csv",
    buffer: Buffer.from("date,description,amount,category,reference\n2026-04-12,Second retained record,55,Sales,I-2\n")
  });
  await expect(page.locator(".message.success").getByText("1 record added. 15 total.")).toBeVisible();
  await expect(page.getByText("North Street Studio invoice 1042")).toBeVisible();
  await expect(page.getByText("Second retained record")).toBeVisible();
});

test("@claim:period-integrity rejects an outside-period file atomically and clears stale success feedback", async ({ page }) => {
  await page.goto("/workspace");
  const fileInput = page.locator("[data-import-csv]");
  await fileInput.setInputFiles({
    name: "boundary-records.csv", mimeType: "text/csv",
    buffer: Buffer.from("date,description,amount,category\n2026-04-06,First day record,100,Sales\n2026-07-05,Last day record,-25,Office costs\n")
  });
  await expect(page.locator(".message.success")).toHaveText("2 records added. 2 total.");

  await fileInput.setInputFiles({
    name: "mixed-periods.csv", mimeType: "text/csv",
    buffer: Buffer.from("date,description,amount,category\n2025-01-01,Outside record,50,Sales\n2026-04-10,Inside but same rejected file,75,Sales\n")
  });
  await expect(page.locator(".message.error")).toContainText("Row 2 is outside the selected period (2026-04-06 to 2026-07-05).");
  await expect(page.locator(".message.success")).toHaveCount(0);
  await expect(page.locator(".table-summary")).toContainText("2 records");
  await expect(page.getByText("Outside record", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Inside but same rejected file", { exact: true })).toHaveCount(0);
  await page.reload();
  await expect(page.getByText("First day record", { exact: true })).toBeVisible();
  await expect(page.getByText("Last day record", { exact: true })).toBeVisible();
});

test("@claim:source-file-size accepts 10 MB and rejects 10 MB plus one byte", async ({ page }) => {
  await page.goto("/demo");
  const fileInput = page.locator("[data-import-docs]");
  await fileInput.setInputFiles({
    name: "ten-megabytes.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.alloc(10 * 1024 * 1024)
  });
  await expect(page.locator(".message.success")).toContainText("1 source file attached.");
  await expect(page.getByText("ten-megabytes.pdf", { exact: true })).toBeVisible();

  await fileInput.setInputFiles({
    name: "one-byte-too-large.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.alloc(10 * 1024 * 1024 + 1)
  });
  await expect(page.locator(".message.error")).toContainText("one-byte-too-large.pdf is over 10 MB. Choose a smaller file.");
  await expect(page.getByText("one-byte-too-large.pdf", { exact: true })).toHaveCount(0);
  await expect(page.getByText("ten-megabytes.pdf", { exact: true })).toBeVisible();
});

test("@claim:encrypted-pack @claim:free-core-export exports a password-protected ZIP with its listed files", async ({ page }) => {
  const browserErrors: string[] = [];
  page.on("console", message => { if (message.type() === "error") browserErrors.push(message.text()); });
  page.on("pageerror", error => browserErrors.push(error.message));
  await page.route("**/demo", async route => {
    const response = await route.fetch();
    await route.fulfill({
      response,
      headers: {
        ...response.headers(),
        "content-security-policy": "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' blob: data:; connect-src 'self' https://api.sociobot.in; worker-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self' https://api.sociobot.in; frame-ancestors 'none'"
      }
    });
  });
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
  expect(entries.map(entry => entry.filename)).toEqual(expect.arrayContaining(["README.txt", "manifest.json", "records/transactions.csv", "summary/evidence-pack-summary.pdf"]));
  expect(entries.some(entry => entry.filename.startsWith("source-files/"))).toBe(true);
  const pdfEntry = entries.find(entry => entry.filename === "summary/evidence-pack-summary.pdf")!;
  expect(await pdfEntry.getData!(new TextWriter())).toMatch(/^%PDF-1.4/);
  const manifestEntry = entries.find(entry => entry.filename === "manifest.json")!;
  const manifest = JSON.parse(await manifestEntry.getData!(new TextWriter())) as { recordCount: number; files: Array<{ sha256: string }> };
  expect(manifest.recordCount).toBe(12);
  expect(manifest.files.every(file => /^[a-f0-9]{64}$/.test(file.sha256))).toBe(true);
  expect(await page.evaluate(password => Object.values(localStorage).includes(password), "correct-horse-26")).toBe(false);
  expect(browserErrors).toEqual([]);
  await reader.close();
});

test("@claim:local-only records entered after the demo stay in IndexedDB and make no cross-origin request", async ({ page }) => {
  const origins = new Set<string>();
  page.on("request", request => origins.add(new URL(request.url()).origin));
  await page.goto("/demo");
  await page.getByRole("button", { name: "Start for real" }).click();
  await page.locator("[data-import-csv]").setInputFiles({
    name: "private-record.csv", mimeType: "text/csv",
    buffer: Buffer.from("date,description,amount,category\n2026-04-10,Private local record,400,Sales\n")
  });
  await expect(page.getByText("Private local record")).toBeVisible();
  await expect.poll(() => page.evaluate(async () => {
    const request = indexedDB.open("mtd-evidence-pack:v1");
    return await new Promise<boolean>((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const get = db.transaction("workspace").objectStore("workspace").get("current");
        get.onsuccess = () => { db.close(); resolve(get.result?.transactions?.[0]?.description === "Private local record"); };
        get.onerror = () => reject(get.error);
      };
    });
  })).toBe(true);
  expect([...origins]).toEqual([new URL(page.url()).origin]);
});

test("@claim:offline-reload completes a sample encrypted export offline after one visit", async ({ page, context }) => {
  await page.goto("/demo");
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise<void>(resolve => navigator.serviceWorker.addEventListener("controllerchange", () => resolve(), { once: true }));
    await registration.update();
  });
  expect(await page.evaluate(() => caches.keys())).toContain("mtd-evidence-pack-v1.0.9");
  await expect.poll(() => page.evaluate(async () => {
    const cache = await caches.open("mtd-evidence-pack-v1.0.9");
    const manifestResponse = await cache.match("/asset-manifest.json");
    if (!manifestResponse) return false;
    const manifest = await manifestResponse.json() as Record<string, { file: string; css?: string[]; assets?: string[] }>;
    const required = Object.values(manifest).flatMap(entry => [entry.file, ...(entry.css ?? []), ...(entry.assets ?? [])]);
    return Promise.all(required.map(asset => cache.match(`/${asset}`))).then(responses => responses.every(Boolean));
  })).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1, name: "Prepare this quarter’s evidence pack" })).toBeVisible();
  await expect(page.locator('[name="traderName"]')).toHaveValue("Rowan Field Studio");
  await page.locator("#pack-password").fill("offline-horse-26");
  await page.locator("#pack-password-confirm").fill("offline-horse-26");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export encrypted ZIP" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("evidence-pack-2026-07-05.zip");
  expect(await download.path()).not.toBeNull();
});

test("service worker updates are announced", async ({ page }) => {
  await page.goto("/demo");
  await expect(page.locator(".build-id")).toHaveText("v1.0.9");
  await expect.poll(() => page.evaluate(async () => (await (await fetch("/manifest.webmanifest")).json()).start_url)).toBe("/?v=1.0.9");
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise<void>(resolve => navigator.serviceWorker.addEventListener("controllerchange", () => resolve(), { once: true }));
    registration.dispatchEvent(new Event("updatefound"));
  });
  await expect(page.locator(".live-region")).toContainText("An update is installing. It will be ready on the next page.");
});

test("@claim:custom-checklist an unlicensed real workspace saves a user-maintained checklist", async ({ page }) => {
  await page.goto("/demo");
  await page.getByRole("button", { name: "Start for real" }).click();
  await expect(page.locator("#custom-check")).toBeEnabled();
  await page.locator("#custom-check").fill("Confirm mileage log agrees with records");
  await page.getByRole("button", { name: "Add check" }).click();
  await expect(page.getByText("Confirm mileage log agrees with records", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Confirm mileage log agrees with records", { exact: true })).toBeVisible();
  await expect(page.locator("#cover-note")).toBeDisabled();
});

test("@claim:paid-license a verified licence enables saved cover notes", async ({ page }) => {
  await page.route("https://api.sociobot.in/**", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ valid: true, reason: "ok" }) }));
  await page.goto("/demo");
  await expect(page.getByText("Demo — sample data, nothing is saved")).toBeVisible();
  await page.getByRole("button", { name: "Start for real" }).click();
  await expect(page.getByText("No bookkeeping records yet.")).toBeVisible();
  await page.goto("/workspace?license=sample-valid-token");
  await expect(page).toHaveURL("/workspace");
  await expect.poll(() => page.evaluate(() => localStorage.getItem("sb_license:mtd-evidence-pack"))).toBe("sample-valid-token");
  await expect(page.locator("#custom-check")).toBeEnabled();
  await expect(page.locator("#cover-note")).toBeEnabled();
});

test("@claim:checkout-unavailable new licences are not offered while existing licence restore remains available", async ({ page }) => {
  for (const path of ["/", "/demo", "/workspace", "/privacy", "/terms"]) {
    await page.goto(path);
    await expect(page.locator('a[href*="/checkout"]'), path).toHaveCount(0);
    await expect(page.getByText("Buy the supported edition", { exact: true }), path).toHaveCount(0);
    await expect(page.getByText("£24", { exact: true }), path).toHaveCount(0);
  }
  await page.goto("/workspace");
  await expect(page.getByLabel("Paste your licence")).toBeVisible();
  const readme = await readFile(new URL("../../README.md", import.meta.url), "utf8");
  expect(readme).not.toContain("/checkout");
  expect(readme).not.toContain("£24");
  expect(readme).toContain("New licences are not currently available.");
});

test("landing uses the reviewed plain-language wording", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Try it with sample data" })).toHaveAttribute("href", "/?demo=1");
  await expect(page.getByText("Keep source files with the records for one selected quarter.")).toBeVisible();
  await expect(page.getByText("Readiness preview", { exact: true })).toBeVisible();
  await expect(page.getByText("What this tool does not do", { exact: true })).toBeVisible();
  await expect(page.getByText("It does not submit tax returns.", { exact: false })).toBeVisible();
  await expect(page.getByText("New licences are not currently available.", { exact: false })).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: "Prepare your quarterly evidence pack" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "See what is missing before export" })).toBeVisible();
  await expect(page.getByText("Free core and existing licences", { exact: true })).toBeVisible();
  await expect(page.locator(".build-id")).toHaveText("v1.0.9");
  for (const removedCopy of ["Four quarters. One traceable path through the source records.", "Field note 01", "The product itself", "A boundary, kept clear", "checkout is unavailable", "Supported edition", "Generated art disclosed", "Prepare your quarterly evidence handoff", "See what is missing before handoff"]) {
    await expect(page.getByText(removedCopy, { exact: true })).toHaveCount(0);
  }
});

test("public copy uses one artifact and licence vocabulary", async () => {
  const publicFiles = ["../../README.md", "../../index.html", "../../src/app.ts", "../../src/export.ts", "../../public/404.html", "../../public/manifest.webmanifest"];
  const publicCopy = (await Promise.all(publicFiles.map(path => readFile(new URL(path, import.meta.url), "utf8")))).join("\n");
  for (const removedCopy of ["evidence handoff", "quarterly handoff", "quarterly-handoff", "Supported edition", "supported-edition", "app shell", "Generated art disclosed", "versioned evidence checklist"]) {
    expect(publicCopy.toLowerCase()).not.toContain(removedCopy.toLowerCase());
  }
  expect(publicCopy).toContain("Prepare your quarterly evidence pack");
  expect(publicCopy).toContain("Free core and existing licences");
  expect(publicCopy).toContain("summary/evidence-pack-summary.pdf");
});

test("@claim:readiness names every open checklist item before export", async ({ page }) => {
  await page.goto("/demo");
  await expect(page.getByRole("heading", { level: 3, name: "1 open item" })).toBeVisible();
  await expect(page.locator(".gaps")).toContainText("Invoices and receipts can be matched to records");
  await page.locator('[data-check="receipts"]').check();
  await expect(page.getByRole("heading", { level: 3, name: "Ready to share" })).toBeVisible();
});

test("@claim:standalone-install supplies a standalone PWA manifest", async ({ page }) => {
  await page.goto("/");
  const manifest = await page.evaluate(async () => await (await fetch("/manifest.webmanifest")).json() as {
    display: string; start_url: string; icons: Array<{ sizes: string; purpose?: string }>;
  });
  expect(manifest.display).toBe("standalone");
  expect(manifest.start_url).toBe("/?v=1.0.9");
  expect(manifest.icons).toEqual(expect.arrayContaining([
    expect.objectContaining({ sizes: "192x192" }),
    expect.objectContaining({ sizes: "512x512", purpose: "any maskable" })
  ]));
});

test("@performance mobile landing meets LCP, interaction, and transfer budgets", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const session = await page.context().newCDPSession(page);
  await session.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await session.send("Network.enable");
  await session.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: 204_800, uploadThroughput: 96_000 });
  await page.addInitScript(() => {
    const metrics = window as typeof window & { __lcp?: number[]; __interactions?: number[] };
    metrics.__lcp = [];
    metrics.__interactions = [];
    new PerformanceObserver(list => { for (const entry of list.getEntries()) metrics.__lcp!.push(entry.startTime); })
      .observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        const event = entry as PerformanceEntry & { interactionId: number };
        if (event.interactionId) metrics.__interactions!.push(event.duration);
      }
    }).observe({ type: "event", buffered: true, durationThreshold: 16 } as PerformanceObserverInit);
  });
  await page.goto("/");
  await page.locator(".hero-art img").evaluate((image: HTMLImageElement) => image.complete || new Promise(resolve => image.addEventListener("load", resolve, { once: true })));
  await page.waitForTimeout(600);
  const heroTreatment = await page.locator(".hero-art").evaluate(element => {
    const art = getComputedStyle(element);
    const imageElement = element.querySelector("img")!;
    const image = getComputedStyle(imageElement);
    const bounds = imageElement.getBoundingClientRect();
    return { animation: art.animationName, clipPath: image.clipPath, aspectRatio: bounds.width / bounds.height, source: imageElement.currentSrc };
  });
  expect(heroTreatment.animation).toBe("none");
  expect(heroTreatment.clipPath).toBe("none");
  expect(heroTreatment.aspectRatio).toBeCloseTo(1.5, 1);
  expect(heroTreatment.source).toContain("hero-ledger-390.webp");
  const navigationMetrics = await page.evaluate(() => {
    const values = window as typeof window & { __lcp: number[] };
    const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
    const bytes = (entry: PerformanceResourceTiming) => entry.transferSize || entry.encodedBodySize;
    return {
      lcp: Math.round(values.__lcp.at(-1) ?? 0),
      javascriptBytes: resources.filter(entry => new URL(entry.name).pathname.endsWith(".js")).reduce((total, entry) => total + bytes(entry), 0),
      cssBytes: resources.filter(entry => new URL(entry.name).pathname.endsWith(".css")).reduce((total, entry) => total + bytes(entry), 0)
    };
  });
  expect(navigationMetrics.lcp).toBeGreaterThan(0);
  expect(navigationMetrics.lcp).toBeLessThan(2_500);
  expect(navigationMetrics.javascriptBytes).toBeLessThanOrEqual(200 * 1024);
  expect(navigationMetrics.cssBytes).toBeLessThanOrEqual(50 * 1024);

  await page.getByRole("link", { name: "Try it with sample data" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Prepare this quarter’s evidence pack" })).toBeVisible();
  await page.waitForTimeout(100);
  const metrics = await page.evaluate(() => {
    const values = window as typeof window & { __interactions: number[] };
    return { longestInteraction: Math.round(Math.max(...values.__interactions, 0)) };
  });
  console.info(`Mobile LCP: ${navigationMetrics.lcp} ms; interaction: ${metrics.longestInteraction} ms; JS: ${navigationMetrics.javascriptBytes} B; CSS: ${navigationMetrics.cssBytes} B`);
  expect(metrics.longestInteraction).toBeGreaterThan(0);
  expect(metrics.longestInteraction).toBeLessThanOrEqual(200);
  await session.send("Emulation.setCPUThrottlingRate", { rate: 1 });
});

test("all built assets receive the immutable cache policy", async () => {
  const config = JSON.parse(await readFile(new URL("../../public/staticwebapp.config.json", import.meta.url), "utf8")) as {
    routes: Array<{ route: string; headers?: Record<string, string> }>;
  };
  const assets = config.routes.find(route => route.route === "/assets/*");
  expect(assets?.headers?.["Cache-Control"]).toBe("public, max-age=31536000, immutable");
});

test("static-host routing keeps product paths and returns the designed 404 page for unknown paths", async () => {
  const config = JSON.parse(await readFile(new URL("../../public/staticwebapp.config.json", import.meta.url), "utf8")) as {
    routes: Array<{ route: string; rewrite?: string }>;
    navigationFallback?: unknown;
    responseOverrides?: Record<string, { rewrite?: string }>;
  };
  expect(config.navigationFallback).toBeUndefined();
  expect(config.routes.filter(route => route.rewrite === "/index.html").map(route => route.route)).toEqual(["/", "/demo", "/workspace", "/privacy", "/terms"]);
  expect(config.responseOverrides?.["404"]?.rewrite).toBe("/404.html");
  const missing = await readFile(new URL("../../public/404.html", import.meta.url), "utf8");
  expect(missing).toContain("This page is not in the pack");
  expect(missing).toContain('meta name="description"');
  expect(missing).toContain('rel="canonical"');
  expect(missing).toContain('property="og:title"');
  expect(missing).toContain('name="twitter:card"');
  expect(missing).toContain('href="/workspace"');
  expect(missing).toContain('href="/privacy"');
  expect(missing).toContain('href="/terms"');
});

test("app routes update title, description, and canonical metadata", async ({ page }) => {
  const routes = [
    ["/", "MTD Evidence Pack — prepare quarterly records", "Import bookkeeping CSV records, check the quarter and export an encrypted evidence pack for your accountant or filing software.", "https://mtd-evidence-pack.sociobot.in/"],
    ["/?demo=1", "Demo — MTD Evidence Pack", "Try one sample bookkeeping quarter. Sample changes are not saved.", "https://mtd-evidence-pack.sociobot.in/demo"],
    ["/workspace", "Workspace — MTD Evidence Pack", "Prepare a local quarterly evidence pack from bookkeeping records and source files.", "https://mtd-evidence-pack.sociobot.in/workspace"],
    ["/privacy", "Privacy — MTD Evidence Pack", "Learn how MTD Evidence Pack stores local browser data and licence details.", "https://mtd-evidence-pack.sociobot.in/privacy"],
    ["/terms", "Terms — MTD Evidence Pack", "Read the terms for using MTD Evidence Pack to organise local records.", "https://mtd-evidence-pack.sociobot.in/terms"]
  ];
  for (const [path, title, description, canonical] of routes) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", description);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", canonical);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", title);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", description);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", canonical);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", title);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute("content", description);
  }
});

test("all product routes have no serious accessibility violations", async ({ page }) => {
  for (const path of ["/", "/demo", "/workspace", "/privacy", "/terms", "/missing-page"]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter(violation => ["serious", "critical"].includes(violation.impact ?? "")), path).toEqual([]);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main")).toHaveCount(1);
  }
});

test("routes load without browser errors", async ({ page }) => {
  const errors: Array<{ text: string; url: string }> = [];
  page.on("console", message => { if (message.type() === "error") errors.push({ text: message.text(), url: message.location().url }); });
  page.on("pageerror", error => errors.push({ text: error.message, url: "pageerror" }));
  for (const path of ["/", "/demo", "/workspace", "/privacy", "/terms"]) await page.goto(path);
  const missingResponse = await page.goto("/missing-page");
  await expect(page.getByRole("heading", { level: 1, name: "This page is not in the pack" })).toBeVisible();
  if (process.env.PLAYWRIGHT_BASE_URL) expect(missingResponse?.status()).toBe(404);
  const unexpectedErrors = errors.filter(error => !(error.url.endsWith("/missing-page") && error.text.includes("server responded with a status of 404")));
  expect(unexpectedErrors).toEqual([]);
});

test("@keyboard Space toggles a demo checklist item", async ({ page }) => {
  await page.goto("/demo");
  const check = page.locator('[data-check="sales"]');
  await check.focus();
  await page.keyboard.press("Space");
  await expect(check).not.toBeChecked();
});

test("@keyboard @mobile file imports show a focus ring and scroll the visible control into view", async ({ page }) => {
  await page.goto("/demo");
  for (const selector of ["[data-import-csv]", "[data-import-docs]"]) {
    const input = page.locator(selector);
    await tabTo(page, input);
    await expect.poll(() => input.evaluate(element => {
      const bounds = element.closest<HTMLElement>(".file-button")!.getBoundingClientRect();
      return bounds.top >= 0 && bounds.bottom <= window.innerHeight;
    })).toBe(true);
    const state = await input.evaluate(element => {
      const label = element.closest<HTMLElement>(".file-button")!;
      const labelBounds = label.getBoundingClientRect();
      const inputBounds = element.getBoundingClientRect();
      const labelStyle = getComputedStyle(label);
      return {
        focused: document.activeElement === element,
        labelTop: labelBounds.top,
        labelBottom: labelBounds.bottom,
        labelWidth: labelBounds.width,
        inputWidth: inputBounds.width,
        outlineStyle: labelStyle.outlineStyle,
        outlineWidth: Number.parseFloat(labelStyle.outlineWidth),
        outlineColor: labelStyle.outlineColor,
        viewportHeight: window.innerHeight
      };
    });
    expect(state.focused).toBe(true);
    expect(state.outlineStyle).toBe("solid");
    expect(state.outlineWidth).toBeGreaterThanOrEqual(3);
    expect(state.outlineColor).toBe("rgb(141, 51, 46)");
    expect(state.inputWidth).toBeGreaterThanOrEqual(state.labelWidth - 6);
    expect(state.labelTop).toBeGreaterThanOrEqual(0);
    expect(state.labelBottom).toBeLessThanOrEqual(state.viewportHeight);
  }
});

test("@keyboard cold load starts at the skip link and client navigation focuses the heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).not.toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();

  await page.getByRole("link", { name: "Demo", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Prepare this quarter’s evidence pack" })).toBeFocused();
});

test("@mobile core demo controls fit a 390px viewport", async ({ page }) => {
  await page.goto("/demo");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.getByRole("button", { name: "Reset demo" }).focus();
  await expect(page.getByRole("button", { name: "Reset demo" })).toBeFocused();
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter(violation => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
  await page.goto("/workspace");
  await expect(page.getByRole("heading", { level: 1, name: "Prepare this quarter’s evidence pack" })).toBeVisible();
  const workspaceResults = await new AxeBuilder({ page: page as never }).analyze();
  expect(workspaceResults.violations.filter(violation => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);

  await page.goto("/privacy");
  const emailBox = await page.getByRole("link", { name: "privacy@sociobot.in" }).boundingBox();
  expect(emailBox?.height).toBeGreaterThanOrEqual(44);
});

test("@mobile demo banner remains visible while working lower in the sample", async ({ page }) => {
  await page.goto("/demo");
  await page.locator(".export-section").scrollIntoViewIfNeeded();
  const state = await page.locator(".demo-banner").evaluate(element => {
    const bounds = element.getBoundingClientRect();
    return { position: getComputedStyle(element).position, top: bounds.top, bottom: bounds.bottom, viewportHeight: window.innerHeight };
  });
  expect(state.position).toBe("sticky");
  expect(state.top).toBeGreaterThanOrEqual(0);
  expect(state.top).toBeLessThanOrEqual(1);
  expect(state.bottom).toBeLessThanOrEqual(state.viewportHeight);
  await expect(page.getByRole("button", { name: "Reset demo" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Start for real" })).toBeVisible();
});

test("public footers disclose that the hero artwork was generated", async ({ page }) => {
  for (const path of ["/", "/missing-page"]) {
    await page.goto(path);
    await expect(page.locator(".art-credit")).toHaveText("Hero artwork was generated for this product.");
  }
});

test("@mobile 200% text reflows without horizontal overflow and keeps the home target usable", async ({ page }) => {
  await page.goto("/demo");
  await page.evaluate(() => document.documentElement.style.fontSize = "200%");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  const home = page.getByRole("link", { name: "MTD Evidence Pack home" });
  const box = await home.boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(44);
  await home.focus();
  await expect(home).toBeFocused();
  expect(await home.evaluate(element => getComputedStyle(element).outlineColor)).toBe("rgb(141, 51, 46)");
});
