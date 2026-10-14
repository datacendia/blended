#!/usr/bin/env node
/**
 * Drives the single-file build (dist-standalone/rootatlas.html) in Chromium.
 * The file swaps Next's router for an in-memory one, so this checks the
 * things that swap could break: following links, deep links into the spine,
 * switching language, the phone menu, and data surviving a reload.
 *
 *   npm run standalone && npm run verify:standalone
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const FILE = join(process.cwd(), "dist-standalone", "rootatlas.html");
if (!existsSync(FILE)) {
  console.error("dist-standalone/rootatlas.html not found — run `npm run standalone` first.");
  process.exit(1);
}
const URL_ = pathToFileURL(FILE).href;
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const failures = [];
const check = (ok, msg) => {
  console.log(`  ${ok ? "✓" : "✗"} ${msg}`);
  if (!ok) failures.push(msg);
};

async function open({ width = 1280, scheme = "light", locale = "en-US", hash = "" } = {}) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: scheme, locale });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(URL_ + hash, { waitUntil: "load" });
  await page.waitForSelector("#main");
  return { page, errors, context };
}

const overflow = (page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

{
  const { page, errors, context } = await open();
  check((await page.locator("h1").first().textContent())?.includes("Know what's trapped"), "opens on the English home page");
  await page.getByRole("banner").getByRole("link", { name: "Spine" }).click();
  check((await page.locator("article h2").first().textContent())?.includes("C6"), "header link opens the spine with C6 selected");
  await page.getByRole("banner").getByRole("link", { name: "Where it hurts" }).click();
  await page.getByRole("button", { name: /^Tingling/ }).click();
  await page.getByRole("button", { name: "Hand", exact: true }).click();
  await page.getByRole("button", { name: "Thumb (right)", exact: true }).click();
  check((await page.locator("ol li p.text-xl").first().textContent())?.trim() === "C6", "map: thumb with tingling ranks C6 first");
  await page.getByRole("link", { name: /See it on the spine/ }).first().click();
  const rootHeading = page.locator("article h2", { hasText: "C6 nerve root" });
  check(await rootHeading.first().waitFor({ timeout: 5000 }).then(() => true, () => false), "map → spine deep link opens the C6 root");
  await page.getByRole("banner").getByRole("link", { name: "Español" }).click();
  check((await page.getByRole("banner").innerText()).includes("Dónde duele"), "language switch keeps the page and turns the header Spanish");
  check((await page.getAttribute("html", "lang")) === "es", "<html lang> follows the language");
  check(errors.length === 0, `no console errors on desktop${errors.length ? `: ${errors.join(" | ")}` : ""}`);
  await context.close();
}

{
  const { page, errors, context } = await open({ hash: "#en-tracker" });
  check((await page.locator("h1").first().textContent())?.includes("Is it working"), "#en-tracker opens the tracker directly");
  await page.getByRole("button", { name: "Load an example" }).click();
  check((await page.getByText("S/ 86.11").count()) > 0, "tracker example shows S/ 86.11 per session");
  await page.reload({ waitUntil: "load" });
  await page.waitForSelector("#main");
  check((await page.getByText(/Checkpoint: 6 sessions/).count()) > 0, "tracker data survives a reload");
  await page.getByRole("button", { name: "Delete all my data" }).click();
  check((await page.getByText(/Checkpoint: 6 sessions/).count()) > 0, "one tap does not delete");
  await page.getByRole("button", { name: "Tap again to delete everything" }).click();
  check((await page.getByText(/Checkpoint: 6 sessions/).count()) === 0, "second tap deletes everything");
  check(errors.length === 0, "no console errors in the tracker");
  await context.close();
}

{
  const { page, errors, context } = await open({ width: 390, locale: "es-PE" });
  check((await page.locator("h1").first().textContent())?.includes("Entiende qué está atrapado"), "a Spanish browser opens in Spanish");
  check((await overflow(page)) <= 0, "no sideways scroll at 390px");
  const menu = page.locator("header details");
  await menu.locator("summary").click();
  await menu.getByRole("link", { name: "Informe postural" }).click();
  check(!(await menu.evaluate((d) => d.open)), "phone menu closes after choosing a page");
  check((await page.getByText(/±1,9 cm|±1\.9 cm/).count()) > 0, "report sample shows its ±1.9 cm margin of error");
  check((await overflow(page)) <= 0, "report has no sideways scroll at 390px");
  check(errors.length === 0, "no console errors on the phone");
  await context.close();
}

{
  const { page, context } = await open({ scheme: "dark" });
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  check(bg === "rgb(12, 18, 16)", `dark mode follows the system (${bg})`);
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
  const forced = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  check(forced === "rgb(246, 247, 244)", `an explicit light theme wins over a dark system (${forced})`);
  await context.close();
}

await browser.close();
console.log(failures.length ? `\n${failures.length} failure(s)` : "\nAll checks passed");
process.exit(failures.length ? 1 : 0);
