import { EMPTY_STATE, exampleState } from "@/lib/outcomes";
import { SAMPLE_SCAN } from "@/lib/posture";
import { buildExport, parseImport, scanSchema, trackerSchema } from "@/lib/storage";

describe("what gets stored", () => {
  it("accepts the shapes the app itself writes", () => {
    expect(trackerSchema.safeParse(EMPTY_STATE).success).toBe(true);
    expect(trackerSchema.safeParse(exampleState("es")).success).toBe(true);
    expect(scanSchema.safeParse(SAMPLE_SCAN).success).toBe(true);
  });

  it("round-trips an export", () => {
    const file = JSON.stringify(buildExport(exampleState("en"), [SAMPLE_SCAN], new Date("2026-10-14T12:00:00Z")));
    const back = parseImport(file);
    expect(back?.tracker.checkIns).toHaveLength(3);
    expect(back?.scans[0]?.right.head.t).toBe(7.07);
  });

  it("refuses a file that isn't a RootAtlas export", () => {
    expect(parseImport("not json")).toBeNull();
    expect(parseImport(JSON.stringify({ app: "something-else" }))).toBeNull();
  });

  it("refuses an edited export with impossible values instead of half-loading it", () => {
    const data = buildExport(exampleState("en"), [], new Date());
    data.tracker.checkIns[0]!.limbPain = 11;
    expect(parseImport(JSON.stringify(data))).toBeNull();
  });
});
