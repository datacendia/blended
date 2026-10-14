import type { L } from "../i18n";
import type { SourceId } from "../sources";

/**
 * Homeopathic strengths are counts of dilution steps: each "C" is 1 part in
 * 100. Start with one mole of a substance, Avogadro's number of molecules
 * (about 58 g of table salt), and after n steps you'd expect 6.02 × 10^23 ×
 * 10^(-2n) molecules of it left. Past 12C that is less than one. This is
 * arithmetic, not an opinion; the evidence verdict sits beside it with its
 * own source.
 */
export const AVOGADRO = 6.02214076e23;
export const LOG_AVOGADRO = Math.log10(AVOGADRO);

export const POTENCIES = [6, 12, 30, 200] as const;
export const MAX_C = 200;

/** log10 of the expected number of original molecules after n C-dilutions of one mole. */
export function expectedLog10(c: number): number {
  return LOG_AVOGADRO - 2 * c;
}

/** Chance that at least one molecule is left (Poisson): 1 - e^(-expected). */
export function chanceOfOne(c: number): number {
  const log = expectedLog10(c);
  if (log > 2) return 1;
  const expected = 10 ** log;
  return expected < 1e-12 ? expected : 1 - Math.exp(-expected);
}

/**
 * The same chance as a power of ten. Past about 160C the chance itself is
 * smaller than the smallest number a double can hold and reads as 0, so the
 * page works with its logarithm. For tiny chances it equals the expected
 * count, whose logarithm is exact.
 */
export function chanceLog10(c: number): number {
  const log = expectedLog10(c);
  return log < -12 ? log : Math.log10(chanceOfOne(c));
}

/** Mantissa and exponent for writing 6.0 × 10^n. */
export function scientific(log: number): { mantissa: number; exponent: number } {
  const exponent = Math.floor(log);
  return { mantissa: 10 ** (log - exponent), exponent };
}

export const DILUTION_COPY = {
  strength: { en: "Strength: {n}C", es: "Potencia: {n}C" },
  presets: { en: "Common strengths", es: "Potencias habituales" },
  start: {
    en: "Start with one mole of the substance: about 6 × 10²³ molecules, roughly 58 g of table salt.",
    es: "Empieza con un mol de la sustancia: unas 6 × 10²³ moléculas, unos 58 g de sal de mesa."
  },
  steps: { en: "{n} dilutions of 1 in 100", es: "{n} diluciones de 1 en 100" },
  left: { en: "Original molecules you'd expect to be left", es: "Moléculas originales que cabe esperar que queden" },
  some: { en: "You'd still expect about {n} molecules of the original.", es: "Aún cabe esperar unas {n} moléculas de la original." },
  maybe: { en: "There's about a {pct}% chance that even one molecule is left.", es: "Hay alrededor de un {pct}% de probabilidad de que quede siquiera una molécula." },
  none: {
    en: "You'd expect none. The chance that even one molecule is left is about 1 in 10^{k}.",
    es: "Cabe esperar ninguna. La probabilidad de que quede siquiera una molécula es de alrededor de 1 entre 10^{k}."
  },
  line: { en: "one molecule", es: "una molécula" },
  figure: { en: "Expected molecules left, on a scale of powers of ten", es: "Moléculas que cabe esperar que queden, en una escala de potencias de diez" },
  tradition: {
    en: "Homeopathy holds that the water keeps a 'memory' of the substance, and that more dilute is stronger.",
    es: "La homeopatía sostiene que el agua conserva una 'memoria' de la sustancia, y que cuanto más diluido, más potente."
  },
  evidence: {
    en: "Australia's national medical research council found no health condition for which homeopathy reliably works.",
    es: "El consejo nacional de investigación médica de Australia no encontró ninguna enfermedad para la que la homeopatía funcione de forma fiable."
  }
} as const satisfies Record<string, L>;

export const DILUTION_SOURCES: readonly SourceId[] = ["nhmrc2015"];
