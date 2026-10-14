import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideContent } from "@/components/pages/Guide";
import { guideById, guidePage, GUIDE_PAGES } from "@/lib/guides";
import { isLocale } from "@/lib/i18n";
import { practiceById } from "@/lib/practices";

type GuideParams = { params: Promise<{ locale: string; id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDE_PAGES.map((g) => ({ id: g.id }));
}

export async function generateMetadata({ params }: GuideParams): Promise<Metadata> {
  const { locale, id } = await params;
  const page = guidePage(id);
  if (!isLocale(locale) || !page) return {};
  const description = guideById(id)?.role ?? practiceById(id)?.practice;
  return { title: page.name[locale], description: description?.[locale] };
}

export default async function GuidePage({ params }: GuideParams) {
  const { locale, id } = await params;
  if (!isLocale(locale) || !guidePage(id)) notFound();
  return <GuideContent locale={locale} id={id} />;
}
