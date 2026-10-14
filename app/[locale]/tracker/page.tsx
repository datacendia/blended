import type { Metadata } from "next";
import { Tracker } from "@/components/tracker/Tracker";
import { PageHeader } from "@/components/ui/PageHeader";
import { COPY } from "@/lib/copy";
import { isLocale } from "@/lib/i18n";
import { localeFrom, type LocaleParams } from "@/lib/params";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: COPY.tracker.title[locale], description: COPY.tracker.lead[locale] } : {};
}

export default async function TrackerPage({ params }: LocaleParams) {
  const locale = await localeFrom(params);
  return (
    <>
      <PageHeader title={COPY.tracker.title[locale]} lead={COPY.tracker.lead[locale]} />
      <Tracker locale={locale} />
    </>
  );
}
