import { averagingChecks, compareScans, headWeightRatio, noiseFloor, pairChecks, SAMPLE_SCAN, signedSideMean, viewTotal, type Scan } from "@/lib/posture";

/**
 * The sample is the real report this project started from. These tests pin
 * what RootAtlas says about it, so a change to the maths that would quietly
 * change the story a patient reads has to be made on purpose.
 */
describe("checking a posture report against itself", () => {
  it("finds the side photos pointing opposite ways for shoulder and hip", () => {
    const lateral = pairChecks(SAMPLE_SCAN).filter((c) => c.pair === "lateral");
    const opposite = lateral.filter((c) => c.directionsDisagree).map((c) => c.segment);
    expect(opposite).toEqual(["shoulder", "hip"]);
    expect(lateral.find((c) => c.segment === "shoulder")!.gap).toBeCloseTo(5.87, 2);
    expect(lateral.find((c) => c.segment === "knee")!.agreement).toBe("good");
  });

  it("works out the scan's own margin of error from the photo pairs", () => {
    // Median of the eight between-photo gaps: (1.82 + 1.93) / 2.
    expect(noiseFloor(SAMPLE_SCAN)).toBeCloseTo(1.875, 1);
  });

  it("catches a printed average that adds up shifts in opposite directions", () => {
    const checks = averagingChecks(SAMPLE_SCAN);
    const flagged = checks.filter((c) => c.hidesOppositeDirections);
    expect(flagged.map((c) => c.segment)).toEqual(["shoulder", "hip"]);
    const shoulder = flagged[0]!;
    expect(shoulder.printed).toBe(2.93);
    expect(shoulder.magnitudeMean).toBeCloseTo(2.94, 1);
    expect(shoulder.signedMean).toBeLessThan(0); // backward, not "2.93"
  });

  it("does not flag segments where the photos agree on direction", () => {
    const head = averagingChecks(SAMPLE_SCAN).find((c) => c.segment === "head")!;
    expect(head.hidesOppositeDirections).toBe(false);
  });

  it("reproduces the report's totals as sums of sizes", () => {
    expect(viewTotal(SAMPLE_SCAN.right).t).toBeCloseTo(20.6, 1);
    expect(viewTotal(SAMPLE_SCAN.left).t).toBeCloseTo(11.3, 1);
    expect(viewTotal(SAMPLE_SCAN.right).a).toBeCloseTo(37.0, 1);
  });

  it("reads the effective head weight as a ratio", () => {
    expect(headWeightRatio(SAMPLE_SCAN)).toBeCloseTo(3.31, 2);
  });

  it("keeps direction in the side-photo average", () => {
    expect(signedSideMean(SAMPLE_SCAN, "head")).toBeCloseTo(5.86, 1);
    expect(signedSideMean(SAMPLE_SCAN, "shoulder")).toBeCloseTo(-1.82, 1);
  });
});

describe("comparing scans", () => {
  const shifted = (cm: number): Scan => ({
    ...SAMPLE_SCAN,
    id: "after",
    right: { ...SAMPLE_SCAN.right, head: { t: SAMPLE_SCAN.right.head.t! - cm, a: 10 } },
    left: { ...SAMPLE_SCAN.left, head: { t: SAMPLE_SCAN.left.head.t! - cm, a: 8 } }
  });

  it("calls a small change noise", () => {
    const { changes } = compareScans(SAMPLE_SCAN, shifted(1));
    expect(changes.find((c) => c.segment === "head")).toMatchObject({ beyondNoise: false });
  });

  it("calls a change bigger than both scans' noise real", () => {
    const { changes } = compareScans(SAMPLE_SCAN, shifted(4));
    const head = changes.find((c) => c.segment === "head")!;
    expect(head.improvement).toBeCloseTo(4, 1);
    expect(head.beyondNoise).toBe(true);
  });
});
