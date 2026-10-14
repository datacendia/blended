import Link from "next/link";
import { FirstVisitCheck } from "@/components/guide/FirstVisitCheck";
import { PageHeader } from "@/components/ui/PageHeader";
import { SourceList } from "@/components/ui/SourceList";
import { VerdictBadge } from "@/components/ui/VerdictBadge";
import { CLINICIANS } from "@/lib/clinicians";
import { COPY } from "@/lib/copy";
import { TREATMENTS } from "@/lib/evidence";
import { guideById } from "@/lib/guides";
import type { Locale } from "@/lib/i18n";
import { href } from "@/lib/nav";

export function guideHref(locale: Locale, id: string): string {
  return href(locale, `who-to-see/${id}`);
}

export function GuideContent({ locale, id }: { locale: Locale; id: string }) {
  const c = COPY.guide;
  const cl = COPY.clinicians;
  const clinician = CLINICIANS.find((x) => x.id === id);
  const guide = guideById(id);
  if (!clinician || !guide) return null;
  const uses = guide.uses.flatMap((u) => TREATMENTS.filter((t) => t.id === u));

  return (
    <>
      <p className="mb-4 text-sm">
        <Link className="text-accent underline underline-offset-2" href={href(locale, "who-to-see")}>
          ← {c.back[locale]}
        </Link>
      </p>
      <PageHeader eyebrow={c.eyebrow[locale]} title={clinician.name[locale]} lead={guide.role[locale]} />
      <dl className="-mt-4 mb-10 flex flex-wrap gap-2 text-sm">
        <div className="rounded-full bg-raised px-3 py-1">
          <dt className="inline text-ink-3">{cl.prescribe[locale]}: </dt>
          <dd className="inline font-semibold">{clinician.canPrescribe ? cl.yes[locale] : cl.no[locale]}</dd>
        </div>
        <div className="rounded-full bg-raised px-3 py-1">
          <dt className="inline text-ink-3">{cl.imaging[locale]}: </dt>
          <dd className="inline font-semibold">{clinician.canOrderImaging[locale]}</dd>
        </div>
      </dl>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="min-w-0 space-y-10">
          <section aria-labelledby="first-visit">
            <h2 id="first-visit" className="mb-2 text-xl font-semibold">{c.firstVisit[locale]}</h2>
            <FirstVisitCheck items={guide.firstVisit} locale={locale} />
          </section>

          <section aria-labelledby="uses">
            <h2 id="uses" className="text-xl font-semibold">{c.uses[locale]}</h2>
            <p className="mt-1 text-sm text-ink-3">{c.usesNote[locale]}</p>
            <ul className="mt-3 divide-y divide-line rounded-2xl border border-line bg-surface">
              {uses.map((t) => (
                <li key={t.id}>
                  <Link href={`${href(locale, "what-works")}#${t.id}`} className="flex items-center justify-between gap-3 p-4 hover:bg-raised">
                    <span>{t.name[locale]}</span>
                    <VerdictBadge verdict={t.verdict} locale={locale} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="questions">
            <h2 id="questions" className="text-xl font-semibold">{c.questions[locale]}</h2>
            <ol className="mt-3 space-y-2">
              {guide.questions.map((q, i) => (
                <li key={i} className="flex gap-3">
                  <span className="tnum w-5 shrink-0 font-semibold text-accent">{i + 1}</span>
                  <span>{q[locale]}</span>
                </li>
              ))}
            </ol>
            <Link className="mt-3 inline-block text-sm text-accent underline underline-offset-2" href={href(locale, "who-to-see")}>
              {c.universal[locale]}
            </Link>
          </section>
        </div>

        <aside className="min-w-0 space-y-6">
          <section className="rounded-2xl border border-good/40 bg-good/5 p-5">
            <h2 className="font-semibold">{c.goodSigns[locale]}</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink-2">
              {guide.goodSigns.map((s, i) => (
                <li key={i}>{s[locale]}</li>
              ))}
            </ul>
          </section>
          <section className="rounded-2xl border border-warn/50 bg-warn/5 p-5">
            <h2 className="font-semibold">{c.warningSigns[locale]}</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink-2">
              {guide.warningSigns.map((s, i) => (
                <li key={i}>{s[locale]}</li>
              ))}
            </ul>
          </section>
          <section className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="font-semibold">{c.training[locale]}</h2>
            <p className="mt-1 text-sm text-ink-2">{guide.training[locale]}</p>
            <h2 className="mt-4 font-semibold">{c.check[locale]}</h2>
            <p className="mt-1 text-sm text-ink-2">{guide.check[locale]}</p>
            <SourceList ids={guide.sources} locale={locale} />
          </section>
        </aside>
      </div>

      <nav aria-labelledby="other-guides" className="mt-14 border-t border-line pt-6">
        <h2 id="other-guides" className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-3">{c.others[locale]}</h2>
        <ul className="flex flex-wrap gap-2 text-sm">
          {CLINICIANS.filter((x) => x.id !== id).map((x) => (
            <li key={x.id}>
              <Link className="block rounded-full border border-line bg-surface px-3 py-1.5 hover:border-accent" href={guideHref(locale, x.id)}>
                {x.name[locale]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
