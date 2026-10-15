"use client";

import { useState } from "react";
import { SourceList } from "@/components/ui/SourceList";
import { fill } from "@/lib/copy";
import { chanceLog10, chanceOfOne, DILUTION_COPY, DILUTION_SOURCES, expectedLog10, lastMoleculeStep, LOG_AVOGADRO, MAX_C, scientific, SCALES, type Scale } from "@/lib/diagrams/dilution";
import { formatNumber, type Locale } from "@/lib/i18n";
import { Choice } from "./Choice";
import { HALO } from "./shapes";

/* The ladder: steps along the bottom, expected molecules (as a power of ten) up the side. */
const LX0 = 34;
const LX1 = 306;
const LY_TOP = 24;
const LY_BOTTOM = -60;
const LY0 = 14;
const LY1 = 128;
const ly = (log: number) => LY0 + ((LY_TOP - Math.max(LY_BOTTOM, Math.min(LY_TOP, log))) / (LY_TOP - LY_BOTTOM)) * (LY1 - LY0);
const MAX_STEP: Record<Scale, number> = { C: 40, X: 80 };

/** Fixed dot positions inside a vial, spread evenly (a golden-ratio lattice) so the picture doesn't jump about. */
const DOTS = Array.from({ length: 64 }, (_, k) => ({ x: 5 + ((k * 0.618034) % 1) * 30, y: 18 + ((k + 0.5) / 64) * 52 }));

function Sci({ log, locale }: { log: number; locale: Locale }) {
  const { mantissa, exponent } = scientific(log);
  return (
    <span className="tnum">
      {formatNumber(mantissa, locale)} × 10<sup>{exponent}</sup>
    </span>
  );
}

/** "≈ 6,000", "≈ 0.6", or 10 to a power for anything too big or too small to write out. */
function CountLabel({ log, locale }: { log: number; locale: Locale }) {
  if (log > 5 || log < -3)
    return (
      <>
        10<tspan dy={-3} fontSize={6}>{Math.floor(log)}</tspan>
      </>
    );
  return <>≈ {new Intl.NumberFormat(locale === "es" ? "es-PE" : "en-US", { maximumSignificantDigits: 1 }).format(10 ** log)}</>;
}

export function Dilution({ locale }: { locale: Locale }) {
  const c = DILUTION_COPY;
  const [scale, setScale] = useState<Scale>("C");
  const [n, setN] = useState(12);
  const log = expectedLog10(n, scale);
  const chance = chanceOfOne(n, scale);
  const cross = lastMoleculeStep(scale);
  const factor = scale === "C" ? 100 : 10;
  const integerFormat = new Intl.NumberFormat(locale === "es" ? "es-PE" : "en-US", { maximumFractionDigits: 0 });
  const maxStep = MAX_STEP[scale];
  const lx = (step: number) => LX0 + (Math.min(step, maxStep) / maxStep) * (LX1 - LX0);

  const verdict =
    log >= 2
      ? fill(c.some[locale], { n: log < 15 ? integerFormat.format(10 ** log) : `10^${Math.floor(log)}` })
      : chance >= 0.01
        ? fill(c.maybe[locale], { pct: Math.round(chance * 100) })
        : fill(c.none[locale], { k: Math.round(-chanceLog10(n, scale)) });

  // The vials either side of the step where the last molecule is expected to go, then the chosen strength.
  const vialSteps = [0, cross - 3, cross - 2, cross - 1, cross, ...(n > cross || n < cross - 3 ? [n] : [])];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
      <div className="min-w-0 space-y-3">
        <Choice
          label={c.scale[locale]}
          value={scale}
          onChange={(s) => {
            setScale(s);
            setN(SCALES[s].presets[1]!);
          }}
          options={[
            { id: "C" as const, name: c.scaleC[locale] },
            { id: "X" as const, name: c.scaleX[locale] }
          ]}
        />
        <label className="tnum block text-sm font-medium">
          {fill(c.strength[locale], { n, s: scale })}
          <input type="range" min={1} max={MAX_C} value={n} onChange={(e) => setN(Number(e.target.value))} className="mt-1 block w-full accent-accent" />
        </label>
        <div role="group" aria-label={c.presets[locale]} className="flex flex-wrap gap-2">
          {SCALES[scale].presets.map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={p === n}
              onClick={() => setN(p)}
              className={`tnum rounded-full border px-3 py-1 text-sm ${p === n ? "border-accent bg-accent font-medium text-accent-ink" : "border-line bg-surface hover:border-accent"}`}
            >
              {p}
              {scale}
            </button>
          ))}
        </div>

        <figure className="m-0 rounded-2xl border border-line bg-surface p-3">
          <p className="mb-1 px-1 text-xs font-semibold uppercase tracking-wide text-ink-3">{c.vials[locale]}</p>
          <svg viewBox={`0 0 ${vialSteps.length * 52} 112`} className="block h-auto w-full" role="img" aria-label={c.vials[locale]}>
            {vialSteps.map((step, k) => {
              const l = expectedLog10(step, scale);
              const expected = 10 ** l;
              // Up to 64 molecules are drawn one by one; past that the vial is tinted as well.
              const many = expected > DOTS.length;
              const dots = many ? DOTS.length : expected >= 1 ? Math.round(expected) : 0;
              const chosen = step === n;
              return (
                <g key={`${step}-${k}`} transform={`translate(${k * 52 + 6} 0)`}>
                  {k === vialSteps.length - 1 && vialSteps.length > 5 && (
                    <text x={-6} y={50} fontSize={12} textAnchor="middle" fill="rgb(var(--ink-3))">
                      …
                    </text>
                  )}
                  <path d="M4 16H36V22L40 30V80Q40 88 32 88H8Q0 88 0 80V30L4 22Z" fill="rgb(var(--parasymp) / 0.1)" stroke={chosen ? "rgb(var(--accent))" : "rgb(var(--ink-3))"} strokeWidth={chosen ? 2 : 1} />
                  <rect x={6} y={10} width={28} height={7} rx={2} fill="rgb(var(--ink-3) / 0.4)" />
                  {many && <rect x={1.5} y={31} width={37} height={55} rx={6} fill="rgb(var(--accent) / 0.22)" />}
                  {DOTS.slice(0, dots).map((d, j) => (
                    <circle key={j} cx={d.x} cy={d.y + 14} r={1.4} fill="rgb(var(--accent))" />
                  ))}
                  {expected < 1 && expected > 0.001 && <circle cx={20} cy={58} r={2.2} fill="rgb(var(--accent))" opacity={Math.max(0.15, expected)} />}
                  <text x={20} y={100} fontSize={8} textAnchor="middle" fontWeight={chosen ? 700 : 500} fill="rgb(var(--ink))" className="tnum">
                    {step === 0 ? c.vialStart[locale] : `${step}${scale}`}
                  </text>
                  <text x={20} y={110} fontSize={7.5} textAnchor="middle" fill={expected < 1 ? "rgb(var(--bad))" : "rgb(var(--ink-3))"} className="tnum">
                    {expected < 0.001 ? c.probablyNone[locale] : <CountLabel log={l} locale={locale} />}
                  </text>
                </g>
              );
            })}
          </svg>
          <figcaption className="mt-1 px-1 text-xs text-ink-3">
            {fill(c.oneIn[locale], { k: factor - 1 })} · {c.start[locale]}
          </figcaption>
        </figure>

        <figure className="m-0 rounded-2xl border border-line bg-surface p-3">
          <p className="mb-1 px-1 text-xs font-semibold uppercase tracking-wide text-ink-3">{c.ladder[locale]}</p>
          <svg viewBox="0 0 320 150" className="block h-auto w-full" role="img" aria-label={`${c.ladder[locale]}: ${n}${scale}`}>
            <rect x={LX0} y={ly(0)} width={LX1 - LX0} height={LY1 - ly(0)} fill="rgb(var(--bad) / 0.07)" />
            {[24, 0, -24, -48].map((e) => (
              <g key={e}>
                <line x1={LX0} y1={ly(e)} x2={LX1} y2={ly(e)} stroke="rgb(var(--ink-3) / 0.25)" />
                <text x={LX0 - 4} y={ly(e) + 3} fontSize={8} textAnchor="end" fill="rgb(var(--ink-3))">
                  10<tspan dy={-3} fontSize={6}>{e}</tspan>
                </text>
              </g>
            ))}
            <line x1={LX0} y1={ly(0)} x2={LX1} y2={ly(0)} stroke="rgb(var(--ink))" strokeWidth={1.4} />
            <text x={LX1} y={ly(0) - 4} fontSize={8} textAnchor="end" {...HALO}>
              {c.line[locale]}
            </text>
            <path d={`M${lx(0)} ${ly(LOG_AVOGADRO)}L${lx(maxStep)} ${ly(expectedLog10(maxStep, scale))}`} fill="none" stroke="rgb(var(--accent))" strokeWidth={2} />
            <line x1={lx(cross)} y1={LY0} x2={lx(cross)} y2={LY1} stroke="rgb(var(--ink-2))" strokeDasharray="3 3" />
            <text x={lx(cross) + 4} y={LY0 + 8} fontSize={8} {...HALO} fill="rgb(var(--ink-2))">
              {fill(c.crossover[locale], { n: `${cross}${scale}` })}
            </text>
            {Array.from({ length: maxStep / (scale === "C" ? 10 : 20) + 1 }, (_, k) => k * (scale === "C" ? 10 : 20)).map((st) => (
              <text key={st} x={lx(st)} y={LY1 + 11} fontSize={8} textAnchor="middle" fill="rgb(var(--ink-3))" className="tnum">
                {st}
              </text>
            ))}
            <text x={(LX0 + LX1) / 2} y={LY1 + 21} fontSize={8} textAnchor="middle" fill="rgb(var(--ink-3))">
              {c.ladderAxis[locale]}
            </text>
            {n <= maxStep ? (
              <circle cx={lx(n)} cy={ly(log)} r={5.5} fill={log >= 0 ? "rgb(var(--accent))" : "rgb(var(--bad))"} stroke="rgb(var(--surface))" strokeWidth={2} />
            ) : (
              <text x={LX1} y={LY1 - 4} fontSize={8.5} textAnchor="end" {...HALO} fill="rgb(var(--bad))">
                {n}
                {scale} → 10<tspan dy={-3} fontSize={6.5}>{Math.floor(log)}</tspan>
              </text>
            )}
          </svg>
        </figure>
      </div>
      <article className="min-w-0 space-y-3 rounded-2xl border border-line bg-surface p-5" aria-live="polite">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">{c.left[locale]}</p>
        <p className="text-3xl font-semibold">
          <Sci log={log} locale={locale} />
        </p>
        <p className="tnum text-sm text-ink-3">{fill(c.steps[locale], { n, f: factor })}</p>
        <p className="leading-relaxed">{verdict}</p>
        <div className="rounded-xl border border-dashed border-line p-3 text-sm italic text-ink-2">{c.tradition[locale]}</div>
        <p className="rounded-xl bg-raised p-3 text-sm">{c.evidence[locale]}</p>
        <SourceList ids={DILUTION_SOURCES} locale={locale} />
      </article>
    </div>
  );
}
