import { CLINICIANS } from "@/lib/clinicians";
import { TREATMENTS } from "@/lib/evidence";
import { GUIDE_PAGES, GUIDES, guideById } from "@/lib/guides";
import { PRACTICES, practiceById } from "@/lib/practices";
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

describe("practice guides", () => {
  it("covers acupuncture, tai chi and the practices people in Lima are offered", () => {
    const ids = PRACTICES.map((p) => p.id);
    for (const id of ["acupuncture", "tai-chi", "yoga", "pilates", "dry-needling", "cupping", "huesero"]) expect(ids).toContain(id);
  });

  it("never shares an id with a profession, since both live under /who-to-see/<id>/", () => {
    const ids = GUIDE_PAGES.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toHaveLength(GUIDES.length + PRACTICES.length);
  });

  it("gives every practice a full guide: first session, signs both ways, questions, the neck, training", () => {
    for (const p of PRACTICES) {
      expect({ id: p.id, first: p.firstSession.length >= 2 }).toEqual({ id: p.id, first: true });
      expect(p.goodSigns.length).toBeGreaterThan(0);
      expect(p.warningSigns.length).toBeGreaterThan(0);
      expect(p.questions.length).toBeGreaterThan(0);
      expect(p.neck.en.length).toBeGreaterThan(40);
      expect(p.training.en).not.toBe("");
      expect(p.check.en).not.toBe("");
    }
  });

  it("puts the practices you do yourself in the active group", () => {
    for (const id of ["tai-chi", "yoga", "pilates", "alexander"]) expect(practiceById(id)?.group).toBe("active");
    for (const id of ["acupuncture", "cupping", "huesero", "homeopathy"]) expect(practiceById(id)?.group).toBe("passive");
  });

  it("says plainly where there is no evidence, and grades unsupported practices as such", () => {
    expect(practiceById("homeopathy")?.findings.every((f) => f.verdict === "not-supported")).toBe(true);
    expect(practiceById("reflexology")?.findings.every((f) => f.verdict === "not-supported")).toBe(true);
    expect(practiceById("huesero")?.research.en).toMatch(/no controlled trials/);
  });

  it("warns against forceful neck twisting by a bone-setter and cites the artery evidence", () => {
    const huesero = practiceById("huesero")!;
    expect(huesero.neck.en).toMatch(/forceful twisting/);
    expect(huesero.sources).toContain("biller2014");
  });

  it("names the punctured-lung risk wherever needles go near the upper back", () => {
    for (const id of ["acupuncture", "dry-needling"]) {
      const p = practiceById(id)!;
      expect(p.safety.en).toMatch(/punctured lung/);
      expect(p.sources).toContain("white2004");
    }
  });
});

describe("single-file router", () => {
  it("routes a practice guide too", () => {
    expect(parsePath("/es/who-to-see/acupuncture/")).toEqual({ locale: "es", slug: "who-to-see", id: "acupuncture" });
    expect(routeFromHash("#en-who-to-see/huesero")).toEqual({ locale: "en", slug: "who-to-see", id: "huesero" });
  });

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
