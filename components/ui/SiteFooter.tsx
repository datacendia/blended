import Link from "next/link";
import { BRAND, COPY } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { href } from "@/lib/nav";

export function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="no-print border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-3 px-4 py-8 text-sm text-ink-2 sm:px-6">
        <p className="font-medium text-ink">
          {BRAND} — {COPY.common.tagline[locale]}
        </p>
        <p>{COPY.common.disclaimer[locale]}</p>
        <p>{COPY.common.privacy[locale]}</p>
        <p className="text-ink-3">{COPY.common.footerBuilt[locale]}</p>
        <p className="flex flex-wrap gap-4">
          <Link className="underline underline-offset-2" href={href(locale, "about")}>
            {COPY.nav.about[locale]}
          </Link>
          <Link className="underline underline-offset-2" href={href(locale, "warning-signs")}>
            {COPY.nav.flags[locale]}
          </Link>
        </p>
      </div>
    </footer>
  );
}
