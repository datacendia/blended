import { CAUSES, opening, OPENING, PARTS, partName, partsFor, POSITIONS, VERTEBRA_KINDS } from "@/lib/vertebra";
import { TOP_VIEWS } from "@/lib/vertebraShapes";

describe("vertebra parts", () => {
  it("draws every part each region lists, and nothing it doesn't", () => {
    for (const kind of VERTEBRA_KINDS) {
      const drawn = new Set([...TOP_VIEWS[kind].shapes.map((s) => s.part), "cord", "root"]);
      const listed = new Set(partsFor(kind).map((p) => p.id));
      expect({ kind, drawn: [...drawn].sort() }).toEqual({ kind, drawn: [...listed].sort() });
    }
  });

  it("puts the vertebral artery only in the neck and rib joints only in the mid back", () => {
    expect(partsFor("cervical").map((p) => p.id)).toContain("transverseForamen");
    expect(partsFor("lumbar").map((p) => p.id)).not.toContain("transverseForamen");
    expect(partsFor("thoracic").map((p) => p.id)).toContain("ribFacet");
    expect(TOP_VIEWS.cervical.artery).toBeDefined();
  });

  it("shows the cauda equina, not the cord, in a lumbar vertebra", () => {
    const cord = PARTS.find((p) => p.id === "cord")!;
    expect(partName(cord, "lumbar").en).toBe("Cauda equina");
    expect(partName(cord, "cervical").en).toBe("Spinal cord");
    expect(TOP_VIEWS.lumbar.contents.kind).toBe("cauda");
  });

  it("names the neck root for the vertebra below it", () => {
    const root = PARTS.find((p) => p.id === "root")!;
    expect(root.byKind?.cervical?.en).toMatch(/C6 root leaves between C5 and C6/);
    expect(root.byKind?.lumbar?.en).toMatch(/L4 root leaves between L4 and L5/);
  });

  it("cites a source for every part, cause and position that makes a claim", () => {
    for (const p of PARTS) expect({ id: p.id, cited: p.sources.length > 0 }).toEqual({ id: p.id, cited: true });
    for (const c of CAUSES) expect(c.sources.length).toBeGreaterThan(0);
    for (const p of POSITIONS.filter((x) => x.id !== "neutral")) expect(p.sources.length).toBeGreaterThan(0);
  });
});

describe("how a root gets trapped", () => {
  it("leaves a healthy root room in every head position", () => {
    for (const p of POSITIONS) expect(opening("none", p.id).state).toBe("free");
  });

  it("tightens with a herniation and squeezes when looking up and turning toward it", () => {
    expect(opening("herniation", "neutral").state).toBe("touching");
    expect(opening("herniation", "up-turn").state).toBe("squeezed");
  });

  it("eases when looking down, as the opening widens in flexion", () => {
    expect(opening("herniation", "down").state).toBe("free");
    expect(opening("narrowing", "down").state).toBe("free");
  });

  it("orders the room: down > neutral > up-and-turned, for every cause", () => {
    for (const c of CAUSES) {
      const [down, neutral, up] = (["down", "neutral", "up-turn"] as const).map((p) => opening(c.id, p).room);
      expect(down).toBeGreaterThan(neutral!);
      expect(neutral).toBeGreaterThan(up!);
    }
  });

  it("loses disc height only with bony narrowing", () => {
    expect(opening("narrowing", "neutral").drop).toBeGreaterThan(0);
    expect(opening("herniation", "neutral").drop).toBe(0);
  });

  it("never draws the opening narrower than half the root", () => {
    for (const c of CAUSES) for (const p of POSITIONS) expect(opening(c.id, p.id).room).toBeGreaterThan(OPENING.root / 2);
  });
});
