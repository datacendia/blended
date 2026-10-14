import { NerveMap } from "@/components/map/NerveMap";
import { PageHeader } from "@/components/ui/PageHeader";
import { COPY } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";

export function MapContent({ locale }: { locale: Locale }) {
  return (
    <>
      <PageHeader title={COPY.map.title[locale]} lead={COPY.map.lead[locale]} />
      <NerveMap locale={locale} />
    </>
  );
}
