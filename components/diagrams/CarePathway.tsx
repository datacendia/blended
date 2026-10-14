"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
import { SourceList } from "@/components/ui/SourceList";
import { CLINICIANS } from "@/lib/clinicians";
import { fill } from "@/lib/copy";
import { likelyStage, PATHWAY_COPY, PATHWAY_SOURCES, PATHWAY_STAGES, type Stage } from "@/lib/diagrams/pathway";
import type { Locale } from "@/lib/i18n";
import { href } from "@/lib/nav";

/**
 * The care map. Inputs on top, the three steps left to right (top to bottom
 * on a phone), warning signs as a lane above them all because they can cut
 * in at any point. The step the inputs point to is highlighted, and the
 * profession whose guide this is wears a ring.
 */
export function CarePathway({ locale, current }: { locale: Locale; current?: string }) {
  const c = PATHWAY_COPY;
  const [weeks, setWeeks] = useState(3);
  const [better, setBetter] = useState(false);
  const [warning, setWarning] = useState(false);
  const [severe, setSevere] = useState(false);
  const stage = likelyStage({ weeks, better, warning, severeAfterCare: severe });
  const steps = PATHWAY_STAGES.filter((s) => s.id !== "warning");
  const warningStage = PATHWAY_STAGES.find((s) => s.id === "warning")!;
  const now = PATHWAY_STAGES.find((s) => s.id === stage)!;

  const chip = (id: string) => {
    const clinician = CLINICIANS.find((x) => x.id === id);
    if (!clinician) return null;
    const here = id === current;
    return (
      <li key={id}>
        <Link
          href={href(locale, `who-to-see/${id}`)}
          aria-current={here ? "page" : undefined}
          className={`block rounded-lg border px-2.5 py-1.5 text-sm hover:border-accent ${here ? "border-ink bg-ink font-medium text-bg" : "border-line bg-surface"}`}
        >
          {clinician.name[locale]}
          {here && <span className="ml-1.5 text-xs opacity-80">· {c.youAreHere[locale]}</span>}
        </Link>
      </li>
    );
  };

  const box = (id: Stage) =>
    stage === id
      ? id === "warning"
        ? "border-bad bg-bad/10 ring-2 ring-bad"
        : "border-accent bg-accent/10 ring-2 ring-accent"
      : "border-line bg-raised";

  return (
    <div className="space-y-5">
      <fieldset className="grid gap-3 rounded-2xl border border-line bg-surface p-4 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="text-sm font-medium tnum">{fill(c.weeks[locale], { n: weeks })}</span>
          <input type="range" min={0} max={26} value={weeks} onChange={(e) => setWeeks(Number(e.target.value))} className="mt-1 block w-full accent-accent" />
        </label>
        {[
          { checked: better, set: setBetter, label: c.better },
          { checked: severe, set: setSevere, label: c.severe },
          { checked: warning, set: setWarning, label: c.warning }
        ].map((t) => (
          <label key={t.label.en} className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-accent" checked={t.checked} onChange={(e) => t.set(e.target.checked)} />
            <span>{t.label[locale]}</span>
          </label>
        ))}
      </fieldset>

      <figure className="m-0 space-y-3" aria-label={c.figure[locale]}>
        <section className={`rounded-2xl border p-4 ${box("warning")}`}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="font-semibold text-bad">{warningStage.title[locale]}</h4>
            <span className="text-xs text-ink-3">{warningStage.when[locale]}</span>
          </div>
          {stage === "warning" && <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-bad">{c.likelyNow[locale]}</p>}
        </section>
        <ol className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] md:items-stretch">
          {steps.map((s, i) => (
            <Fragment key={s.id}>
              {i > 0 && (
                <li aria-hidden="true" className="flex items-center justify-center text-xl text-ink-3">
                  <span className="md:hidden">↓</span>
                  <span className="hidden md:inline">→</span>
                </li>
              )}
              <li className={`rounded-2xl border p-4 ${box(s.id)}`}>
                <h4 className="font-semibold">{s.title[locale]}</h4>
                <p className="text-xs text-ink-3">{s.when[locale]}</p>
                {stage === s.id && <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-accent">{c.likelyNow[locale]}</p>}
                <ul className="mt-3 flex flex-wrap gap-1.5">{s.who.map(chip)}</ul>
              </li>
            </Fragment>
          ))}
        </ol>
      </figure>

      <div className={`rounded-xl border-l-4 p-4 text-sm leading-relaxed ${stage === "warning" ? "border-bad bg-bad/10" : "border-accent bg-raised"}`} aria-live="polite">
        <p className="font-semibold">{now.title[locale]}</p>
        <p className="mt-1 text-ink-2">{now.now[locale]}</p>
        {stage === "warning" && (
          <Link className="mt-2 inline-block font-medium text-bad underline underline-offset-2" href={href(locale, "warning-signs")}>
            {c.seeWarnings[locale]}
          </Link>
        )}
      </div>
      <SourceList ids={PATHWAY_SOURCES} locale={locale} />
    </div>
  );
}
