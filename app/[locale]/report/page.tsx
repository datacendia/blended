import type { Metadata } from "next";
import { ReportDecoder } from "@/components/report/ReportDecoder";
import { PageHeader } from "@/components/ui/PageHeader";
import { COPY } from "@/lib/copy";
import { isLocale } from "@/lib/i18n";
import { localeFrom, type LocaleParams } from "@/lib/params";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: COPY.report.title[locale], description: COPY.report.lead[locale] } : {};
}

export default async function ReportPage({ params }: LocaleParams) {
  const locale = await localeFrom(params);
  return (
    <>
      <PageHeader title={COPY.report.title[locale]} lead={COPY.report.lead[locale]} />
      <ReportDecoder locale={locale} />
    </>
  );
}
