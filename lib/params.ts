import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./i18n";

export type LocaleParams = { params: Promise<{ locale: string }> };

export async function localeFrom(params: LocaleParams["params"]): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}
