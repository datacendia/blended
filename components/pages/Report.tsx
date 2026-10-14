import { ReportDecoder } from "@/components/report/ReportDecoder";
import { PageHeader } from "@/components/ui/PageHeader";
import { COPY } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";

export function ReportContent({ locale }: { locale: Locale }) {
  return (
    <>
      <PageHeader title={COPY.report.title[locale]} lead={COPY.report.lead[locale]} />
      <ReportDecoder locale={locale} />
    </>
  );
}
