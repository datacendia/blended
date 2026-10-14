import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { PAGES } from "@/lib/nav";

const APP = join(__dirname, "..", "app", "[locale]");

describe("pages and navigation agree", () => {
  it("has a page for every nav entry", () => {
    for (const p of PAGES) expect({ slug: p.slug, exists: existsSync(join(APP, p.slug, "page.tsx")) }).toEqual({ slug: p.slug, exists: true });
  });

  it("has a guide page under Who to see", () => {
    expect(existsSync(join(APP, "who-to-see", "[id]", "page.tsx"))).toBe(true);
  });

  it("keeps the desktop header to the primary pages, and every page in the phone menu", () => {
    const primary = PAGES.filter((p) => p.primary);
    expect(primary.length).toBeLessThanOrEqual(7);
    expect(primary.map((p) => p.slug)).not.toContain("about");
  });

  it("lists every page in the nav, so nothing is orphaned", () => {
    const dirs = readdirSync(APP, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
    for (const d of dirs) expect(PAGES.map((p) => p.slug)).toContain(d);
  });
});
