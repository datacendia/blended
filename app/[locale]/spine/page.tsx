import type { Metadata } from "next";
import { SpineContent } from "@/components/pages/Spine";
import { COPY } from "@/lib/copy";
import { isLocale } from "@/lib/i18n";
import { localeFrom, type LocaleParams } from "@/lib/params";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: COPY.spine.title[locale], description: COPY.spine.lead[locale] } : {};
}

export default async function SpinePage({ params }: LocaleParams) {
  return <SpineContent locale={await localeFrom(params)} />;
}
