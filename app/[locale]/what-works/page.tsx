import type { Metadata } from "next";
import { WhatWorksContent } from "@/components/pages/WhatWorks";
import { COPY } from "@/lib/copy";
import { isLocale } from "@/lib/i18n";
import { localeFrom, type LocaleParams } from "@/lib/params";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: COPY.evidence.title[locale], description: COPY.evidence.lead[locale] } : {};
}

export default async function WhatWorksPage({ params }: LocaleParams) {
  return <WhatWorksContent locale={await localeFrom(params)} />;
}
