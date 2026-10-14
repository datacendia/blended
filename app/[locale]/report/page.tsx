import type { Metadata } from "next";
import { ReportContent } from "@/components/pages/Report";
import { COPY } from "@/lib/copy";
import { isLocale } from "@/lib/i18n";
import { localeFrom, type LocaleParams } from "@/lib/params";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: COPY.report.title[locale], description: COPY.report.lead[locale] } : {};
}

export default async function ReportPage({ params }: LocaleParams) {
  return <ReportContent locale={await localeFrom(params)} />;
}
