import type { Metadata } from "next";
import { MapContent } from "@/components/pages/Map";
import { COPY } from "@/lib/copy";
import { isLocale } from "@/lib/i18n";
import { localeFrom, type LocaleParams } from "@/lib/params";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: COPY.map.title[locale], description: COPY.map.lead[locale] } : {};
}

export default async function MapPage({ params }: LocaleParams) {
  return <MapContent locale={await localeFrom(params)} />;
}
