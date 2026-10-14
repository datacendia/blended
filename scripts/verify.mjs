#!/usr/bin/env node
/**
 * Drives the built site (out/) in a real browser.
 *
 * Unit tests cover lib/. This covers what they can't see: pages that throw
 * on load, text that scrolls sideways on a phone, a Spanish page with an
 * English header, and the interactive tools actually producing their answers.
 *
 *   npm run build && npm run verify
 *
 * Screenshots land in .verify/ (git-ignored). Set CHROMIUM_PATH to use a
 * preinstalled browser instead of Playwright's own.
 */
import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";

const OUT = join(process.cwd(), "out");
const SHOTS = join(process.cwd(), ".verify");
const PORT = 4321;
const PAGES = ["", "spine", "vertebra", "organs", "map", "report", "tracker", "warning-signs", "who-to-see", "who-to-see/chiropractor", "who-to-see/acupuncture", "what-works", "about"];
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon", ".txt": "text/plain", ".json": "application/json" };

if (!existsSync(OUT)) {
  console.error("out/ not found — run `npm run build` first.");
  process.exit(1);
}
mkdirSync(SHOTS, { recursive: true });

const server = createServer((req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
  let file = join(OUT, path);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file)) {
    res.writeHead(404, { "content-type": "text/html" });
    res.end(existsSync(join(OUT, "404.html")) ? readFileSync(join(OUT, "404.html")) : "not found");
    return;
  }
  res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
  res.end(readFileSync(file));
}).listen(PORT);

const base = `http://localhost:${PORT}`;
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const failures = [];
const fail = (msg) => {
  failures.push(msg);
  console.log(`  ✗ ${msg}`);
};
const pass = (msg) => console.log(`  ✓ ${msg}`);

async function open(path, { width = 390, scheme = "light" } = {}) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: scheme });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  const response = await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
  return { page, errors, status: response?.status() ?? 0 };
}

console.log("Every page, both languages, phone and desktop, light and dark");
for (const locale of ["en", "es"]) {
  for (const slug of PAGES) {
    const path = slug ? `/${locale}/${slug}/` : `/${locale}/`;
    for (const [width, scheme] of [[390, "light"], [1280, "dark"]]) {
      const { page, errors, status } = await open(path, { width, scheme });
      const label = `${path} @${width} ${scheme}`;
      if (status !== 200) fail(`${label}: HTTP ${status}`);
      const lang = await page.getAttribute("html", "lang");
      if (lang !== locale) fail(`${label}: <html lang="${lang}">`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 0) fail(`${label}: scrolls sideways by ${overflow}px`);
      if (errors.length) fail(`${label}: console errors: ${errors.join(" | ")}`);
      // A Spanish page must not carry the English nav, and vice versa.
      const brandNav = await page.getByRole("banner").innerText();
      const wrong = locale === "es" ? /Where it hurts|Warning signs/ : /Dónde duele|Señales de alarma/;
      if (wrong.test(brandNav)) fail(`${label}: header in the wrong language`);
      await page.screenshot({ path: join(SHOTS, `${locale}-${(slug || "home").replace("/", "-")}-${width}-${scheme}.png`), fullPage: true });
      await page.close();
    }
  }
}
if (!failures.length) pass(`${PAGES.length * 4} page renders clean`);

console.log("The tools give their answers");
{
  const { page } = await open("/en/map/", { width: 1280 });
  await page.getByRole("button", { name: /^Tingling/ }).click();
  await page.getByRole("button", { name: "Hand", exact: true }).click();
  await page.getByRole("button", { name: "Thumb (right)" }).click();
  await page.getByRole("button", { name: "Index finger (right)" }).click();
  const top = (await page.locator("ol li p.text-xl").first().textContent())?.trim();
  top === "C6" ? pass("map: thumb + index → C6") : fail(`map: thumb + index gave ${top}`);
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await page.getByRole("button", { name: "Saddle area (between the legs)" }).click();
  (await page.getByRole("alert").filter({ hasText: /emergency/i }).count()) > 0
    ? pass("map: saddle numbness → emergency")
    : fail("map: saddle numbness did not raise an emergency");
  await page.close();
}
{
  const { page } = await open("/es/spine/", { width: 390 });
  await page.goto(`${base}/es/spine/#root-C7`);
  // Wait for the state rather than a fixed delay: a sleep only hides a race.
  const opened = await page.locator("article h2", { hasText: "C7" }).first().waitFor({ timeout: 5000 }).then(() => true, () => false);
  opened ? pass("spine: #root-C7 deep link opens the C7 root") : fail(`spine: deep link showed ${await page.locator("article h2").first().textContent()}`);
  const labels = await page.locator("svg text").allTextContents();
  labels.includes("D7") ? pass("spine: Spanish labels thoracic vertebrae D1-D12") : fail("spine: no D7 label in Spanish");
  await page.close();
}
{
  const { page } = await open("/en/report/", { width: 1280 });
  const noise = await page.getByText(/±1\.9 cm/).count();
  noise > 0 ? pass("report: sample shows a ±1.9 cm margin of error") : fail("report: noise floor not shown");
  const opposite = await page.getByText("Opposite directions").count();
  opposite === 2 ? pass("report: shoulder and hip flagged as opposite directions") : fail(`report: ${opposite} opposite-direction flags`);
  await page.close();
}
{
  const { page } = await open("/en/tracker/", { width: 390 });
  await page.getByRole("button", { name: "Load an example" }).click();
  const checkpoint = await page.getByText(/Checkpoint: 6 sessions/).count();
  checkpoint > 0 ? pass("tracker: example raises the trial checkpoint") : fail("tracker: no trial checkpoint");
  const perSession = await page.getByText("S/ 86.11").count();
  perSession > 0 ? pass("tracker: S/ 86.11 per session") : fail("tracker: cost per session missing");
  await page.reload({ waitUntil: "networkidle" });
  (await page.getByText(/Checkpoint: 6 sessions/).count()) > 0
    ? pass("tracker: data survives a reload (localStorage)")
    : fail("tracker: data lost on reload");
  await page.getByRole("button", { name: "Delete all my data" }).click();
  await page.getByRole("button", { name: "Tap again to delete everything" }).click();
  (await page.getByText(/Checkpoint: 6 sessions/).count()) === 0
    ? pass("tracker: delete removes everything")
    : fail("tracker: delete left data behind");
  await page.close();
}
{
  const { page } = await open("/en/organs/", { width: 1280 });
  (await page.getByText("Vagus nerve (X)").count()) > 0 ? pass("organs: the heart opens on its vagus supply") : fail("organs: heart panel missing the vagus");
  await page.getByRole("button", { name: "Bladder", exact: true }).click();
  (await page.getByText("Pelvic splanchnic nerves (S2-S4)").count()) > 0 ? pass("organs: bladder → pelvic nerves S2-S4") : fail("organs: bladder did not show S2-S4");
  await page.getByRole("button", { name: "C6 spinal nerve" }).click();
  (await page.getByText("No organ wiring leaves the cord here.").count()) > 0 ? pass("organs: C6 carries no organ wiring") : fail("organs: C6 claimed organ wiring");
  await page.close();
}
{
  const { page } = await open("/es/vertebra/", { width: 390 });
  await page.getByRole("button", { name: /^Lumbar/ }).click();
  (await page.getByRole("button", { name: "Cola de caballo" }).count()) === 1 ? pass("vertebra: a lumbar vertebra holds the cauda equina (es)") : fail("vertebra: no cauda equina in the lumbar view");
  await page.getByRole("button", { name: "Mirando arriba, girado hacia ese lado" }).click();
  (await page.getByText("Raíz comprimida").count()) > 0 ? pass("vertebra: herniation + looking up and turning squeezes the root") : fail("vertebra: root not squeezed");
  await page.getByRole("button", { name: "Mirando hacia abajo" }).click();
  (await page.getByText("Espacio de sobra").count()) > 0 ? pass("vertebra: looking down gives the root room") : fail("vertebra: looking down did not ease it");
  await page.close();
}
{
  const { page } = await open("/en/who-to-see/", { width: 390 });
  await page.locator("#physio").getByRole("link", { name: /Full guide/ }).click();
  await page.waitForURL(/\/en\/who-to-see\/physio\/$/);
  (await page.locator("h1").textContent())?.includes("Physiotherapist") ? pass("who to see: card opens the physiotherapist guide") : fail("who to see: guide link broken");
  const boxes = page.getByRole("checkbox");
  await boxes.nth(0).check();
  await boxes.nth(1).check();
  (await page.getByText(`2 of ${await boxes.count()}`).count()) > 0 ? pass("guide: first-visit checklist counts ticks") : fail("guide: checklist count missing");
  await page.close();
}
{
  const { page } = await open("/es/who-to-see/", { width: 390 });
  await page.locator("#huesero").getByRole("link", { name: /Guía completa/ }).click();
  await page.waitForURL(/\/es\/who-to-see\/huesero\/$/);
  (await page.getByText(/no encontró ensayos controlados/).count()) > 0
    ? pass("practices: the huesero guide says no trials were found (es)")
    : fail("practices: huesero guide missing its evidence line");
  await page.getByRole("link", { name: "Acupuntura", exact: true }).click();
  await page.waitForURL(/\/es\/who-to-see\/acupuncture\/$/);
  (await page.getByText("Dolor de cuello crónico").count()) > 0 ? pass("practices: acupuncture shows its neck-pain verdict") : fail("practices: acupuncture neck verdict missing");
  await page.close();
}
{
  const { page } = await open("/es/", { width: 390 });
  const menu = page.locator("header details");
  await menu.locator("summary").click();
  await menu.getByRole("link", { name: "Informe postural" }).click();
  await page.waitForURL(/\/es\/report\/$/);
  !(await menu.evaluate((d) => d.open)) ? pass("phone menu closes after choosing a page") : fail("phone menu stayed open after navigating");
  await page.close();
}
{
  const { page } = await open("/es/warning-signs/", { width: 390 });
  await page.getByText(/Fiebre, escalofríos/).click();
  (await page.getByText("Consulta a un médico en uno o dos días").count()) > 0
    ? pass("warning signs: fever → see a doctor within a day or two (es)")
    : fail("warning signs: fever did not triage to urgent");
  await page.getByText(/Adormecimiento entre las piernas/).click();
  (await page.getByText("Busca ayuda de emergencia ahora").count()) > 0
    ? pass("warning signs: saddle numbness escalates to emergency (es)")
    : fail("warning signs: saddle numbness did not escalate");
  await page.close();
}

await browser.close();
server.close();
console.log(failures.length ? `\n${failures.length} failure(s)` : "\nAll checks passed");
process.exit(failures.length ? 1 : 0);
