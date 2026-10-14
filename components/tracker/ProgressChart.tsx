"use client";

import { useState } from "react";
import { COPY } from "@/lib/copy";
import { daysBetween } from "@/lib/outcomes";
import { formatNumber, type Locale } from "@/lib/i18n";

export interface ChartPoint {
  date: string;
  sessionsUsed: number;
  pain: number | null;
  fn: number | null;
}

const W = 600;
const H = 250;
const M = { l: 30, r: 96, t: 14, b: 30 };
const PAIN = "rgb(var(--series-pain))";
const FN = "rgb(var(--series-function))";

/**
 * Pain and function on one 0-10 axis — both are 0-10 scales, so one axis is
 * honest here. A hairline marks the pain level that would count as a
 * meaningful improvement from the first check-in.
 */
export function ProgressChart({
  points,
  painName,
  painTarget,
  locale
}: {
  points: ChartPoint[];
  painName: string;
  painTarget: number | null;
  locale: Locale;
}) {
  const c = COPY.tracker;
  const [active, setActive] = useState<number | null>(null);
  if (points.length === 0) return null;

  const first = points[0]!.date;
  const span = Math.max(1, daysBetween(first, points[points.length - 1]!.date));
  const x = (date: string) => (points.length === 1 ? M.l + (W - M.l - M.r) / 2 : M.l + (daysBetween(first, date) / span) * (W - M.l - M.r));
  const y = (v: number) => M.t + (1 - v / 10) * (H - M.t - M.b);

  const line = (key: "pain" | "fn") =>
    points
      .filter((p) => p[key] !== null)
      .map((p, i) => `${i === 0 ? "M" : "L"}${x(p.date).toFixed(1)} ${y(p[key]!).toFixed(1)}`)
      .join(" ");

  const last = points[points.length - 1]!;
  const showEndLabels = last.pain !== null && last.fn !== null && Math.abs(last.pain - last.fn) >= 1.2;
  const nearest = (clientX: number, rect: DOMRect) => {
    const px = ((clientX - rect.left) / rect.width) * W;
    let best = 0;
    points.forEach((p, i) => {
      if (Math.abs(x(p.date) - px) < Math.abs(x(points[best]!.date) - px)) best = i;
    });
    return best;
  };
  const shown = active === null ? null : points[active]!;
  const n = (v: number) => formatNumber(v, locale, Number.isInteger(v) ? 0 : 1);
  const tickDates = points.length <= 6 ? points.map((p) => p.date) : [first, points[Math.floor(points.length / 2)]!.date, last.date];

  return (
    <figure className="rounded-2xl border border-line bg-surface p-4">
      <figcaption className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="font-semibold">{c.chartTitle[locale]}</span>
        <span className="flex flex-wrap gap-4 text-xs text-ink-2">
          <span className="flex items-center gap-1.5">
            <svg width="16" height="4" aria-hidden="true">
              <line x1="0" x2="16" y1="2" y2="2" stroke={PAIN} strokeWidth="2" strokeLinecap="round" />
            </svg>
            {painName} ({c.lowerBetter[locale]})
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="16" height="4" aria-hidden="true">
              <line x1="0" x2="16" y1="2" y2="2" stroke={FN} strokeWidth="2" strokeLinecap="round" />
            </svg>
            {c.functionShort[locale]} ({c.higherBetter[locale]})
          </span>
        </span>
      </figcaption>
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full touch-none"
          role="img"
          aria-label={`${c.chartTitle[locale]}: ${points.map((p) => `${p.date} ${painName} ${p.pain ?? "—"}, ${c.functionShort[locale]} ${p.fn ?? "—"}`).join("; ")}`}
          tabIndex={0}
          onPointerMove={(e) => setActive(nearest(e.clientX, e.currentTarget.getBoundingClientRect()))}
          onPointerLeave={() => setActive(null)}
          onFocus={() => setActive(points.length - 1)}
          onBlur={() => setActive(null)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setActive((a) => Math.max(0, (a ?? points.length - 1) - 1));
            if (e.key === "ArrowRight") setActive((a) => Math.min(points.length - 1, (a ?? 0) + 1));
          }}
        >
          {[0, 2, 4, 6, 8, 10].map((v) => (
            <g key={v}>
              <line x1={M.l} x2={W - M.r} y1={y(v)} y2={y(v)} stroke="rgb(var(--line))" strokeWidth="1" />
              <text x={M.l - 8} y={y(v) + 4} fontSize="11" textAnchor="end" fill="rgb(var(--ink-3))">
                {v}
              </text>
            </g>
          ))}
          {tickDates.map((d) => (
            <text key={d} x={x(d)} y={H - 8} fontSize="11" textAnchor="middle" fill="rgb(var(--ink-3))">
              {d.slice(5)}
            </text>
          ))}
          {painTarget !== null && painTarget >= 0 && (
            <g>
              <line x1={M.l} x2={W - M.r} y1={y(painTarget)} y2={y(painTarget)} stroke="rgb(var(--ink-3))" strokeWidth="1" />
              <text x={M.l + 4} y={y(painTarget) - 5} fontSize="10" fill="rgb(var(--ink-3))">
                {painName}: {c.target[locale]} ≤ {n(painTarget)}
              </text>
            </g>
          )}
          {shown && (
            <line x1={x(shown.date)} x2={x(shown.date)} y1={M.t} y2={H - M.b} stroke="rgb(var(--ink-3))" strokeWidth="1" />
          )}
          <path d={line("pain")} fill="none" stroke={PAIN} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          <path d={line("fn")} fill="none" stroke={FN} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          {points.map((p, i) => (
            <g key={`${p.date}-${i}`}>
              {p.pain !== null && <circle cx={x(p.date)} cy={y(p.pain)} r={active === i ? 5.5 : 4} fill={PAIN} stroke="rgb(var(--surface))" strokeWidth="2" />}
              {p.fn !== null && <circle cx={x(p.date)} cy={y(p.fn)} r={active === i ? 5.5 : 4} fill={FN} stroke="rgb(var(--surface))" strokeWidth="2" />}
            </g>
          ))}
          {showEndLabels && (
            <>
              <text x={x(last.date) + 10} y={y(last.pain!) + 4} fontSize="11" fill="rgb(var(--ink-2))">
                {n(last.pain!)}
              </text>
              <text x={x(last.date) + 10} y={y(last.fn!) + 4} fontSize="11" fill="rgb(var(--ink-2))">
                {n(last.fn!)}
              </text>
            </>
          )}
        </svg>
        {shown && (
          <div
            className="pointer-events-none absolute top-1 rounded-lg border border-line bg-surface px-3 py-2 text-xs shadow-md"
            style={{ left: `${Math.min(70, Math.max(0, (x(shown.date) / W) * 100 - 10))}%` }}
            aria-hidden="true"
          >
            <p className="tnum text-ink-3">
              {shown.date} · #{shown.sessionsUsed}
            </p>
            <p className="flex items-center gap-1.5">
              <svg width="12" height="4">
                <line x1="0" x2="12" y1="2" y2="2" stroke={PAIN} strokeWidth="2" />
              </svg>
              <strong className="tnum">{shown.pain === null ? "—" : n(shown.pain)}</strong>
              <span className="text-ink-3">{painName}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <svg width="12" height="4">
                <line x1="0" x2="12" y1="2" y2="2" stroke={FN} strokeWidth="2" />
              </svg>
              <strong className="tnum">{shown.fn === null ? "—" : n(shown.fn)}</strong>
              <span className="text-ink-3">{c.functionShort[locale]}</span>
            </p>
          </div>
        )}
      </div>
    </figure>
  );
}
