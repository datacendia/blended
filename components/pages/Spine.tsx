import { SpineExplorer } from "@/components/spine/SpineExplorer";
import { PageHeader } from "@/components/ui/PageHeader";
import { COPY } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";

export function SpineContent({ locale }: { locale: Locale }) {
  return (
    <>
      <PageHeader title={COPY.spine.title[locale]} lead={COPY.spine.lead[locale]} />
      <SpineExplorer locale={locale} />
    </>
  );
}
