import Link from "next/link";
import { guideHref } from "@/components/pages/Guide";
import { PageHeader } from "@/components/ui/PageHeader";
import { SourceList } from "@/components/ui/SourceList";
import { VerdictBadge } from "@/components/ui/VerdictBadge";
import { CLINICIANS, UNIVERSAL_QUESTIONS } from "@/lib/clinicians";
import { COPY } from "@/lib/copy";
import type { L, Locale } from "@/lib/i18n";
import { HANDS_ON, PRACTICES, type PracticeGroup } from "@/lib/practices";

/** Practices split by who does the work, which is also roughly how the evidence splits. */
const GROUPS: { id: PracticeGroup; label: L }[] = [
  { id: "active", label: COPY.guide.groupActive },
  { id: "passive", label: COPY.guide.groupPassive }
];

/**
 * Cards in the profession comparison share rows through CSS subgrid on wide
 * screens, so "Best suited for" sits at the same height in all three and the
 * page reads as a table. On a phone they stack as ordinary cards.
 */
export function WhoToSeeContent({ locale }: { locale: Locale }) {
  const c = COPY.clinicians;
  const g = COPY.guide;
  const label = (text: L) => <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">{text[locale]}</p>;

  return (
    <>
      <PageHeader title={c.title[locale]} lead={c.lead[locale]} />
      <section className="mb-12 rounded-2xl border border-accent/40 bg-surface p-6">
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

      <section aria-labelledby="compare" className="mb-12">
        <h2 id="compare" className="text-2xl font-semibold tracking-tight">{c.compareTitle[locale]}</h2>
        <p className="mt-2 max-w-3xl text-ink-2">{c.compareLead[locale]}</p>
        <ul className="mt-6 grid gap-4 lg:grid-cols-3 lg:grid-rows-[repeat(5,auto)]">
          {HANDS_ON.map((t) => (
            <li key={t.id} className="grid gap-4 rounded-2xl border border-line bg-surface p-5 lg:row-span-5 lg:grid-rows-subgrid">
              <div>
                <h3 className="text-lg font-semibold">{t.name[locale]}</h3>
                <Link className="text-sm text-accent underline underline-offset-2" href={guideHref(locale, t.clinicianId)}>
                  {c.seeCard[locale]}
                </Link>
              </div>
              <div className="space-y-1">
                {label(c.rowApproach)}
                <p>{t.philosophy[locale]}</p>
              </div>
              <div className="space-y-1">
                {label(c.rowMethods)}
                <p className="text-ink-2">{t.methods[locale]}</p>
              </div>
              <div className="space-y-1">
                {label(c.rowBestFor)}
                <p className="text-ink-2">{t.bestFor[locale]}</p>
              </div>
              <div className="space-y-1 rounded-xl bg-raised p-3">
                {label(c.rowResearch)}
                <p className="text-sm">{t.evidence[locale]}</p>
                <SourceList ids={t.sources} locale={locale} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <ul className="mb-12 grid gap-4 md:grid-cols-2">
        {CLINICIANS.map((cl) => (
          <li key={cl.id} id={cl.id} className="flex scroll-mt-24 flex-col rounded-2xl border border-line bg-surface p-5">
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
            <Link
              href={guideHref(locale, cl.id)}
              className="mt-auto self-start pt-4 text-sm font-medium text-accent underline underline-offset-2"
            >
              {c.openGuide[locale]} →
            </Link>
          </li>
        ))}
      </ul>

      <section aria-labelledby="practices">
        <h2 id="practices" className="text-2xl font-semibold tracking-tight">{c.practicesTitle[locale]}</h2>
        <p className="mt-2 max-w-3xl text-ink-2">{c.practicesLead[locale]}</p>
        <p className="mt-2 max-w-3xl text-sm text-ink-3">{g.groupNote[locale]}</p>
        {GROUPS.map((group) => (
          <div key={group.id} className="mt-8">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-3">{group.label[locale]}</h3>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PRACTICES.filter((p) => p.group === group.id).map((p) => (
                <li key={p.id} id={p.id} className="flex scroll-mt-24 flex-col rounded-2xl border border-line bg-surface p-5">
                  <h4 className="text-lg font-semibold">{p.name[locale]}</h4>
                  <p className="text-sm text-ink-3">{p.origin[locale]}</p>
                  <ul className="mt-3 space-y-1.5">
                    {p.findings.map((f) => (
                      <li key={f.use.en} className="flex items-center gap-2 text-xs">
                        <VerdictBadge verdict={f.verdict} locale={locale} />
                        <span className="text-ink-2">{f.use[locale]}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-sm text-ink-2">{p.goodFor[locale]}</p>
                  <Link href={guideHref(locale, p.id)} className="mt-auto self-start pt-4 text-sm font-medium text-accent underline underline-offset-2">
                    {c.openGuide[locale]} →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  );
}
