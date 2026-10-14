import { REGIONS } from "@/lib/regions";
import { rootById, rootForDisc, ROOTS, rootsExitingAbove, rootsExitingBelow } from "@/lib/roots";
import { autonomicFor, VERTEBRAE } from "@/lib/spine";
import { PLACED, ROOT_MARKS } from "@/lib/spineGeometry";

describe("vertebrae", () => {
  it("has 7 cervical, 12 thoracic, 5 lumbar, a sacrum and a coccyx, in order", () => {
    const ids = VERTEBRAE.map((v) => v.id);
    expect(ids).toEqual([
      ...Array.from({ length: 7 }, (_, i) => `C${i + 1}`),
      ...Array.from({ length: 12 }, (_, i) => `T${i + 1}`),
      ...Array.from({ length: 5 }, (_, i) => `L${i + 1}`),
      "sacrum",
      "coccyx"
    ]);
  });

  it("names C1 and C2", () => {
    expect(VERTEBRAE[0]!.name?.en).toBe("Atlas");
    expect(VERTEBRAE[1]!.name?.en).toBe("Axis");
  });
});

describe("nerve roots", () => {
  it("has eight cervical roots for seven cervical vertebrae", () => {
    expect(ROOTS.filter((r) => r.region === "cervical").map((r) => r.id)).toEqual(["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8"]);
  });

  it("exits C1-C7 above their own vertebra", () => {
    for (let n = 1; n <= 7; n++) expect(rootById(`C${n}`)!.exitBefore).toBe(`C${n}`);
  });

  it("exits C8 between C7 and T1, with no vertebra of its own", () => {
    expect(rootById("C8")).toMatchObject({ exitAfter: "C7", exitBefore: "T1" });
    expect(rootsExitingBelow("C7").map((r) => r.id)).toEqual(["C8"]);
    expect(rootsExitingAbove("T1").map((r) => r.id)).toEqual(["C8"]);
  });

  it("exits every thoracic and lumbar root below its own vertebra", () => {
    for (const r of ROOTS.filter((x) => x.region === "thoracic" || x.region === "lumbar")) {
      expect(r.exitAfter).toBe(r.id);
    }
  });

  it("maps the common disc levels to the root they usually press on", () => {
    expect(rootForDisc("C5", "C6")).toBe("C6");
    expect(rootForDisc("C6", "C7")).toBe("C7");
    expect(rootForDisc("C7", "T1")).toBe("C8");
    expect(rootForDisc("L4", "L5")).toBe("L5");
    expect(rootForDisc("L5", "sacrum")).toBe("S1");
    expect(rootForDisc("C1", "C2")).toBeUndefined();
  });

  it("gives the classic reflexes to the right roots", () => {
    expect(rootById("C7")!.reflex?.en).toMatch(/triceps/i);
    expect(rootById("C6")!.reflex?.en).toMatch(/brachioradialis/i);
    expect(rootById("S1")!.reflex?.en).toMatch(/ankle/i);
    expect(rootById("L5")!.reflex).toBeNull();
  });

  it("only references roots that exist from the body map", () => {
    for (const region of REGIONS) for (const [id] of region.roots) expect(rootById(id)).toBeDefined();
  });
});

describe("autonomic wiring", () => {
  it("only has sympathetic outflow from T1 to L2", () => {
    for (const v of VERTEBRAE) {
      const sympathetic = autonomicFor(v.id).some((a) => a.system === "sympathetic");
      const inRange = /^T\d+$/.test(v.id) || v.id === "L1" || v.id === "L2";
      expect(sympathetic).toBe(inRange);
    }
  });

  it("puts the parasympathetic outflow at the sacrum and the brainstem, not the mid spine", () => {
    const para = VERTEBRAE.filter((v) => autonomicFor(v.id).some((a) => a.system === "parasympathetic")).map((v) => v.id);
    expect(para.sort()).toEqual(["C1", "sacrum"]);
  });
});

describe("spine layout", () => {
  it("places every vertebra once, inside the drawing", () => {
    expect(PLACED.map((p) => p.id)).toEqual(VERTEBRAE.map((v) => v.id));
    for (const p of PLACED) {
      expect(Number.isFinite(p.x) && Number.isFinite(p.y) && Number.isFinite(p.angle)).toBe(true);
      expect(p.y).toBeGreaterThan(60);
      expect(p.y).toBeLessThan(760);
    }
  });

  it("goes downwards and gets bigger from neck to low back", () => {
    for (let i = 1; i < PLACED.length; i++) expect(PLACED[i]!.y).toBeGreaterThan(PLACED[i - 1]!.y);
    const h = (id: string) => PLACED.find((p) => p.id === id)!.h;
    expect(h("L5")).toBeGreaterThan(h("T6"));
    expect(h("T6")).toBeGreaterThan(h("C4"));
  });

  it("curves like a spine: neck and low back forward, mid back behind", () => {
    const x = (id: string) => PLACED.find((p) => p.id === id)!.x;
    expect(x("C4")).toBeGreaterThan(x("T6"));
    expect(x("L3")).toBeGreaterThan(x("T6"));
  });

  it("marks every root exactly once", () => {
    const marked = ROOT_MARKS.map((m) => m.rootId).sort();
    expect(marked).toEqual(ROOTS.map((r) => r.id).sort());
  });
});
