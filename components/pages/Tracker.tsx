import { Tracker } from "@/components/tracker/Tracker";
import { PageHeader } from "@/components/ui/PageHeader";
import { COPY } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";

export function TrackerContent({ locale }: { locale: Locale }) {
  return (
    <>
      <PageHeader title={COPY.tracker.title[locale]} lead={COPY.tracker.lead[locale]} />
      <Tracker locale={locale} />
    </>
  );
}
