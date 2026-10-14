import type { Metadata } from "next";
import { NerveMap } from "@/components/map/NerveMap";
import { PageHeader } from "@/components/ui/PageHeader";
import { COPY } from "@/lib/copy";
import { isLocale } from "@/lib/i18n";
import { localeFrom, type LocaleParams } from "@/lib/params";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: COPY.map.title[locale], description: COPY.map.lead[locale] } : {};
}

export default async function MapPage({ params }: LocaleParams) {
  const locale = await localeFrom(params);
  return (
    <>
      <PageHeader title={COPY.map.title[locale]} lead={COPY.map.lead[locale]} />
      <NerveMap locale={locale} />
    </>
  );
}
