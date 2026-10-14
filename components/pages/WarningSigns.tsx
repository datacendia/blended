import { RedFlagCheck } from "@/components/flags/RedFlagCheck";
import { PageHeader } from "@/components/ui/PageHeader";
import { COPY } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";

export function WarningSignsContent({ locale }: { locale: Locale }) {
  return (
    <>
      <PageHeader title={COPY.flags.title[locale]} lead={COPY.flags.lead[locale]} />
      <RedFlagCheck locale={locale} />
    </>
  );
}
