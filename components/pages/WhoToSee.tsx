import { PageHeader } from "@/components/ui/PageHeader";
import { CLINICIANS, UNIVERSAL_QUESTIONS } from "@/lib/clinicians";
import { COPY } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";

export function WhoToSeeContent({ locale }: { locale: Locale }) {
  const c = COPY.clinicians;
  return (
    <>
      <PageHeader title={c.title[locale]} lead={c.lead[locale]} />
      <section className="mb-10 rounded-2xl border border-accent/40 bg-surface p-6">
        <h2 className="text-lg font-semibold">{c.questionsTitle[locale]}</h2>
        <ol className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {UNIVERSAL_QUESTIONS.map((q, i) => (
            <li key={i} className="flex gap-3">
              <span className="tnum w-5 shrink-0 font-semibold text-accent">{i + 1}</span>
              <span>{q[locale]}</span>
            </li>
          ))}
        </ol>
      </section>
      <ul className="grid gap-4 md:grid-cols-2">
        {CLINICIANS.map((cl) => (
          <li key={cl.id} id={cl.id} className="flex flex-col rounded-2xl border border-line bg-surface p-5">
            <h2 className="text-lg font-semibold">{cl.name[locale]}</h2>
            <p className="mt-1 text-ink-2">{cl.what[locale]}</p>
            <dl className="mt-3 flex flex-wrap gap-2 text-xs">
              <div className="rounded-full bg-raised px-2.5 py-1">
                <dt className="inline text-ink-3">{c.prescribe[locale]}: </dt>
                <dd className="inline font-semibold">{cl.canPrescribe ? c.yes[locale] : c.no[locale]}</dd>
              </div>
              <div className="rounded-full bg-raised px-2.5 py-1">
                <dt className="inline text-ink-3">{c.imaging[locale]}: </dt>
                <dd className="inline font-semibold">{cl.canOrderImaging[locale]}</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm">
              <span className="font-semibold">{c.goodFor[locale]}: </span>
              <span className="text-ink-2">{cl.goodFor[locale]}</span>
            </p>
            <p className="mt-2 text-sm">
              <span className="font-semibold">{c.watchFor[locale]}: </span>
              <span className="text-ink-2">{cl.watchFor[locale]}</span>
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
