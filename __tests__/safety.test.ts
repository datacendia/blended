import { RED_FLAGS, triage } from "@/lib/redflags";
import { TREATMENTS } from "@/lib/evidence";
import { EXAMS } from "@/lib/exams";
import { CLINICIANS } from "@/lib/clinicians";
import { HANDS_ON, PRACTICES } from "@/lib/practices";
import { SOURCES } from "@/lib/sources";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

describe("warning signs", () => {
  it("has unique ids", () => {
    expect(new Set(RED_FLAGS.map((f) => f.id)).size).toBe(RED_FLAGS.length);
  });

  it("escalates to the most serious ticked level", () => {
    expect(triage([])).toBeNull();
    expect(triage(["six-weeks"])).toBe("soon");
    expect(triage(["six-weeks", "fever"])).toBe("urgent");
    expect(triage(["fever", "saddle", "six-weeks"])).toBe("emergency");
  });

  it("treats the cauda equina and stroke signs as emergencies", () => {
    for (const id of ["saddle", "bladder-bowel", "stroke-signs", "both-legs"]) {
      expect(RED_FLAGS.find((f) => f.id === id)?.level).toBe("emergency");
    }
  });
});

function filesUnder(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? filesUnder(path) : /\.(ts|tsx)$/.test(name) ? [path] : [];
  });
}

const SOURCE_FILES = ["app", "components", "lib"].flatMap((d) => filesUnder(join(__dirname, "..", d)));

describe("evidence", () => {
  it("cites at least one source for every treatment verdict", () => {
    for (const t of TREATMENTS) expect(t.sources.length).toBeGreaterThan(0);
  });

  it("cites at least one source for every therapy and practice", () => {
    for (const t of [...HANDS_ON, ...PRACTICES]) expect({ id: t.id, sources: t.sources.length > 0 }).toEqual({ id: t.id, sources: true });
  });

  it("gives every practice a research verdict, kept apart from its tradition", () => {
    for (const p of PRACTICES) {
      expect(p.findings.length).toBeGreaterThan(0);
      expect(p.tradition.en).not.toBe(p.research.en);
    }
  });

  it("links each hands-on therapy to a clinician card that exists", () => {
    for (const t of HANDS_ON) expect(CLINICIANS.some((c) => c.id === t.clinicianId)).toBe(true);
  });

  it("cites only sources that exist", () => {
    const known = new Set(SOURCES.map((s) => s.id));
    const cited = [
      ...TREATMENTS.flatMap((t) => t.sources),
      ...Object.values(EXAMS).flatMap((e) => e.sources),
      ...HANDS_ON.flatMap((t) => t.sources),
      ...PRACTICES.flatMap((p) => p.sources)
    ];
    for (const id of cited) expect(known.has(id)).toBe(true);
  });

  it("has no source that nothing cites", () => {
    // A source in the table that no claim uses is either a claim that was
    // deleted without its citation, or a citation padding the list.
    const code = SOURCE_FILES.filter((f) => !f.endsWith("sources.ts")).map((f) => readFileSync(f, "utf8")).join("\n");
    for (const s of SOURCES) expect({ id: s.id, cited: code.includes(`"${s.id}"`) }).toEqual({ id: s.id, cited: true });
  });
});

describe("structural rules", () => {
  it("never injects raw HTML", () => {
    for (const f of SOURCE_FILES) expect({ f, hit: readFileSync(f, "utf8").includes("dangerouslySetInnerHTML") }).toEqual({ f, hit: false });
  });

  it("keeps every user-facing phrase in lib/, never inline in a component", () => {
    const components = SOURCE_FILES.filter((f) => f.includes("/components/") || f.includes("/app/"));
    // A path such as `en: "/en/"` (hreflang alternates) is a URL, not a phrase.
    for (const f of components) {
      expect({ f, inline: /\ben:\s*["'`](?!\/)/.test(readFileSync(f, "utf8")) }).toEqual({ f, inline: false });
    }
  });
});
