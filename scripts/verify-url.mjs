import { chromium } from "@playwright/test";

const url = process.argv[2] ?? "http://127.0.0.1:4173";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const errors = [];
page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
page.on("pageerror", error => errors.push(error.message));
const response = await page.goto(url, { waitUntil: "networkidle" });
const result = await page.evaluate(() => ({
  title: document.title,
  lang: document.documentElement.lang,
  h1: document.querySelectorAll("h1").length,
  main: Boolean(document.querySelector("main")),
  imgsMissingAlt: [...document.images].filter(image => !image.hasAttribute("alt")).length,
  buttonsUnlabeled: [...document.querySelectorAll("button")].filter(button => !button.getAttribute("aria-label") && !button.textContent?.trim()).length
}));
await browser.close();

if (response?.status() !== 200 || !result.title || !result.lang || result.h1 !== 1 || !result.main || result.imgsMissingAlt || result.buttonsUnlabeled || errors.length) {
  console.error(JSON.stringify({ url, status: response?.status(), errors, ...result }));
  process.exit(1);
}
console.log(JSON.stringify({ url, status: "passed", errors, ...result }));
