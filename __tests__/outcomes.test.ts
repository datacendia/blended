import { checkpoints, daysBetween, EMPTY_STATE, exampleState, formatMoney, mcidFor, progress, value, type TrackerState } from "@/lib/outcomes";

const TODAY = "2026-10-14";
const ids = (s: TrackerState) => checkpoints(s, TODAY).map((c) => c.id);

function withScores(limb: number[], sessions: number[] = limb.map((_, i) => i * 3)): TrackerState {
  const base = exampleState("en");
  return {
    ...base,
    checkIns: limb.map((p, i) => ({
      id: `c${i}`,
      date: `2026-09-${String(16 + i * 7).padStart(2, "0")}`,
      sessionsUsed: sessions[i]!,
      limbPain: p,
      axialPain: 4,
      activities: [4, 4, 4],
      numbness: "sometimes" as const,
      flags: []
    }))
  };
}

describe("thresholds", () => {
  it("uses the cervical radiculopathy values for neck-arm problems", () => {
    expect(mcidFor("neck-arm")).toMatchObject({ pain: 2.2, function: 2.0 });
    expect(mcidFor("back")).toMatchObject({ pain: 2.0, function: 2.0 });
  });
});

describe("the real plan: 18 sessions for S/ 1,550", () => {
  const state = exampleState("en");

  it("costs S/ 86.11 a session", () => {
    expect(value(state).costPerSession).toBe(86.11);
  });

  it("charges exactly what was paid when every session is used", () => {
    const done = { ...state, checkIns: state.checkIns.map((c, i, all) => (i === all.length - 1 ? { ...c, sessionsUsed: 18 } : c)) };
    expect(value(done).spent).toBe(1550);
    expect(value(done).remaining).toBe(0);
  });

  it("after six sessions and a one-point drop, is 'some' but not meaningful", () => {
    const p = progress(state);
    expect(p.painLabel).toBe("limb");
    expect(p.painChange).toBe(1);
    expect(p.verdict).toBe("some");
  });

  it("works out what the one point of improvement cost", () => {
    expect(value(state).costPerPainPoint).toBeCloseTo(516.67, 2);
  });

  it("raises the trial checkpoint, the prepaid question and the six-week review", () => {
    expect(ids(state)).toEqual(expect.arrayContaining(["trial", "prepaid", "medical-review"]));
    expect(ids(state)).not.toContain("meaningful");
  });
});

describe("verdicts", () => {
  it("calls a 3-point drop meaningful and stops nagging", () => {
    const s = withScores([7, 5, 4]);
    expect(progress(s).verdict).toBe("meaningful");
    expect(ids(s)).toContain("meaningful");
    expect(ids(s)).not.toContain("trial");
    expect(ids(s)).not.toContain("prepaid");
  });

  it("calls a rise past the threshold worse", () => {
    const s = withScores([4, 5, 7]);
    expect(progress(s).verdict).toBe("worse");
    expect(ids(s)).toContain("worse");
  });

  it("asks for more data with a single check-in", () => {
    const s = withScores([6]);
    expect(progress(s).verdict).toBe("need-data");
    expect(ids(s)).toContain("need-data");
  });

  it("does not use neck pain as the outcome when arm pain was recorded", () => {
    const s = withScores([7, 7, 7]);
    expect(progress(s).painLabel).toBe("limb");
    expect(progress(s).verdict).toBe("no-change");
  });

  it("puts an emergency warning sign first", () => {
    const s = withScores([7, 6]);
    s.checkIns[1]!.flags = ["stroke-signs"];
    expect(checkpoints(s, TODAY)[0]).toMatchObject({ id: "flag-emergency", level: "emergency" });
  });

  it("does not show costs without a price", () => {
    expect(value(EMPTY_STATE).costPerSession).toBeNull();
  });
});

describe("helpers", () => {
  it("counts days across months", () => {
    expect(daysBetween("2026-09-16", "2026-10-07")).toBe(21);
    expect(daysBetween("bad", "2026-10-07")).toBe(0);
  });

  it("formats soles the Peruvian way", () => {
    expect(formatMoney(1550, "PEN", "es")).toMatch(/^S\/ 1[,.]?550\.00$/);
  });
});
