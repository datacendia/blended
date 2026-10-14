import type { Metadata } from "next";
import { RedFlagCheck } from "@/components/flags/RedFlagCheck";
import { PageHeader } from "@/components/ui/PageHeader";
import { COPY } from "@/lib/copy";
import { isLocale } from "@/lib/i18n";
import { localeFrom, type LocaleParams } from "@/lib/params";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: COPY.flags.title[locale], description: COPY.flags.lead[locale] } : {};
}

export default async function WarningSignsPage({ params }: LocaleParams) {
  const locale = await localeFrom(params);
  return (
    <>
      <PageHeader title={COPY.flags.title[locale]} lead={COPY.flags.lead[locale]} />
      <RedFlagCheck locale={locale} />
    </>
  );
}
