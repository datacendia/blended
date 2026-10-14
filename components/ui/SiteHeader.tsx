import Link from "next/link";
import { BRAND, COPY } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { href, PAGES } from "@/lib/nav";
import { LocaleSwitch } from "./LocaleSwitch";
import { Logo } from "./Logo";

export function SiteHeader({ locale }: { locale: Locale }) {
  const links = PAGES.filter((p) => p.slug && p.slug !== "about");
  return (
    <header className="no-print sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link href={href(locale, "")} className="flex items-center gap-2 font-semibold tracking-tight">
          <Logo />
          <span>{BRAND}</span>
        </Link>
        <nav aria-label="Main" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1 text-sm">
            {links.map((p) => (
              <li key={p.slug}>
                <Link className="rounded-md px-2.5 py-1.5 text-ink-2 hover:bg-raised hover:text-ink" href={href(locale, p.slug)}>
                  {p.label[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <LocaleSwitch locale={locale} label={COPY.nav.language[locale]} />
          <details className="relative lg:hidden">
            <summary className="cursor-pointer list-none rounded-md border border-line px-3 py-1.5 text-sm [&::-webkit-details-marker]:hidden">
              {COPY.nav.menu[locale]}
            </summary>
            <nav aria-label="Main" className="absolute right-0 mt-2 w-60 rounded-xl border border-line bg-surface p-2 shadow-lg">
              <ul className="flex flex-col text-sm">
                {PAGES.map((p) => (
                  <li key={p.slug || "home"}>
                    <Link className="block rounded-md px-3 py-2 hover:bg-raised" href={href(locale, p.slug)}>
                      {p.label[locale]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
