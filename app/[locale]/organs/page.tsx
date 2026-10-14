import type { Metadata } from "next";
import { OrgansContent } from "@/components/pages/Organs";
import { COPY } from "@/lib/copy";
import { isLocale } from "@/lib/i18n";
import { localeFrom, type LocaleParams } from "@/lib/params";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: COPY.organs.title[locale], description: COPY.organs.lead[locale] } : {};
}

export default async function OrgansPage({ params }: LocaleParams) {
  return <OrgansContent locale={await localeFrom(params)} />;
}
