"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
import { SourceList } from "@/components/ui/SourceList";
import { CLINICIANS } from "@/lib/clinicians";
import { fill } from "@/lib/copy";
import { likelyStage, MILESTONES, PATHWAY_COPY, PATHWAY_SOURCES, PATHWAY_STAGES, REVIEW_WEEKS, TIMELINE_WEEKS, type Stage } from "@/lib/diagrams/pathway";
import type { Locale } from "@/lib/i18n";
import { href } from "@/lib/nav";
import { HALO } from "./shapes";

const TX = (w: number) => 22 + (w / TIMELINE_WEEKS) * 262;
const AXIS = 52;

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

      <figure className="m-0 rounded-2xl border border-line bg-surface p-3">
        <p className="mb-1 px-1 text-xs font-semibold uppercase tracking-wide text-ink-3">{c.timeline[locale]}</p>
        <svg viewBox="0 0 300 96" className="mx-auto block h-auto w-full max-w-[520px]" role="img" aria-label={`${c.timelineFigure[locale]}: ${fill(c.weeks[locale], { n: weeks })}`}>
          <defs>
            <linearGradient id="months-band" x1="0" x2="1">
              <stop offset="0" stopColor="rgb(var(--ink-3))" stopOpacity="0" />
              <stop offset="1" stopColor="rgb(var(--ink-3))" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          {/* Warning signs can cut in at any point */}
          <rect x={TX(0)} y={8} width={TX(TIMELINE_WEEKS) - TX(0)} height={14} rx={7} fill="rgb(var(--bad) / 0.14)" />
          <text x={TX(0) + 8} y={18} fontSize={8} fill="rgb(var(--bad))" fontWeight={600}>
            {c.anyTime[locale]}
          </text>
          {/* First-line care, then review; past that, months */}
          <rect x={TX(0)} y={AXIS - 9} width={TX(REVIEW_WEEKS) - TX(0)} height={18} fill="rgb(var(--accent) / 0.14)" />
          <rect x={TX(REVIEW_WEEKS + 2)} y={AXIS - 9} width={TX(TIMELINE_WEEKS) - TX(REVIEW_WEEKS + 2)} height={18} fill="url(#months-band)" />
          <line x1={TX(0)} y1={AXIS} x2={TX(TIMELINE_WEEKS)} y2={AXIS} stroke="rgb(var(--ink-2))" strokeWidth={1.2} />
          {Array.from({ length: TIMELINE_WEEKS + 1 }, (_, w) => (
            <line key={w} x1={TX(w)} y1={AXIS - 2} x2={TX(w)} y2={AXIS + 2} stroke="rgb(var(--ink-3))" strokeWidth={0.6} />
          ))}
          {[0, 6, 12, 26].map((w) => (
            <text key={w} x={TX(w)} y={AXIS + 22} fontSize={8} textAnchor="middle" fill="rgb(var(--ink-3))" className="tnum">
              {w} {c.weekShort[locale]}
            </text>
          ))}
          {MILESTONES.map((m, i) => (
            <g key={m.id}>
              {m.id !== "months" && <line x1={TX(m.week)} y1={AXIS - 14} x2={TX(m.week)} y2={AXIS + 10} stroke="rgb(var(--ink-2))" strokeWidth={1} strokeDasharray={m.id === "start" ? undefined : "3 2"} />}
              <circle cx={TX(m.week)} cy={AXIS + 34} r={6} fill={weeks >= m.week ? "rgb(var(--ink))" : "rgb(var(--surface))"} stroke="rgb(var(--ink-3))" strokeWidth={0.8} />
              <text x={TX(m.week)} y={AXIS + 36.5} fontSize={7} textAnchor="middle" fontWeight={700} fill={weeks >= m.week ? "rgb(var(--surface))" : "rgb(var(--ink))"}>
                {i + 1}
              </text>
            </g>
          ))}
          {/* Where the reader is */}
          <g transform={`translate(${TX(Math.min(weeks, TIMELINE_WEEKS))} 0)`}>
            <path d={`M0 ${AXIS - 4}l-6 -10h12z`} fill={warning ? "rgb(var(--bad))" : "rgb(var(--accent))"} />
            <text x={0} y={AXIS - 18} fontSize={8.5} textAnchor="middle" fontWeight={700} {...HALO}>
              {c.you[locale]}
            </text>
          </g>
        </svg>
        <ol className="mt-1 grid gap-1 px-1 text-xs sm:grid-cols-2">
          {MILESTONES.map((m, i) => (
            <li key={m.id} className={`flex gap-2 ${weeks >= m.week ? "text-ink" : "text-ink-3"}`}>
              <span className="tnum w-4 shrink-0 text-right font-bold">{i + 1}</span>
              <span>
                {m.label[locale]}
                {m.id === "trial" && (
                  <>
                    {" "}
                    <Link className="text-accent underline underline-offset-2" href={href(locale, "tracker")}>
                      {c.openTracker[locale]}
                    </Link>
                  </>
                )}
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-2 px-1 text-xs text-ink-2">{c.naturalCourse[locale]}</p>
      </figure>

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
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink-3">{c.happens[locale]}</p>
        <ul className="mt-1 list-disc space-y-0.5 pl-5 text-ink-2">
          {now.happens.map((h) => (
            <li key={h.en}>{h[locale]}</li>
          ))}
        </ul>
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
