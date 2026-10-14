import type { Metadata } from "next";
import { WhoToSeeContent } from "@/components/pages/WhoToSee";
import { COPY } from "@/lib/copy";
import { isLocale } from "@/lib/i18n";
import { localeFrom, type LocaleParams } from "@/lib/params";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: COPY.clinicians.title[locale], description: COPY.clinicians.lead[locale] } : {};
}

export default async function WhoToSeePage({ params }: LocaleParams) {
  return <WhoToSeeContent locale={await localeFrom(params)} />;
}
