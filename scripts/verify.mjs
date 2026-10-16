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
const PAGES = ["", "spine", "vertebra", "organs", "map", "report", "tracker", "warning-signs", "who-to-see", "who-to-see/chiropractor", "who-to-see/acupuncture", "who-to-see/gp", "who-to-see/reflexology", "what-works", "about"];
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
  // The care-pathway diagram above has checkboxes of its own; count only the visit checklist's.
  const boxes = page.locator('section[aria-labelledby="first-visit"]').getByRole("checkbox");
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
  const { page } = await open("/es/who-to-see/gp/", { width: 390 });
  const pathway = page.locator("#diagram-care-pathway");
  await pathway.locator('input[type="range"]').fill("8");
  (await pathway.getByText("Seis semanas sin una mejoría clara").count()) > 0
    ? pass("care pathway: 8 weeks without improvement points to a medical review (es)")
    : fail("care pathway: no medical review at 8 weeks");
  await pathway.getByText(/Alguna señal de alarma/).click();
  (await pathway.getByRole("link", { name: "Abrir las señales de alarma" }).count()) > 0
    ? pass("care pathway: a warning sign sends you to the warning signs")
    : fail("care pathway: warning sign did not escalate");
  await page.close();
}
{
  const { page } = await open("/en/who-to-see/acupuncture/", { width: 1280 });
  const needle = page.locator("#diagram-needle-depth");
  await needle.getByRole("button", { name: "Average", exact: true }).click();
  await needle.locator('input[type="range"]').fill("100");
  (await needle.getByText("Risk of a punctured lung").count()) > 0 ? pass("needle: full depth, straight, average build reaches the lung") : fail("needle: no lung warning at full depth");
  await needle.getByRole("button", { name: "Angled", exact: true }).click();
  (await needle.getByText("Risk of a punctured lung").count()) === 0 ? pass("needle: angled, it stays short of the lung") : fail("needle: angled still reaches the lung");
  await needle.getByRole("button", { name: /^4\s*Middle of the shoulder blade/ }).click();
  await needle.getByRole("button", { name: "Straight in", exact: true }).click();
  (await needle.getByText("Stopped by bone").count()) > 0 ? pass("needle: over the shoulder blade, the needle stops on bone") : fail("needle: shoulder blade doesn't stop the needle");
  await page.close();
}
{
  const { page } = await open("/en/who-to-see/neurologist/", { width: 390 });
  const mimic = page.locator("#diagram-neck-or-arm");
  await mimic.getByRole("button", { name: "Compare two", exact: true }).click();
  await mimic.getByRole("group", { name: "First" }).getByRole("button", { name: "C8 root", exact: true }).click();
  await mimic.getByRole("group", { name: "Second" }).getByRole("button", { name: "Ulnar nerve at the elbow", exact: true }).click();
  (await mimic.getByText("Inner (little-finger-side) forearm").count()) > 0 ? pass("neck or arm: comparing C8 with the ulnar nerve names the inner forearm") : fail("neck or arm: comparison missing the inner forearm");
  await page.close();
}
{
  const { page } = await open("/en/who-to-see/surgeon/", { width: 1280 });
  const surgery = page.locator("#diagram-surgery-options");
  await surgery.getByRole("button", { name: /^7\s*Nerve to the voice box/ }).click();
  (await surgery.getByText("can make the voice hoarse", { exact: false }).count()) > 0 ? pass("surgery: the view from above explains the nerve to the voice box") : fail("surgery: voice nerve note missing");
  await page.close();
}
{
  const { page } = await open("/en/who-to-see/tai-chi/", { width: 390 });
  const bal = page.locator("#diagram-balance");
  await bal.getByRole("group", { name: "Stance" }).getByRole("button", { name: "Bow stance", exact: true }).click();
  await bal.getByRole("button", { name: "Front foot · 90%", exact: true }).click();
  (await bal.getByText("90%").count()) > 0 ? pass("balance: the bow stance shifts 90% onto the front foot") : fail("balance: weight shift missing");
  await page.close();
}
{
  const { page } = await open("/es/who-to-see/homeopathy/", { width: 390 });
  const dil = page.locator("#diagram-dilution");
  await dil.getByRole("button", { name: "X o D: 1 en 10", exact: true }).click();
  (await dil.getByText("Desde 24X", { exact: false }).count()) > 0 ? pass("dilution: on the 1-in-10 scale the last molecule goes after 24X (es)") : fail("dilution: X scale crossover missing");
  await page.close();
}
{
  const { page } = await open("/en/who-to-see/physio/", { width: 390 });
  const glide = page.locator("#diagram-nerve-glide");
  await glide.getByRole("button", { name: "Ulnar nerve", exact: true }).click();
  await glide.getByRole("button", { name: "The test position", exact: true }).click();
  (await glide.getByText("Tensioner: both ends pulled").count()) > 0 ? pass("nerve glide: the ulnar test position is a tensioner") : fail("nerve glide: ulnar test position wrong");
  await glide.getByRole("button", { name: "A slider", exact: true }).click();
  (await glide.getByText("slides toward the hand end").count()) > 0 ? pass("nerve glide: the slider says which way the nerve moves") : fail("nerve glide: slider direction missing");
  await page.close();
}
{
  const { page } = await open("/es/who-to-see/chiropractor/", { width: 1280 });
  const grades = page.locator("#diagram-mobilisation-grades");
  await grades.getByRole("button", { name: "Rígida", exact: true }).click();
  (await grades.getByText("El límite llega antes", { exact: false }).count()) > 0 ? pass("grades: a stiff joint moves the limit (es)") : fail("grades: stiff state missing");
  await page.close();
}
{
  const { page } = await open("/en/who-to-see/massage/", { width: 1280 });
  const chart = page.locator("#diagram-neck-muscles");
  await chart.getByRole("region", { name: "Key: tap any muscle" }).getByRole("button", { name: /^12\s*Anterior scalene/ }).click();
  const chips = await chart.getByRole("link", { name: /^C[5-7]$/ }).allTextContents();
  chips.join(",") === "C5,C6,C7" ? pass("neck muscles: the scalenes' pain map matches the C5-C7 roots") : fail(`neck muscles: scalene roots were ${chips.join(",")}`);
  (await chart.locator("svg text", { hasText: "Nerves to the arm" }).count()) > 0 ? pass("neck muscles: picking a scalene turns to a view with the nerves to the arm") : fail("neck muscles: scalene view missing");
  await chart.getByRole("button", { name: "Pressure guide", exact: true }).click();
  (await chart.locator("figcaption", { hasText: "No pressure" }).count()) > 0 ? pass("neck muscles: the pressure guide has a no-pressure key") : fail("neck muscles: pressure key missing");
  await page.close();
}
{
  const { page } = await open("/es/who-to-see/cupping/", { width: 390 });
  const cup = page.locator("#diagram-cupping-skin");
  await cup.getByRole("button", { name: "Fuerte", exact: true }).click();
  await cup.locator('section input[type="range"]').fill("14");
  (await cup.getByText("Días después: 14").count()) > 0 ? pass("cupping: the marks can be followed for two weeks (es)") : fail("cupping: days slider missing");
  await page.close();
}
{
  const { page } = await open("/en/who-to-see/homeopathy/", { width: 390 });
  await page.getByRole("button", { name: "30C", exact: true }).click();
  (await page.getByText(/about 1 in 10\^36/).count()) > 0 ? pass("dilution: 30C leaves about a 1 in 10^36 chance of one molecule") : fail("dilution: 30C chance wrong");
  await page.getByRole("button", { name: "200C", exact: true }).click();
  (await page.getByText(/10\^376/).count()) > 0 ? pass("dilution: 200C is stated, not shown as infinity") : fail("dilution: 200C chance wrong");
  await page.close();
}
{
  const { page } = await open("/en/who-to-see/reflexology/", { width: 1280 });
  const key = page.getByRole("region", { name: "Key: tap any zone" });
  (await key.getByRole("button").count()) >= 36 ? pass("foot map: the key lists every zone") : fail("foot map: key is short");
  (await page.getByText("The chart's neck is wired to the low back", { exact: false }).count()) > 0 ? pass("foot map: the neck zone traces to L4-L5") : fail("foot map: neck note missing");
  await page.getByRole("button", { name: "The real nerves" }).click();
  (await page.locator("svg text", { hasText: "Medial plantar" }).count()) > 0 ? pass("foot map: nerve view draws the medial plantar territory") : fail("foot map: nerve view missing");
  await page.getByRole("button", { name: "What's underneath" }).click();
  (await page.locator("svg text", { hasText: "Sesamoids" }).count()) > 0 ? pass("foot map: bone view labels the sesamoids") : fail("foot map: bone view missing");
  await page.close();
}
{
  // Phones show one foot. Picking a left-only zone has to bring the left foot up.
  const { page } = await open("/en/who-to-see/reflexology/", { width: 390 });
  (await page.locator("svg text", { hasText: "RIGHT" }).count()) === 1 && (await page.locator("svg text", { hasText: "LEFT" }).count()) === 0
    ? pass("foot map: a phone starts on one foot")
    : fail("foot map: phone shows the wrong feet");
  await page.getByRole("region", { name: "Key: tap any zone" }).getByRole("button", { name: /^9\s*Heart/ }).click();
  (await page.locator("svg text", { hasText: "LEFT" }).count()) === 1 ? pass("foot map: picking the heart switches to the left foot") : fail("foot map: heart stayed on the right foot");
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
