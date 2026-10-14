import type { Metadata } from "next";
import { WarningSignsContent } from "@/components/pages/WarningSigns";
import { COPY } from "@/lib/copy";
import { isLocale } from "@/lib/i18n";
import { localeFrom, type LocaleParams } from "@/lib/params";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: COPY.flags.title[locale], description: COPY.flags.lead[locale] } : {};
}

export default async function WarningSignsPage({ params }: LocaleParams) {
  return <WarningSignsContent locale={await localeFrom(params)} />;
}
