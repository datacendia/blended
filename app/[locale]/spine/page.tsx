import type { Metadata } from "next";
import { SpineExplorer } from "@/components/spine/SpineExplorer";
import { PageHeader } from "@/components/ui/PageHeader";
import { COPY } from "@/lib/copy";
import { isLocale } from "@/lib/i18n";
import { localeFrom, type LocaleParams } from "@/lib/params";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: COPY.spine.title[locale], description: COPY.spine.lead[locale] } : {};
}

export default async function SpinePage({ params }: LocaleParams) {
  const locale = await localeFrom(params);
  return (
    <>
      <PageHeader title={COPY.spine.title[locale]} lead={COPY.spine.lead[locale]} />
      <SpineExplorer locale={locale} />
    </>
  );
}
