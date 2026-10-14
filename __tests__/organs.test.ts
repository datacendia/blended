import {
  hasSacralSupply,
  organById,
  ORGANS,
  organsAt,
  POSTER_CHECKS,
  SACRAL_OUTFLOW,
  SEGMENTS,
  segmentNote,
  segmentsBetween,
  SYMPATHETIC_OUTFLOW
} from "@/lib/organs";

/**
 * The organ-wiring page exists to correct the wall poster, so the rules it
 * teaches are pinned here: if a range drifts into the neck, the page would
 * be making the poster's mistake.
 */
const sympathetic = new Set(segmentsBetween(SYMPATHETIC_OUTFLOW.from, SYMPATHETIC_OUTFLOW.to));
const sacral = new Set(segmentsBetween(SACRAL_OUTFLOW.from, SACRAL_OUTFLOW.to));

describe("autonomic outflow", () => {
  it("draws 30 spinal nerves, C1 to S5", () => {
    expect(SEGMENTS).toHaveLength(30);
    expect(SEGMENTS[0]).toBe("C1");
    expect(SEGMENTS.at(-1)).toBe("S5");
  });

  it("is T1-L2 for the sympathetic system and S2-S4 for the sacral parasympathetic", () => {
    expect([...sympathetic]).toEqual([...Array.from({ length: 12 }, (_, i) => `T${i + 1}`), "L1", "L2"]);
    expect([...sacral]).toEqual(["S2", "S3", "S4"]);
  });

  it("keeps every organ's sympathetic range inside T1-L2", () => {
    for (const o of ORGANS) {
      for (const s of segmentsBetween(o.sympathetic.from, o.sympathetic.to)) expect({ organ: o.id, s, inside: sympathetic.has(s) }).toEqual({ organ: o.id, s, inside: true });
    }
  });

  it("sends no organ wiring out of the neck or L3-S1", () => {
    for (const s of ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "L3", "L4", "L5", "S1", "S5"]) {
      expect({ s, organs: organsAt(s).length }).toEqual({ s, organs: 0 });
      expect(segmentNote(s)).toBeDefined();
    }
  });

  it("gives the bladder, the end of the bowel and the sexual organs their parasympathetic supply from S2-S4", () => {
    const pelvic = ORGANS.filter(hasSacralSupply).map((o) => o.id).sort();
    expect(pelvic).toEqual(["bladder", "colon-lower", "sexual"]);
    expect(organsAt("S3").map((l) => l.organ.id).sort()).toEqual(["bladder", "colon-lower", "sexual"]);
  });

  it("runs the heart, lungs and upper gut through the vagus, not the spine", () => {
    for (const id of ["heart", "lungs", "stomach", "liver", "pancreas", "small-intestine", "colon-upper"]) {
      expect(organById(id)?.parasympathetic?.nerves).toEqual(["X"]);
    }
  });

  it("has no parasympathetic supply to the adrenals or the skin", () => {
    expect(organById("adrenal")?.parasympathetic).toBeNull();
    expect(organById("skin")?.parasympathetic).toBeNull();
  });

  it("finds the organs a mid-thoracic level serves", () => {
    const t6 = organsAt("T6").map((l) => l.organ.id);
    expect(t6).toEqual(expect.arrayContaining(["stomach", "pancreas", "skin"]));
    expect(t6).not.toContain("heart");
  });

  it("rejects a range written upside down", () => {
    expect(() => segmentsBetween("T4", "T1")).toThrow();
  });
});

describe("poster checks", () => {
  it("cites a source for every verdict", () => {
    for (const check of POSTER_CHECKS) expect(check.sources.length).toBeGreaterThan(0);
  });

  it("says adjustments for organs are unsupported, citing the review", () => {
    const adjust = POSTER_CHECKS.find((c) => c.verdict === "unsupported");
    expect(adjust?.sources).toContain("cote2021");
  });
});
