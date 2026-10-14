"use client";

import { useState } from "react";
import { SourceList } from "@/components/ui/SourceList";
import { fill } from "@/lib/copy";
import { bruising, CUPPING_COPY, CUPPING_SOURCES, MARK_TEXT, markLevel, MINUTES, type Suction } from "@/lib/diagrams/cupping";
import type { Locale } from "@/lib/i18n";
import { Choice } from "./Choice";

/** Vessel positions in the skin band, fixed so the picture doesn't jump about. */
const VESSELS = [70, 92, 112, 130, 148, 166, 186, 206, 226, 246].map((x, i) => ({ x, y: 118 + (i % 3) * 7 }));
const LIFT: Record<Suction, number> = { light: 14, medium: 24, strong: 34 };
const MARK_COLOUR = { none: "rgb(var(--bone))", pink: "rgb(var(--bad) / 0.25)", red: "rgb(var(--bad) / 0.55)", purple: "rgb(var(--bruise) / 0.75)" } as const;

export function CuppingSkin({ locale }: { locale: Locale }) {
  const c = CUPPING_COPY;
  const [suction, setSuction] = useState<Suction>("medium");
  const [minutes, setMinutes] = useState(5);
  const [wet, setWet] = useState(false);
  const b = bruising(suction, minutes);
  const level = markLevel(b);
  const broken = Math.round(b * VESSELS.length);
  const lift = LIFT[suction];
  // The skin surface rises into the cup between x=60 and x=260.
  const skinTop = `M0 100H60C90 100 100 ${100 - lift} 160 ${100 - lift}C220 ${100 - lift} 230 100 260 100H320`;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <div className="min-w-0 space-y-3">
        <Choice label={c.suction[locale]} value={suction} onChange={setSuction} options={(["light", "medium", "strong"] as const).map((id) => ({ id, name: c.suctions[id][locale] }))} />
        <label className="block text-sm font-medium tnum">
          {fill(c.minutes[locale], { n: minutes })}
          <input type="range" min={MINUTES.min} max={MINUTES.max} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className="mt-1 block w-full accent-accent" />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="h-4 w-4 accent-accent" checked={wet} onChange={(e) => setWet(e.target.checked)} />
          {c.wet[locale]}
        </label>
        <figure className="m-0 rounded-2xl border border-line bg-surface p-3">
          <svg viewBox="0 0 320 200" className="block h-auto w-full" role="img" aria-label={`${c.figure[locale]}: ${MARK_TEXT[level][locale]}`}>
            {/* Muscle and skin */}
            <rect x={0} y={140} width={320} height={60} fill="rgb(var(--bad) / 0.3)" />
            <path d={`${skinTop}V140H0Z`} fill={MARK_COLOUR.none} stroke="rgb(var(--ink-3))" />
            {/* The mark: blood that has leaked into the skin under the cup */}
            {level !== "none" && <ellipse cx={160} cy={112} rx={78} ry={18 + lift / 3} fill={MARK_COLOUR[level]} />}
            {VESSELS.map((v, i) => {
              const isBroken = i >= (VESSELS.length - broken) / 2 && i < (VESSELS.length + broken) / 2;
              return isBroken ? (
                <g key={v.x} fill="rgb(var(--bad))">
                  <circle cx={v.x} cy={v.y} r={2} />
                  <circle cx={v.x + 4} cy={v.y - 3} r={1.4} />
                  <circle cx={v.x - 3} cy={v.y + 3} r={1.4} />
                </g>
              ) : (
                <ellipse key={v.x} cx={v.x} cy={v.y} rx={6} ry={2.4} fill="none" stroke="rgb(var(--bad))" strokeWidth={1.4} />
              );
            })}
            {wet && (
              <g stroke="rgb(var(--bad))" strokeWidth={1.6}>
                {[128, 150, 172, 194].map((x) => (
                  <path key={x} d={`M${x} ${100 - lift + 2}v7`} />
                ))}
                <ellipse cx={160} cy={100 - lift - 6} rx={30} ry={5} fill="rgb(var(--bad) / 0.6)" stroke="none" />
              </g>
            )}
            {/* The cup */}
            <path d={`M56 ${100}V${54 - lift}Q56 ${36 - lift} 76 ${36 - lift}H244Q264 ${36 - lift} 264 ${54 - lift}V100`} fill="rgb(var(--parasymp) / 0.08)" stroke="rgb(var(--ink-2))" strokeWidth={2} />
            <text x={268} y={60 - lift} fontSize={10} fill="rgb(var(--ink-3))">{c.cup[locale]}</text>
            <text x={6} y={96} fontSize={10} fill="rgb(var(--ink-3))">{c.skin[locale]}</text>
            <text x={6} y={176} fontSize={10} fill="rgb(var(--ink-2))">{c.muscle[locale]}</text>
          </svg>
        </figure>
      </div>
      <article className="min-w-0 space-y-3 rounded-2xl border border-line bg-surface p-5" aria-live="polite">
        <p className="leading-relaxed">{MARK_TEXT[level][locale]}</p>
        <p className="text-sm text-ink-2">{c.toxins[locale]}</p>
        {wet && <p className="rounded-xl border-l-4 border-warn bg-warn/5 p-3 text-sm">{c.wetNote[locale]}</p>}
        <p className="rounded-xl bg-raised p-3 text-sm">{c.evidence[locale]}</p>
        <SourceList ids={CUPPING_SOURCES} locale={locale} />
      </article>
    </div>
  );
}
