import Link from "next/link";
import { FirstVisitCheck } from "@/components/guide/FirstVisitCheck";
import { GuideDiagrams } from "@/components/guide/GuideDiagrams";
import { PageHeader } from "@/components/ui/PageHeader";
import { SourceList } from "@/components/ui/SourceList";
import { VerdictBadge } from "@/components/ui/VerdictBadge";
import { CLINICIANS } from "@/lib/clinicians";
import { COPY } from "@/lib/copy";
import { TREATMENTS } from "@/lib/evidence";
import { guideById, GUIDE_PAGES } from "@/lib/guides";
import type { L, Locale } from "@/lib/i18n";
import { href } from "@/lib/nav";
import { practiceById, type Practice } from "@/lib/practices";

export function guideHref(locale: Locale, id: string): string {
  return href(locale, `who-to-see/${id}`);
}

/** One route, two kinds of guide: a profession, or a practice like acupuncture. */
export function GuideContent({ locale, id }: { locale: Locale; id: string }) {
  const practice = practiceById(id);
  return (
    <>
      <p className="mb-4 text-sm">
        <Link className="text-accent underline underline-offset-2" href={href(locale, "who-to-see")}>
          ← {COPY.guide.back[locale]}
        </Link>
      </p>
      {practice ? <PracticeGuide practice={practice} locale={locale} /> : <ClinicianGuide id={id} locale={locale} />}
      <OtherGuides current={id} locale={locale} />
    </>
  );
}

function ClinicianGuide({ locale, id }: { locale: Locale; id: string }) {
  const c = COPY.guide;
  const cl = COPY.clinicians;
  const clinician = CLINICIANS.find((x) => x.id === id);
  const guide = guideById(id);
  if (!clinician || !guide) return null;
  const uses = guide.uses.flatMap((u) => TREATMENTS.filter((t) => t.id === u));

  return (
    <>
      <PageHeader eyebrow={c.eyebrow[locale]} title={clinician.name[locale]} lead={guide.role[locale]} />
      <dl className="-mt-4 mb-10 flex flex-wrap gap-2 text-sm">
        <Fact label={cl.prescribe[locale]} value={clinician.canPrescribe ? cl.yes[locale] : cl.no[locale]} />
        <Fact label={cl.imaging[locale]} value={clinician.canOrderImaging[locale]} />
      </dl>
      <GuideDiagrams id={id} locale={locale} />

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

          <Questions items={guide.questions} locale={locale} />
        </div>

        <aside className="min-w-0 space-y-6">
          <Signs good={guide.goodSigns} watch={guide.warningSigns} locale={locale} />
          <Credentials training={guide.training} check={guide.check} sources={guide.sources} locale={locale} />
        </aside>
      </div>
    </>
  );
}

function PracticeGuide({ practice: p, locale }: { practice: Practice; locale: Locale }) {
  const c = COPY.guide;
  const cl = COPY.clinicians;
  return (
    <>
      <PageHeader eyebrow={c.practiceEyebrow[locale]} title={p.name[locale]} lead={p.practice[locale]} />
      <dl className="-mt-4 mb-10 flex flex-wrap gap-2 text-sm">
        <Fact label={c.whoDelivers[locale]} value={p.whoDelivers[locale]} />
        <div className="rounded-full bg-raised px-3 py-1 text-ink-2">{p.origin[locale]}</div>
      </dl>
      <GuideDiagrams id={p.id} locale={locale} />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="min-w-0 space-y-10">
          <section className="rounded-2xl border-l-4 border-accent bg-raised p-5" aria-labelledby="neck">
            <h2 id="neck" className="font-semibold">{c.neckTitle[locale]}</h2>
            <p className="mt-1 leading-relaxed text-ink-2">{p.neck[locale]}</p>
          </section>

          <section aria-labelledby="claims" className="grid gap-4 md:grid-cols-2">
            <h2 id="claims" className="sr-only">
              {cl.rowTradition[locale]} · {cl.rowResearch[locale]}
            </h2>
            <div className="rounded-2xl border border-dashed border-line p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">{cl.rowTradition[locale]}</p>
              <p className="mt-2 italic text-ink-2">{p.tradition[locale]}</p>
            </div>
            <div className="rounded-2xl bg-surface p-5 ring-1 ring-line">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">{cl.rowResearch[locale]}</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {p.findings.map((f) => (
                  <li key={f.use.en} className="flex items-center gap-1.5 text-xs">
                    <VerdictBadge verdict={f.verdict} locale={locale} />
                    <span className="text-ink-2">{f.use[locale]}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm leading-relaxed">{p.research[locale]}</p>
            </div>
          </section>

          <section aria-labelledby="first-session">
            <h2 id="first-session" className="mb-2 text-xl font-semibold">{c.firstSession[locale]}</h2>
            <FirstVisitCheck items={p.firstSession} locale={locale} />
          </section>

          <Questions items={p.questions} locale={locale} />
        </div>

        <aside className="min-w-0 space-y-6">
          <section className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="font-semibold">{cl.rowGoodFor[locale]}</h2>
            <p className="mt-1 text-sm text-ink-2">{p.goodFor[locale]}</p>
            <h2 className="mt-4 font-semibold">{cl.rowSafety[locale]}</h2>
            <p className="mt-1 text-sm text-ink-2">{p.safety[locale]}</p>
          </section>
          <Signs good={p.goodSigns} watch={p.warningSigns} locale={locale} />
          <Credentials training={p.training} check={p.check} sources={p.sources} locale={locale} />
        </aside>
      </div>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full bg-raised px-3 py-1">
      <dt className="inline text-ink-3">{label}: </dt>
      <dd className="inline font-semibold">{value}</dd>
    </div>
  );
}

function Questions({ items, locale }: { items: L[]; locale: Locale }) {
  const c = COPY.guide;
  return (
    <section aria-labelledby="questions">
      <h2 id="questions" className="text-xl font-semibold">{c.questions[locale]}</h2>
      <ol className="mt-3 space-y-2">
        {items.map((q, i) => (
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
  );
}

function Signs({ good, watch, locale }: { good: L[]; watch: L[]; locale: Locale }) {
  const c = COPY.guide;
  return (
    <>
      <section className="rounded-2xl border border-good/40 bg-good/5 p-5">
        <h2 className="font-semibold">{c.goodSigns[locale]}</h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink-2">
          {good.map((s, i) => (
            <li key={i}>{s[locale]}</li>
          ))}
        </ul>
      </section>
      <section className="rounded-2xl border border-warn/50 bg-warn/5 p-5">
        <h2 className="font-semibold">{c.warningSigns[locale]}</h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink-2">
          {watch.map((s, i) => (
            <li key={i}>{s[locale]}</li>
          ))}
        </ul>
      </section>
    </>
  );
}

function Credentials({ training, check, sources, locale }: { training: L; check: L; sources: Practice["sources"]; locale: Locale }) {
  const c = COPY.guide;
  return (
    <section className="rounded-2xl border border-line bg-surface p-5">
      <h2 className="font-semibold">{c.training[locale]}</h2>
      <p className="mt-1 text-sm text-ink-2">{training[locale]}</p>
      <h2 className="mt-4 font-semibold">{c.check[locale]}</h2>
      <p className="mt-1 text-sm text-ink-2">{check[locale]}</p>
      <SourceList ids={sources} locale={locale} />
    </section>
  );
}

function OtherGuides({ current, locale }: { current: string; locale: Locale }) {
  const c = COPY.guide;
  const groups = [
    { kind: "clinician" as const, label: c.professions },
    { kind: "practice" as const, label: c.practices }
  ];
  return (
    <nav aria-labelledby="other-guides" className="mt-14 border-t border-line pt-6">
      <h2 id="other-guides" className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-3">{c.others[locale]}</h2>
      {groups.map((g) => (
        <div key={g.kind} className="mb-3">
          <p className="mb-1.5 text-xs text-ink-3">{g.label[locale]}</p>
          <ul className="flex flex-wrap gap-2 text-sm">
            {GUIDE_PAGES.filter((x) => x.kind === g.kind && x.id !== current).map((x) => (
              <li key={x.id}>
                <Link className="block rounded-full border border-line bg-surface px-3 py-1.5 hover:border-accent" href={guideHref(locale, x.id)}>
                  {x.name[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
