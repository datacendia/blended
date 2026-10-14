import { COPY } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

/** Everything inside <body>: shared by the Next layout and the single-file build. */
export function SiteShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-surface focus:px-3 focus:py-2">
        {COPY.nav.skip[locale]}
      </a>
      <SiteHeader locale={locale} />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-6 sm:px-6">
        {children}
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
