import type { L, Locale } from "./i18n";
import { COPY } from "./copy";

/**
 * Every page, in nav order. Paths are the same in both languages.
 *
 * `primary` pages get a place in the desktop header; the rest are one tap
 * away (the spine sub-nav, the home cards) and all of them are in the phone
 * menu. Ten links don't fit a header; seven do.
 */
export const PAGES: readonly { slug: string; label: L; primary?: boolean }[] = [
  { slug: "", label: COPY.nav.home },
  { slug: "spine", label: COPY.nav.spine, primary: true },
  { slug: "vertebra", label: COPY.nav.vertebra },
  { slug: "organs", label: COPY.nav.organs },
  { slug: "map", label: COPY.nav.map, primary: true },
  { slug: "report", label: COPY.nav.report, primary: true },
  { slug: "tracker", label: COPY.nav.tracker, primary: true },
  { slug: "warning-signs", label: COPY.nav.flags, primary: true },
  { slug: "who-to-see", label: COPY.nav.clinicians, primary: true },
  { slug: "what-works", label: COPY.nav.evidence, primary: true },
  { slug: "about", label: COPY.nav.about }
];

export function href(locale: Locale, slug: string): string {
  return slug ? `/${locale}/${slug}/` : `/${locale}/`;
}
