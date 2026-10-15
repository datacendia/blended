import { balanceState, convexHull, margin, polygonArea, STANCES } from "@/lib/diagrams/balance";
import { bruising, DAYS_MAX, FADE_DAYS, markLevel, markStrength } from "@/lib/diagrams/cupping";
import { chanceLog10, chanceOfOne, expectedLog10, scientific } from "@/lib/diagrams/dilution";
import { FOOT_BOX, NERVE_AREAS, NERVES, STRUCTURES, zoneById, ZONES, zonesFor } from "@/lib/diagrams/foot";
import { HEAD_ANGLES, modelLoad } from "@/lib/diagrams/headLever";
import { MIMICS } from "@/lib/diagrams/mimics";
import { GRADES, gradeSpan, JOINT_STATES } from "@/lib/diagrams/mobilisation";
import { DEMANDS, POSES } from "@/lib/diagrams/neckLoad";
import { lookalikeRoots, muscleById, MUSCLES, NECK_BOX, PAINT_ORDER } from "@/lib/diagrams/neckMuscles";
import { boneDepth, layerAt, layers, NEEDLE_LENGTH, riskAt, SITES, tipDepth, type Build } from "@/lib/diagrams/needle";
import { glideKind, nerveTension, REST_POSE, SLIDER_POSE, slideToward, TEST_POSE, type Pose } from "@/lib/diagrams/nerveGlide";
import { likelyStage, PATHWAY_STAGES, REVIEW_WEEKS } from "@/lib/diagrams/pathway";
import { GUIDE_DIAGRAMS } from "@/lib/diagrams/registry";
import { surgeryOpening, SURGERY_OPTIONS } from "@/lib/diagrams/surgery";
import { CLINICIANS } from "@/lib/clinicians";
import { GUIDE_PAGES } from "@/lib/guides";
import { REGIONS } from "@/lib/regions";

describe("every guide has an interactive diagram", () => {
  it("gives each profession and practice at least one", () => {
    for (const g of GUIDE_PAGES) expect({ id: g.id, count: (GUIDE_DIAGRAMS[g.id] ?? []).length > 0 }).toEqual({ id: g.id, count: true });
  });

  it("shows every profession where it sits in the care pathway, plus one of its own", () => {
    for (const c of CLINICIANS) {
      expect(GUIDE_DIAGRAMS[c.id]?.[0]).toBe("care-pathway");
      expect(GUIDE_DIAGRAMS[c.id]!.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("lists diagrams only for guides that exist", () => {
    const ids = new Set(GUIDE_PAGES.map((g) => g.id));
    for (const key of Object.keys(GUIDE_DIAGRAMS)) expect(ids.has(key)).toBe(true);
  });
});

describe("care pathway", () => {
  const base = { weeks: 2, better: false, warning: false, severeAfterCare: false };
  it("starts with first-line care", () => expect(likelyStage(base)).toBe("first"));
  it("asks for a medical review at six weeks without clear improvement", () => {
    expect(REVIEW_WEEKS).toBe(6);
    expect(likelyStage({ ...base, weeks: 6 })).toBe("review");
    expect(likelyStage({ ...base, weeks: 8, better: true })).toBe("first");
  });
  it("lets warning signs override everything", () => {
    expect(likelyStage({ ...base, weeks: 20, severeAfterCare: true, warning: true })).toBe("warning");
  });
  it("brings in a surgeon only for severe pain after months of care", () => {
    expect(likelyStage({ ...base, weeks: 20 })).toBe("review");
    expect(likelyStage({ ...base, weeks: 20, severeAfterCare: true })).toBe("surgery");
  });
  it("places every profession on the map", () => {
    const placed = new Set(PATHWAY_STAGES.flatMap((s) => s.who));
    for (const c of CLINICIANS) expect(placed.has(c.id)).toBe(true);
  });
});

describe("neck root or a nerve further down", () => {
  const known = new Set(REGIONS.map((r) => r.id));
  const m = (id: string) => MIMICS.find((x) => x.id === id)!;
  it("shades only regions the body map knows", () => {
    for (const x of MIMICS) for (const r of Object.keys(x.weights)) expect({ mimic: x.id, r, known: known.has(r) }).toEqual({ mimic: x.id, r, known: true });
  });
  it("spares the forearm and the base of the thumb in carpal tunnel", () => {
    expect(m("carpal").weights["outer-forearm"]).toBeUndefined();
    expect(m("carpal").weights["palm-thumb-side"]).toBeUndefined();
    expect(m("carpal").weights.middle).toBe(1);
  });
  it("tells a C8 root from the ulnar nerve by the inner forearm", () => {
    expect(m("c8").weights["inner-forearm"]).toBe(1);
    expect(m("ulnar").weights["inner-forearm"]).toBeUndefined();
  });
});

describe("nerve gliding", () => {
  const nerves = ["median", "radial", "ulnar"] as const;
  it("makes each nerve's standard test position a tensioner, and its slider a slider", () => {
    for (const n of nerves) {
      expect({ n, kind: glideKind(n, TEST_POSE[n]) }).toEqual({ n, kind: "tensioner" });
      expect({ n, kind: glideKind(n, SLIDER_POSE[n]) }).toEqual({ n, kind: "slider" });
      expect(slideToward(n, SLIDER_POSE[n])).toBe("hand");
    }
  });

  it("pulls hardest on the nerve whose test it is", () => {
    for (const n of nerves) for (const other of nerves.filter((x) => x !== n)) expect(nerveTension(n, TEST_POSE[n])).toBeGreaterThan(nerveTension(other, TEST_POSE[n]));
  });

  it("loads the ulnar nerve with a bent elbow and the median and radial with a straight one", () => {
    const bent: Pose = { head: "neutral", shoulder: "relaxed", elbow: "bent", forearm: "up", wrist: "neutral" };
    const straight: Pose = { ...bent, elbow: "straight" };
    expect(nerveTension("ulnar", bent)).toBeGreaterThan(nerveTension("ulnar", straight));
    expect(nerveTension("median", straight)).toBeGreaterThan(nerveTension("median", bent));
    expect(nerveTension("radial", straight)).toBeGreaterThan(nerveTension("radial", bent));
  });

  it("has a most-slack position for each nerve", () => {
    for (const n of nerves) expect({ n, kind: glideKind(n, REST_POSE[n]) }).toEqual({ n, kind: "slack" });
  });
});

describe("mobilisation grades", () => {
  it("keeps I-IV within the range and takes only V past the limit", () => {
    for (const g of GRADES.filter((x) => x.id !== "V")) expect(g.to).toBeLessThanOrEqual(1);
    expect(GRADES.find((x) => x.id === "V")!.to).toBeGreaterThan(1);
  });
  it("makes II and III large movements and I and IV small ones", () => {
    const span = (id: string) => {
      const g = GRADES.find((x) => x.id === id)!;
      return g.to - g.from;
    };
    expect(span("II")).toBeGreaterThan(span("I"));
    expect(span("III")).toBeGreaterThan(span("IV"));
  });
  it("stops grade II short of the first resistance in every joint state", () => {
    for (const st of ["normal", "stiff", "painful"] as const) expect(gradeSpan("II", st).to).toBeLessThan(JOINT_STATES[st].r1);
  });
  it("moves every grade with the limit: a stiff joint's IV sits before the normal end of range", () => {
    expect(gradeSpan("IV", "stiff").to).toBeLessThan(gradeSpan("IV", "normal").to);
    expect(gradeSpan("IV", "stiff").to).toBeLessThanOrEqual(JOINT_STATES.stiff.limit);
    expect(gradeSpan("V", "stiff").to).toBeGreaterThan(JOINT_STATES.stiff.limit);
  });
});

describe("surgery options", () => {
  it("leaves the root with little room before surgery, and free after each operation", () => {
    expect(surgeryOpening("wait").state).toBe("touching");
    for (const o of SURGERY_OPTIONS.filter((x) => x.id !== "wait")) expect(surgeryOpening(o.id).state).toBe("free");
  });
});

describe("balance", () => {
  const base = (s: keyof typeof STANCES) => convexHull(STANCES[s].feet.flat());
  it("has the biggest base in the tai chi stance and the smallest on one leg", () => {
    expect(polygonArea(base("tai-chi"))).toBeGreaterThan(polygonArea(base("together")));
    expect(polygonArea(base("together"))).toBeGreaterThan(polygonArea(base("one-leg")));
  });
  it("is steady in the middle and has to step when leaning past the base", () => {
    expect(balanceState([120, 120], base("together"))).toBe("steady");
    expect(balanceState([120, 40], base("together"))).toBe("step");
    expect(margin([120, 40], base("together"))).toBeLessThan(0);
  });
  it("keeps a forward lean inside the tai chi stance that would topple feet-together", () => {
    expect(balanceState([130, 60], base("together"))).toBe("step");
    expect(balanceState([130, 60], base("tai-chi"))).not.toBe("step");
  });
});

describe("neck load in yoga and Pilates", () => {
  it("cites the narrowing finding for every pose that tips the head back or turns it", () => {
    for (const d of ["extension", "rotation"] as const) expect(DEMANDS[d].sources).toContain("yoo1992");
  });
  it("tells someone with a trapped nerve to avoid headstands and shoulder stands", () => {
    for (const id of ["headstand", "shoulder-stand", "plough"]) expect(POSES.find((p) => p.id === id)?.advice).toBe("avoid");
  });
  it("offers every set something usually fine, something to change and something to avoid", () => {
    for (const set of ["yoga", "pilates"] as const) {
      const advice = new Set(POSES.filter((p) => p.set === set).map((p) => p.advice));
      expect([...advice].sort()).toEqual(["avoid", "fine", "modify"]);
    }
  });
});

describe("head-forward lever", () => {
  it("only gives the figures the model reported, rising with the angle", () => {
    const loads = HEAD_ANGLES.map((a) => modelLoad(a.deg));
    expect(loads).toEqual([...loads].sort((a, b) => a - b));
    expect(modelLoad(60)).toBeCloseTo(27.2);
    expect(() => modelLoad(20)).toThrow();
  });
});

describe("neck muscle chart", () => {
  it("numbers every muscle once, 1 to n, and draws each in at least one view", () => {
    expect(MUSCLES.map((m) => m.n)).toEqual(MUSCLES.map((_, i) => i + 1));
    expect(new Set(MUSCLES.map((m) => m.id)).size).toBe(MUSCLES.length);
    for (const m of MUSCLES) expect({ id: m.id, views: Object.keys(m.views).length > 0 }).toEqual({ id: m.id, views: true });
  });

  it("paints every muscle, each exactly once", () => {
    expect([...PAINT_ORDER].sort()).toEqual(MUSCLES.map((m) => m.id).sort());
  });

  it("puts every number inside the figure", () => {
    for (const m of MUSCLES)
      for (const v of Object.values(m.views)) {
        const [x, y] = v!.at;
        expect({ id: m.id, inside: x > 6 && x < NECK_BOX.width - 6 && y > 6 && y < NECK_BOX.height - 6 }).toEqual({ id: m.id, inside: true });
      }
  });

  it("maps pain only to real body-map regions, and only where a pain map is given", () => {
    const known = new Set(REGIONS.map((r) => r.id));
    for (const m of MUSCLES) {
      for (const r of m.refers) expect({ id: m.id, region: r, known: known.has(r) }).toEqual({ id: m.id, region: r, known: true });
      expect({ id: m.id, mapped: m.felt !== null }).toEqual({ id: m.id, mapped: m.refers.length > 0 });
    }
  });

  it("matches the scalenes to the C5-C7 pattern, the pectoralis minor to C8 and the upper trapezius to the upper neck", () => {
    for (const id of ["anterior-scalene", "middle-scalene", "posterior-scalene"]) expect(lookalikeRoots(muscleById(id)!)).toEqual(["C5", "C6", "C7"]);
    expect(lookalikeRoots(muscleById("pectoralis-minor")!)).toContain("C8");
    expect(lookalikeRoots(muscleById("upper-trapezius")!)).toEqual(["C2", "C3"]);
  });

  it("never allows firm pressure next to the carotid artery or the nerves to the arm", () => {
    for (const id of ["scm", "anterior-scalene", "middle-scalene", "posterior-scalene", "suboccipitals"]) expect(muscleById(id)!.pressure).toBe("gentle");
    for (const id of ["infrahyoids", "longus-colli"]) expect(muscleById(id)!.pressure).toBe("avoid");
  });
});

describe("needle depth", () => {
  const deepest = (build: Build, angle: "straight" | "angled") => layerAt(tipDepth(1, angle), build);
  it("reaches the lung with a full-length straight needle in a slim or average build", () => {
    expect(deepest("slim", "straight")).toBe("lung");
    expect(deepest("average", "straight")).toBe("lung");
    expect(riskAt("lung")).toBe("danger");
  });
  it("stays short of the lung when angled, in every build", () => {
    for (const b of ["slim", "average", "larger"] as const) expect(deepest(b, "angled")).not.toBe("lung");
  });
  it("starts in the skin", () => {
    expect(layerAt(tipDepth(0.02, "straight"), "average")).toBe("skin");
    expect(tipDepth(1, "straight")).toBe(NEEDLE_LENGTH);
  });

  it("numbers the sites 1 to n and keeps them on the map", () => {
    expect(SITES.map((s) => s.n)).toEqual(SITES.map((_, i) => i + 1));
    for (const s of SITES) expect({ id: s.id, inside: s.at[0] > 150 && s.at[0] < 260 && s.at[1] > 0 && s.at[1] < 230 }).toEqual({ id: s.id, inside: true });
  });

  it("starts every site at the skin, and ends it at the pleura wherever the lung is beneath", () => {
    for (const s of SITES) {
      expect(s.profile[0]![0]).toBe("skin");
      expect({ id: s.id, end: s.profile[s.profile.length - 1]![0] === "pleura" }).toEqual({ id: s.id, end: s.lungBeneath });
    }
  });

  it("stops the needle on bone over the shoulder blade and beside the spine, in every build", () => {
    for (const site of ["blade-centre", "next-to-spine"] as const)
      for (const b of ["slim", "average", "larger"] as const) {
        const d = tipDepth(1, "straight", boneDepth(b, site));
        expect(riskAt(layerAt(d, b, site))).toBe("bone");
      }
  });

  it("has no bone between the needle and the top of the lung at the top of the shoulder", () => {
    expect(boneDepth("slim", "top-shoulder")).toBe(Infinity);
    expect(layers("slim", "top-shoulder").map((l) => l.id)).not.toContain("ribs");
    expect(layerAt(tipDepth(1, "straight"), "average", "top-shoulder")).toBe("lung");
  });
});

describe("cupping marks", () => {
  it("darken with stronger suction and longer time", () => {
    expect(bruising("strong", 5)).toBeGreaterThan(bruising("light", 5));
    expect(bruising("medium", 12)).toBeGreaterThan(bruising("medium", 2));
    expect(markLevel(bruising("strong", 15))).toBe("purple");
    expect(markLevel(bruising("light", 1))).toBe("none");
  });

  it("fade over days, the darker marks lasting longer, and all gone by the end of the slider", () => {
    expect(FADE_DAYS.purple).toBeGreaterThan(FADE_DAYS.red);
    expect(FADE_DAYS.red).toBeGreaterThan(FADE_DAYS.pink);
    for (const l of ["pink", "red", "purple"] as const) {
      expect(markStrength(l, 0)).toBe(1);
      expect(markStrength(l, 1)).toBeLessThan(1);
      expect(markStrength(l, DAYS_MAX)).toBe(0);
    }
    expect(markStrength("purple", 3)).toBeGreaterThan(markStrength("red", 3));
  });
});

describe("reflexology chart, checked", () => {
  const roots = ["L3", "L4", "L5", "S1", "S2"];
  it("traces every zone of the sole to roots between L3 and S2", () => {
    for (const z of ZONES) {
      expect(z.nerves.length).toBeGreaterThan(0);
      for (const n of z.nerves) {
        const [a, b] = NERVES[n].roots.split("-");
        expect(roots).toContain(a);
        expect(roots).toContain(b);
      }
    }
  });
  it("draws the chart in full detail: over thirty zones on each foot, numbered once each", () => {
    expect(zonesFor("left").length).toBeGreaterThanOrEqual(30);
    expect(zonesFor("right").length).toBeGreaterThanOrEqual(30);
    const numbers = ZONES.map((z) => z.n);
    expect(new Set(numbers).size).toBe(numbers.length);
    expect(new Set(ZONES.map((z) => z.id)).size).toBe(ZONES.length);
  });
  it("puts the heart and spleen on the left foot and the liver and gallbladder on the right, as charts do", () => {
    expect(zonesFor("left").map((z) => z.id)).toEqual(expect.arrayContaining(["heart", "spleen", "descending-colon", "sigmoid", "rectum"]));
    expect(zonesFor("left").map((z) => z.id)).not.toContain("liver");
    expect(zonesFor("right").map((z) => z.id)).toEqual(expect.arrayContaining(["liver", "gallbladder", "ascending-colon", "appendix"]));
    expect(zonesFor("right").map((z) => z.id)).not.toContain("heart");
  });
  it("says what is under the thumb for every zone, from the anatomy list", () => {
    for (const z of ZONES) {
      expect(z.under.length).toBeGreaterThan(0);
      for (const u of z.under) expect(STRUCTURES[u]).toBeDefined();
    }
  });
  it("wires the chart's neck to the low back", () => {
    const neck = zoneById("neck")!;
    expect(neck.nerves.map((n) => NERVES[n].roots)).toEqual(["L4-L5"]);
  });
  it("keeps every zone's number inside the drawing", () => {
    for (const z of ZONES) {
      expect(z.at[0]).toBeGreaterThanOrEqual(0);
      expect(z.at[0]).toBeLessThanOrEqual(FOOT_BOX.width);
      expect(z.at[1]).toBeGreaterThanOrEqual(0);
      expect(z.at[1]).toBeLessThanOrEqual(FOOT_BOX.height);
    }
  });
  it("draws a territory for every nerve it names", () => {
    const drawn = new Set(NERVE_AREAS.map((a) => a.nerve));
    for (const z of ZONES) for (const n of z.nerves) expect(drawn.has(n)).toBe(true);
  });
});

describe("homeopathic dilution", () => {
  it("passes one expected molecule between 11C and 12C", () => {
    expect(expectedLog10(11)).toBeGreaterThan(0);
    expect(expectedLog10(12)).toBeLessThan(0);
    expect(chanceOfOne(12)).toBeCloseTo(0.45, 2);
  });
  it("leaves about 6 × 10^-37 molecules at 30C", () => {
    const { mantissa, exponent } = scientific(expectedLog10(30));
    expect(exponent).toBe(-37);
    expect(mantissa).toBeCloseTo(6.02, 2);
  });
  it("states the chance at 200C as a power of ten, where the plain number underflows to 0", () => {
    expect(chanceOfOne(200)).toBe(0);
    expect(chanceLog10(200)).toBeCloseTo(-376.2, 1);
    expect(Number.isFinite(chanceLog10(200))).toBe(true);
    expect(chanceLog10(13)).toBeCloseTo(Math.log10(chanceOfOne(13)), 6);
  });
});
