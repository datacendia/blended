import type { Metadata } from "next";
import { VertebraContent } from "@/components/pages/Vertebra";
import { COPY } from "@/lib/copy";
import { isLocale } from "@/lib/i18n";
import { localeFrom, type LocaleParams } from "@/lib/params";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: COPY.vertebra.title[locale], description: COPY.vertebra.lead[locale] } : {};
}

export default async function VertebraPage({ params }: LocaleParams) {
  return <VertebraContent locale={await localeFrom(params)} />;
}
