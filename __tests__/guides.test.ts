import { CLINICIANS } from "@/lib/clinicians";
import { TREATMENTS } from "@/lib/evidence";
import { GUIDES, guideById } from "@/lib/guides";
import { parsePath, pathFor, routeFromHash } from "@/standalone/router";

describe("clinician guides", () => {
  it("has exactly one guide per profession on the Who to see page", () => {
    expect(GUIDES.map((g) => g.id).sort()).toEqual(CLINICIANS.map((c) => c.id).sort());
  });

  it("links only to treatments on the evidence board", () => {
    const known = new Set(TREATMENTS.map((t) => t.id));
    for (const g of GUIDES) for (const u of g.uses) expect({ guide: g.id, use: u, known: known.has(u) }).toEqual({ guide: g.id, use: u, known: true });
  });

  it("gives every guide a first visit, signs both ways, questions and a source", () => {
    for (const g of GUIDES) {
      expect(g.firstVisit.length).toBeGreaterThanOrEqual(3);
      expect(g.goodSigns.length).toBeGreaterThan(0);
      expect(g.warningSigns.length).toBeGreaterThan(0);
      expect(g.questions.length).toBeGreaterThan(0);
      expect(g.uses.length).toBeGreaterThan(0);
      expect(g.sources.length).toBeGreaterThan(0);
    }
  });

  it("asks about neck manipulation risk before it happens", () => {
    const chiro = guideById("chiropractor")!;
    expect(chiro.firstVisit.some((f) => /dizziness/.test(f.en))).toBe(true);
    expect(chiro.sources).toContain("biller2014");
  });

  it("flags prepaid packages and organ claims in chiropractic care", () => {
    const signs = guideById("chiropractor")!.warningSigns.map((s) => s.en).join(" ");
    expect(signs).toMatch(/prepaid package/);
    expect(signs).toMatch(/organs/);
  });
});

describe("single-file router", () => {
  it("routes a guide path and round-trips it", () => {
    const route = parsePath("/es/who-to-see/physio/");
    expect(route).toEqual({ locale: "es", slug: "who-to-see", id: "physio" });
    expect(pathFor(route!)).toBe("/es/who-to-see/physio/");
  });

  it("refuses sub-pages that don't exist", () => {
    expect(parsePath("/en/who-to-see/astrologer/")).toBeNull();
    expect(parsePath("/en/spine/physio/")).toBeNull();
  });

  it("still routes plain pages and the new spine pages", () => {
    expect(parsePath("/en/organs/")).toEqual({ locale: "en", slug: "organs" });
    expect(parsePath("/es/vertebra")).toEqual({ locale: "es", slug: "vertebra" });
    expect(parsePath("/en/")).toEqual({ locale: "en", slug: "" });
  });

  it("opens a guide from a shareable hash", () => {
    expect(routeFromHash("#es-who-to-see/chiropractor")).toEqual({ locale: "es", slug: "who-to-see", id: "chiropractor" });
    expect(routeFromHash("#en-tracker")).toEqual({ locale: "en", slug: "tracker" });
    expect(routeFromHash("#root-C6")).toBeNull();
  });
});
