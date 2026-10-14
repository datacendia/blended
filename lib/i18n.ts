/**
 * Two languages, always both. Every human-readable string in lib/ is an `L`,
 * and __tests__/bilingual.test.ts walks every exported data structure and
 * fails on an empty side. A Spanish-speaking patient in Lima and an English
 * speaker abroad read the same facts, or neither does.
 */
export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];

export interface L {
  en: string;
  es: string;
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function tr(text: L, locale: Locale): string {
  return text[locale];
}

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "es" : "en";
}

/** Swap the leading /en/ or /es/ segment of a path, keeping the rest. */
export function swapLocaleInPath(path: string, to: Locale): string {
  const match = path.match(/^\/(en|es)(\/.*)?$/);
  if (!match) return `/${to}/`;
  return `/${to}${match[2] ?? "/"}`;
}

/**
 * Thoracic vertebrae are "T" in English and "D" (dorsal) in Spain and Latin
 * America — the posters on a Lima clinic wall say D1–D12. Showing a patient the
 * label they have already seen matters more than consistency with English.
 */
export function vertebraLabel(id: string, locale: Locale): string {
  if (locale === "es" && /^T\d+$/.test(id)) return `D${id.slice(1)}`;
  return id;
}

export function formatNumber(value: number, locale: Locale, digits = 1): string {
  return new Intl.NumberFormat(locale === "es" ? "es-PE" : "en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(value);
}
