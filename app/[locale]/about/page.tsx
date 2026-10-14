import type { Metadata } from "next";
import { AboutContent } from "@/components/pages/About";
import { COPY } from "@/lib/copy";
import { isLocale } from "@/lib/i18n";
import { localeFrom, type LocaleParams } from "@/lib/params";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: COPY.about.title[locale] } : {};
}

export default async function AboutPage({ params }: LocaleParams) {
  return <AboutContent locale={await localeFrom(params)} />;
}
