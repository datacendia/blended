import Link from "next/link";
import { guideHref } from "@/components/pages/Guide";
import { PageHeader } from "@/components/ui/PageHeader";
import { SourceList } from "@/components/ui/SourceList";
import { VerdictBadge } from "@/components/ui/VerdictBadge";
import { CLINICIANS, UNIVERSAL_QUESTIONS } from "@/lib/clinicians";
import { COPY } from "@/lib/copy";
import type { L, Locale } from "@/lib/i18n";
import { HANDS_ON, PRACTICES } from "@/lib/practices";

/**
 * Cards in the two comparisons share rows through CSS subgrid on wide
 * screens, so "Best suited for" sits at the same height in all three and the
 * page reads as a table. On a phone they stack as ordinary cards.
 */
export function WhoToSeeContent({ locale }: { locale: Locale }) {
  const c = COPY.clinicians;
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
        <ul className="mt-6 grid gap-4 lg:grid-cols-3 lg:grid-rows-[repeat(6,auto)]">
          {PRACTICES.map((p) => (
            <li key={p.id} id={p.id} className="grid scroll-mt-24 gap-4 rounded-2xl border border-line bg-surface p-5 lg:row-span-6 lg:grid-rows-subgrid">
              <div>
                <h3 className="text-lg font-semibold">{p.name[locale]}</h3>
                <p className="text-sm text-ink-3">{p.origin[locale]}</p>
              </div>
              <div className="space-y-1">
                {label(c.rowPractice)}
                <p>{p.practice[locale]}</p>
              </div>
              <div className="space-y-1 rounded-lg border border-dashed border-line px-3 py-2">
                {label(c.rowTradition)}
                <p className="italic text-ink-2">{p.tradition[locale]}</p>
              </div>
              <div className="space-y-2 rounded-xl bg-raised p-3">
                {label(c.rowResearch)}
                <ul className="flex flex-wrap gap-2">
                  {p.findings.map((f) => (
                    <li key={f.use.en} className="flex items-center gap-1.5 text-xs">
                      <VerdictBadge verdict={f.verdict} locale={locale} />
                      <span className="text-ink-2">{f.use[locale]}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm">{p.research[locale]}</p>
                <SourceList ids={p.sources} locale={locale} />
              </div>
              <div className="space-y-1">
                {label(c.rowGoodFor)}
                <p className="text-ink-2">{p.goodFor[locale]}</p>
              </div>
              <div className="space-y-1">
                {label(c.rowSafety)}
                <p className="text-ink-2">{p.safety[locale]}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
