import { SHAPES, shapesFor, SILHOUETTE } from "@/lib/bodyShapes";
import { examFor, mapAdvice, matchRoots, parsePickKey, pickKey, REGIONS, type Pick, type Symptom } from "@/lib/regions";

const picks = (...ids: string[]): Pick[] => ids.map((region) => ({ region, side: "R" }));
const top = (p: Pick[], s: Symptom[] = ["tingling"]) => matchRoots(p, s)[0];

describe("matching tapped areas to roots", () => {
  it("thumb, index finger and outer forearm point to C6", () => {
    const m = top(picks("thumb", "index", "outer-forearm"));
    expect(m?.rootId).toBe("C6");
    expect(m?.fit).toBe("strong");
  });

  it("the middle finger points to C7", () => {
    expect(top(picks("middle", "back-forearm"))?.rootId).toBe("C7");
  });

  it("the little and ring fingers point to C8", () => {
    expect(top(picks("little", "ring", "palm-little-side"))?.rootId).toBe("C8");
  });

  it("outer shin, top of foot and big toe point to L5", () => {
    expect(top(picks("outer-shin", "foot-top"))?.rootId).toBe("L5");
  });

  it("outer foot, calf and heel point to S1", () => {
    expect(top(picks("outer-foot", "calf", "heel"))?.rootId).toBe("S1");
  });

  it("discounts pain alone, because pain is often referred", () => {
    const tingling = top(picks("thumb"), ["tingling"])!.score;
    const pain = top(picks("thumb"), ["pain"])!.score;
    expect(pain).toBeLessThan(tingling);
  });

  it("counts both sides of the same area once", () => {
    const one = matchRoots([{ region: "thumb", side: "R" }], ["numbness"]);
    const both = matchRoots([{ region: "thumb", side: "R" }, { region: "thumb", side: "L" }], ["numbness"]);
    expect(both[0]!.score).toBe(one[0]!.score);
  });

  it("does not invent a root for the face or the low back alone", () => {
    expect(matchRoots(picks("face"), ["numbness"])).toEqual([]);
    expect(matchRoots(picks("low-back"), ["pain"])).toEqual([]);
  });
});

describe("advice", () => {
  it("treats saddle numbness as an emergency", () => {
    const advice = mapAdvice([{ region: "saddle", side: "C" }], ["numbness"]);
    expect(advice[0]).toMatchObject({ id: "saddle", level: "emergency" });
  });

  it("flags symptoms in both arms", () => {
    const advice = mapAdvice([{ region: "thumb", side: "R" }, { region: "little", side: "L" }], ["tingling"]);
    expect(advice.some((a) => a.id === "bilateral" && a.level === "urgent")).toBe(true);
  });

  it("does not flag one arm as bilateral", () => {
    const advice = mapAdvice(picks("thumb", "index", "outer-forearm"), ["tingling"]);
    expect(advice.some((a) => a.id === "bilateral")).toBe(false);
  });

  it("sends weakness for a proper exam", () => {
    expect(mapAdvice(picks("thumb"), ["weakness"]).some((a) => a.id === "weakness")).toBe(true);
  });

  it("picks the neck or low-back exam from the strongest root", () => {
    expect(examFor(matchRoots(picks("thumb"), ["numbness"]))).toBe("cervical");
    expect(examFor(matchRoots(picks("heel"), ["numbness"]))).toBe("lumbar");
    expect(examFor([])).toBeNull();
  });
});

describe("tappable shapes", () => {
  it("gives every region something to tap, in its own view", () => {
    for (const region of REGIONS) {
      expect(SHAPES.some((s) => s.region === region.id && s.view === region.view)).toBe(true);
    }
  });

  it("belongs every shape to a real region", () => {
    for (const shape of SHAPES) expect(REGIONS.find((r) => r.id === shape.region)).toBeDefined();
  });

  it("draws limbs on both sides", () => {
    for (const region of REGIONS.filter((r) => r.limb && r.view !== "hand")) {
      const sides = new Set(SHAPES.filter((s) => s.region === region.id).map((s) => s.side));
      expect([...sides].sort()).toEqual(["L", "R"]);
    }
    expect(shapesFor("hand", "L").length).toBe(shapesFor("hand", "R").length);
  });

  it("has no broken path data", () => {
    for (const d of [...SHAPES.map((s) => s.d), ...SILHOUETTE]) {
      expect(d).toMatch(/^M/);
      expect(d).not.toMatch(/NaN|undefined/);
    }
  });

  it("round-trips pick keys", () => {
    expect(parsePickKey(pickKey({ region: "thumb", side: "L" }))).toEqual({ region: "thumb", side: "L" });
    expect(parsePickKey("thumb|X")).toBeUndefined();
  });
});
