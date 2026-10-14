import Link from "next/link";
import { COPY } from "@/lib/copy";
import type { L, Locale } from "@/lib/i18n";
import { href } from "@/lib/nav";

/**
 * The three spine pages (levels, one vertebra, organ wiring) are one subject
 * seen at three scales, so each links to the other two right under its title.
 */
const TABS: { slug: string; label: L }[] = [
  { slug: "spine", label: COPY.nav.spineLevels },
  { slug: "vertebra", label: COPY.nav.vertebra },
  { slug: "organs", label: COPY.nav.organs }
];

export function SpineTabs({ locale, current }: { locale: Locale; current: string }) {
  return (
    <nav aria-label={COPY.nav.spineSection[locale]} className="-mt-3 mb-8">
      <ul className="flex flex-wrap gap-2 text-sm">
        {TABS.map((t) => {
          const here = t.slug === current;
          return (
            <li key={t.slug}>
              <Link
                href={href(locale, t.slug)}
                aria-current={here ? "page" : undefined}
                className={`block rounded-full border px-3.5 py-1.5 ${here ? "border-accent bg-accent font-medium text-accent-ink" : "border-line bg-surface text-ink-2 hover:border-accent hover:text-ink"}`}
              >
                {t.label[locale]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
