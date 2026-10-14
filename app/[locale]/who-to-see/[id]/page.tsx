import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideContent } from "@/components/pages/Guide";
import { CLINICIANS } from "@/lib/clinicians";
import { guideById, GUIDES } from "@/lib/guides";
import { isLocale } from "@/lib/i18n";

type GuideParams = { params: Promise<{ locale: string; id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ id: g.id }));
}

export async function generateMetadata({ params }: GuideParams): Promise<Metadata> {
  const { locale, id } = await params;
  const clinician = CLINICIANS.find((c) => c.id === id);
  const guide = guideById(id);
  return isLocale(locale) && clinician && guide ? { title: clinician.name[locale], description: guide.role[locale] } : {};
}

export default async function GuidePage({ params }: GuideParams) {
  const { locale, id } = await params;
  if (!isLocale(locale) || !guideById(id)) notFound();
  return <GuideContent locale={locale} id={id} />;
}
