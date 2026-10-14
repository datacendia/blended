"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { otherLocale, swapLocaleInPath, type Locale } from "@/lib/i18n";

/** Links to the same page in the other language. */
export function LocaleSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() ?? `/${locale}/`;
  const target = otherLocale(locale);
  return (
    <Link
      href={swapLocaleInPath(pathname, target)}
      hrefLang={target}
      lang={target}
      className="rounded-md border border-line px-3 py-1.5 text-sm text-ink-2 hover:text-ink"
    >
      {label}
    </Link>
  );
}
