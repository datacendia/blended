import type { Metadata } from "next";
import { TrackerContent } from "@/components/pages/Tracker";
import { COPY } from "@/lib/copy";
import { isLocale } from "@/lib/i18n";
import { localeFrom, type LocaleParams } from "@/lib/params";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: COPY.tracker.title[locale], description: COPY.tracker.lead[locale] } : {};
}

export default async function TrackerPage({ params }: LocaleParams) {
  return <TrackerContent locale={await localeFrom(params)} />;
}
