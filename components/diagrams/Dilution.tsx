"use client";

import { useState } from "react";
import { SourceList } from "@/components/ui/SourceList";
import { fill } from "@/lib/copy";
import { chanceLog10, chanceOfOne, DILUTION_COPY, DILUTION_SOURCES, expectedLog10, LOG_AVOGADRO, MAX_C, POTENCIES, scientific } from "@/lib/diagrams/dilution";
import { formatNumber, type Locale } from "@/lib/i18n";

/** The scale runs from 10^24 down to 10^-60; anything below is pinned to the end. */
const TOP = 24;
const BOTTOM = -60;
const X0 = 20;
const X1 = 300;
const xFor = (log: number) => X0 + ((TOP - Math.max(BOTTOM, Math.min(TOP, log))) / (TOP - BOTTOM)) * (X1 - X0);

function Sci({ log, locale }: { log: number; locale: Locale }) {
  const { mantissa, exponent } = scientific(log);
  return (
    <span className="tnum">
      {formatNumber(mantissa, locale)} × 10<sup>{exponent}</sup>
    </span>
  );
}

export function Dilution({ locale }: { locale: Locale }) {
  const c = DILUTION_COPY;
  const [n, setN] = useState(12);
  const log = expectedLog10(n);
  const chance = chanceOfOne(n);
  const integerFormat = new Intl.NumberFormat(locale === "es" ? "es-PE" : "en-US", { maximumFractionDigits: 0 });

  const verdict =
    log >= 2
      ? fill(c.some[locale], { n: log < 15 ? integerFormat.format(10 ** log) : `10^${Math.floor(log)}` })
      : chance >= 0.01
        ? fill(c.maybe[locale], { pct: Math.round(chance * 100) })
        : fill(c.none[locale], { k: Math.round(-chanceLog10(n)) });

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <div className="min-w-0 space-y-3">
        <label className="block text-sm font-medium tnum">
          {fill(c.strength[locale], { n })}
          <input type="range" min={1} max={MAX_C} value={n} onChange={(e) => setN(Number(e.target.value))} className="mt-1 block w-full accent-accent" />
        </label>
        <div role="group" aria-label={c.presets[locale]} className="flex flex-wrap gap-2">
          {POTENCIES.map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={p === n}
              onClick={() => setN(p)}
              className={`rounded-full border px-3 py-1 text-sm tnum ${p === n ? "border-accent bg-accent font-medium text-accent-ink" : "border-line bg-surface hover:border-accent"}`}
            >
              {p}C
            </button>
          ))}
        </div>
        <figure className="m-0 rounded-2xl border border-line bg-surface p-3">
          <svg viewBox="0 0 320 120" className="block h-auto w-full" role="img" aria-label={`${c.figure[locale]}: ${n}C`}>
            <rect x={X0} y={52} width={xFor(0) - X0} height={14} rx={3} fill="rgb(var(--accent) / 0.2)" />
            <rect x={xFor(0)} y={52} width={X1 - xFor(0)} height={14} rx={3} fill="rgb(var(--bad) / 0.12)" />
            {[24, 12, 0, -12, -24, -36, -48, -60].map((e) => (
              <g key={e}>
                <line x1={xFor(e)} y1={66} x2={xFor(e)} y2={72} stroke="rgb(var(--ink-3))" />
                <text x={xFor(e)} y={84} fontSize={9} textAnchor="middle" fill="rgb(var(--ink-3))">
                  10
                  <tspan dy={-4} fontSize={7}>{e}</tspan>
                </text>
              </g>
            ))}
            <line x1={xFor(0)} y1={40} x2={xFor(0)} y2={70} stroke="rgb(var(--ink))" strokeWidth={1.6} />
            <text x={xFor(0)} y={34} fontSize={10} textAnchor="middle" fill="rgb(var(--ink))">{c.line[locale]}</text>
            <circle cx={xFor(LOG_AVOGADRO)} cy={59} r={4} fill="rgb(var(--ink-3))" />
            <path d={`M${xFor(LOG_AVOGADRO)} 59H${xFor(log)}`} stroke="rgb(var(--ink-3))" strokeDasharray="3 3" />
            <circle cx={xFor(log)} cy={59} r={7} fill={log >= 0 ? "rgb(var(--accent))" : "rgb(var(--bad))"} stroke="rgb(var(--surface))" strokeWidth={2} />
            {log < BOTTOM && (
              <text x={X1} y={104} fontSize={9} textAnchor="end" fill="rgb(var(--bad))">
                → 10<tspan dy={-4} fontSize={7}>{Math.floor(log)}</tspan>
              </text>
            )}
          </svg>
          <figcaption className="mt-1 px-1 text-xs text-ink-3">{c.start[locale]}</figcaption>
        </figure>
      </div>
      <article className="min-w-0 space-y-3 rounded-2xl border border-line bg-surface p-5" aria-live="polite">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">{c.left[locale]}</p>
        <p className="text-3xl font-semibold">
          <Sci log={log} locale={locale} />
        </p>
        <p className="text-sm text-ink-3 tnum">{fill(c.steps[locale], { n })}</p>
        <p className="leading-relaxed">{verdict}</p>
        <div className="rounded-xl border border-dashed border-line p-3 text-sm italic text-ink-2">{c.tradition[locale]}</div>
        <p className="rounded-xl bg-raised p-3 text-sm">{c.evidence[locale]}</p>
        <SourceList ids={DILUTION_SOURCES} locale={locale} />
      </article>
    </div>
  );
}
