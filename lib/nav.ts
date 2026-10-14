import type { L, Locale } from "./i18n";
import { COPY } from "./copy";

/** Every page, in nav order. Paths are the same in both languages. */
export const PAGES: readonly { slug: string; label: L }[] = [
  { slug: "", label: COPY.nav.home },
  { slug: "spine", label: COPY.nav.spine },
  { slug: "map", label: COPY.nav.map },
  { slug: "report", label: COPY.nav.report },
  { slug: "tracker", label: COPY.nav.tracker },
  { slug: "warning-signs", label: COPY.nav.flags },
  { slug: "who-to-see", label: COPY.nav.clinicians },
  { slug: "what-works", label: COPY.nav.evidence },
  { slug: "about", label: COPY.nav.about }
];

export function href(locale: Locale, slug: string): string {
  return slug ? `/${locale}/${slug}/` : `/${locale}/`;
}
