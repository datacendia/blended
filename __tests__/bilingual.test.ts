import { CLINICIANS, UNIVERSAL_QUESTIONS } from "@/lib/clinicians";
import { COPY } from "@/lib/copy";
import { TREATMENTS, VERDICT_LABEL } from "@/lib/evidence";
import { EXAMS, SHOULDER_ABDUCTION_RELIEF } from "@/lib/exams";
import { GUIDES } from "@/lib/guides";
import { BALANCE_COPY, BALANCE_TEXT, STANCES } from "@/lib/diagrams/balance";
import { CUPPING_COPY, MARK_TEXT } from "@/lib/diagrams/cupping";
import { DILUTION_COPY } from "@/lib/diagrams/dilution";
import { FOOT_COPY, NERVES, ZONES } from "@/lib/diagrams/foot";
import { HEAD_LEVER_COPY } from "@/lib/diagrams/headLever";
import { MIMIC_COPY, MIMICS } from "@/lib/diagrams/mimics";
import { GRADES, MOBILISATION_COPY } from "@/lib/diagrams/mobilisation";
import { ADVICE_LABEL, DEMANDS, NECK_LOAD_COPY, POSES } from "@/lib/diagrams/neckLoad";
import { MUSCLES, NECK_MUSCLE_COPY } from "@/lib/diagrams/neckMuscles";
import { LAYER_NAME, NEEDLE_COPY, RISK_TEXT } from "@/lib/diagrams/needle";
import { GLIDE_COPY, GLIDE_TEXT } from "@/lib/diagrams/nerveGlide";
import { PATHWAY_COPY, PATHWAY_STAGES } from "@/lib/diagrams/pathway";
import { DIAGRAM_INFO } from "@/lib/diagrams/registry";
import { SURGERY_COPY, SURGERY_OPTIONS } from "@/lib/diagrams/surgery";
import { swapLocaleInPath, vertebraLabel } from "@/lib/i18n";
import { ORGANS, PARA_NERVE, POSTER_CHECKS, POSTER_VERDICT, RELAYS, SEGMENT_NOTES } from "@/lib/organs";
import { CONDITIONS, exampleState } from "@/lib/outcomes";
import { HANDS_ON, PRACTICES } from "@/lib/practices";
import { SEGMENT_LABEL, SEGMENT_MEANING } from "@/lib/posture";
import { RED_FLAGS, TRIAGE_ACTION } from "@/lib/redflags";
import { REGIONS, SYMPTOMS } from "@/lib/regions";
import { ROOTS } from "@/lib/roots";
import { AUTONOMIC, REGION_INFO, VERTEBRAE } from "@/lib/spine";
import { CAUSES, KIND_INFO, PARTS, POSITIONS, ROOM_LABEL } from "@/lib/vertebra";

/**
 * Both languages or neither. Walks every structure that reaches the screen
 * and checks each { en, es } pair: both filled, the same {placeholders}, and
 * longer phrases not left identical (an untranslated copy-paste).
 */
const EVERYTHING = {
  COPY, ROOTS, VERTEBRAE, REGION_INFO, AUTONOMIC, REGIONS, SYMPTOMS, RED_FLAGS, TRIAGE_ACTION, CLINICIANS,
  UNIVERSAL_QUESTIONS, TREATMENTS, VERDICT_LABEL, EXAMS, SHOULDER_ABDUCTION_RELIEF, CONDITIONS, SEGMENT_LABEL, SEGMENT_MEANING,
  HANDS_ON, PRACTICES, ORGANS, RELAYS, PARA_NERVE, SEGMENT_NOTES, POSTER_CHECKS, POSTER_VERDICT, KIND_INFO, PARTS, CAUSES,
  POSITIONS, ROOM_LABEL, GUIDES, DIAGRAM_INFO, PATHWAY_STAGES, PATHWAY_COPY, MIMICS, MIMIC_COPY, GLIDE_TEXT, GLIDE_COPY, GRADES,
  MOBILISATION_COPY, SURGERY_OPTIONS, SURGERY_COPY, MUSCLES, NECK_MUSCLE_COPY, STANCES, BALANCE_TEXT, BALANCE_COPY, DEMANDS, POSES,
  ADVICE_LABEL, NECK_LOAD_COPY, HEAD_LEVER_COPY, LAYER_NAME, RISK_TEXT, NEEDLE_COPY, MARK_TEXT, CUPPING_COPY, NERVES, ZONES, FOOT_COPY,
  DILUTION_COPY
};

interface Pair {
  path: string;
  en: string;
  es: string;
}

function collect(node: unknown, path: string, out: Pair[]): void {
  if (!node || typeof node !== "object") return;
  const obj = node as Record<string, unknown>;
  if (typeof obj.en === "string" || typeof obj.es === "string") {
    out.push({ path, en: String(obj.en ?? ""), es: String(obj.es ?? "") });
    return;
  }
  for (const [key, value] of Object.entries(obj)) collect(value, `${path}.${key}`, out);
}

const pairs: Pair[] = [];
collect(EVERYTHING, "", pairs);
const placeholders = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();

describe("every phrase exists in English and Spanish", () => {
  it("finds a substantial amount of text to check", () => {
    expect(pairs.length).toBeGreaterThan(400);
  });

  it.each(pairs.map((p) => [p.path, p] as const))("%s", (_path, p) => {
    expect(p.en.trim()).not.toBe("");
    expect(p.es.trim()).not.toBe("");
    expect(placeholders(p.es)).toEqual(placeholders(p.en));
    if (p.en.length > 24) expect(p.es).not.toBe(p.en);
  });
});

describe("locale helpers", () => {
  it("swaps the language segment and keeps the rest of the path", () => {
    expect(swapLocaleInPath("/en/spine/", "es")).toBe("/es/spine/");
    expect(swapLocaleInPath("/es/", "en")).toBe("/en/");
    expect(swapLocaleInPath("/", "es")).toBe("/es/");
  });

  it("shows thoracic vertebrae as D in Spanish, as Lima clinic posters do", () => {
    expect(vertebraLabel("T7", "es")).toBe("D7");
    expect(vertebraLabel("T7", "en")).toBe("T7");
    expect(vertebraLabel("C7", "es")).toBe("C7");
  });

  it("localises the example activities", () => {
    expect(exampleState("es").activityNames[0]).toMatch(/Dormir/);
  });
});
