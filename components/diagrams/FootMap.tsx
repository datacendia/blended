"use client";

import { useState, type ReactNode } from "react";
import { SourceList } from "@/components/ui/SourceList";
import { fill } from "@/lib/copy";
import { FOOT_COPY, FOOT_SOURCES, NERVES, ZONES, type NerveId, type ZoneId } from "@/lib/diagrams/foot";
import type { Locale } from "@/lib/i18n";
import { Choice } from "./Choice";

/**
 * Right sole, toes up. The same zones can be coloured two ways: by the
 * chart's horizontal bands, or by the nerves, which run lengthwise. Seeing
 * one switch to the other is the point.
 */
const SOLE = "M64 334C40 326 34 290 40 250C45 214 40 182 38 150C36 120 37 94 45 80C60 62 122 58 152 74C164 84 164 112 160 142C156 176 160 214 162 250C166 300 150 334 116 338Z";
// Toes overlap the top of the sole so they read as part of the foot.
const TOES = [
  { cx: 88, cy: 48, rx: 9, ry: 14 },
  { cx: 108, cy: 48, rx: 8.5, ry: 13 },
  { cx: 126, cy: 55, rx: 8, ry: 12 },
  { cx: 142, cy: 68, rx: 7, ry: 10 }
];
const BIG_TOE = { cx: 60, cy: 52, rx: 16, ry: 24 };
const BANDS: Partial<Record<ZoneId, [number, number]>> = { ball: [80, 132], "upper-arch": [132, 192], "lower-arch": [192, 252], heel: [252, 345] };
const SPLIT_X = 118;

const ZONE_FILL: Record<ZoneId, string> = {
  "big-toe": "rgb(var(--accent) / 0.55)",
  "big-toe-base": "rgb(var(--bad) / 0.45)",
  toes: "rgb(var(--accent) / 0.3)",
  ball: "rgb(var(--parasymp) / 0.35)",
  "upper-arch": "rgb(var(--symp) / 0.4)",
  "lower-arch": "rgb(var(--lumbar) / 0.55)",
  heel: "rgb(var(--sacral) / 0.5)",
  "inner-edge": "rgb(var(--thoracic) / 0.55)"
};
const NERVE_FILL: Record<NerveId, string> = {
  "medial-plantar": "rgb(var(--accent) / 0.45)",
  "lateral-plantar": "rgb(var(--parasymp) / 0.4)",
  calcaneal: "rgb(var(--lumbar) / 0.6)",
  saphenous: "rgb(var(--symp) / 0.5)"
};

type Mode = "chart" | "nerves";

export function FootMap({ locale }: { locale: Locale }) {
  const c = FOOT_COPY;
  const [mode, setMode] = useState<Mode>("chart");
  const [id, setId] = useState<ZoneId>("big-toe-base");
  const zone = ZONES.find((z) => z.id === id)!;

  /** The shape of a zone, for both filling and outlining. */
  const zoneShape = (z: ZoneId, props: React.SVGProps<SVGElement>): ReactNode => {
    const p = props as React.SVGProps<SVGRectElement & SVGEllipseElement & SVGPathElement>;
    if (z === "big-toe") return <path d={`M${BIG_TOE.cx - BIG_TOE.rx} ${BIG_TOE.cy}A${BIG_TOE.rx} ${BIG_TOE.ry} 0 0 1 ${BIG_TOE.cx + BIG_TOE.rx} ${BIG_TOE.cy}Z`} {...p} />;
    if (z === "big-toe-base") return <path d={`M${BIG_TOE.cx - BIG_TOE.rx} ${BIG_TOE.cy}A${BIG_TOE.rx} ${BIG_TOE.ry} 0 0 0 ${BIG_TOE.cx + BIG_TOE.rx} ${BIG_TOE.cy}Z`} {...p} />;
    if (z === "toes") return <g>{TOES.map((t) => <ellipse key={t.cx} {...t} {...p} />)}</g>;
    if (z === "inner-edge") return <rect x={30} y={96} width={20} height={200} clipPath="url(#sole-clip)" {...p} />;
    const [y0, y1] = BANDS[z]!;
    return <rect x={20} y={y0} width={160} height={y1 - y0} clipPath="url(#sole-clip)" {...p} />;
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <div className="min-w-0 space-y-3">
        <Choice label={c.mode[locale]} value={mode} onChange={setMode} options={(["chart", "nerves"] as const).map((m) => ({ id: m, name: c.modes[m][locale] }))} />
        <figure className="m-0 rounded-2xl border border-line bg-surface p-3">
          <svg viewBox="10 8 180 340" className="mx-auto block h-auto w-full max-w-[260px]" role="img" aria-label={`${c.figure[locale]}: ${zone.short[locale]}`}>
            <defs>
              <clipPath id="sole-clip">
                <path d={SOLE} />
              </clipPath>
            </defs>
            <ellipse {...BIG_TOE} fill="rgb(var(--bone))" stroke="rgb(var(--ink-3))" />
            {TOES.map((t) => (
              <ellipse key={t.cx} {...t} fill="rgb(var(--bone))" stroke="rgb(var(--ink-3))" />
            ))}
            <path d={SOLE} fill="rgb(var(--bone))" stroke="rgb(var(--ink-3))" />

            {mode === "chart" ? (
              <g>
                {ZONES.map((z) => (
                  <g key={z.id}>{zoneShape(z.id, { fill: ZONE_FILL[z.id] } as React.SVGProps<SVGElement>)}</g>
                ))}
                {(["ball", "upper-arch", "lower-arch", "heel"] as const).map((z) => {
                  const [y0, y1] = BANDS[z]!;
                  return (
                    <text key={z} x={104} y={(y0 + y1) / 2 + 4} textAnchor="middle" fontSize={11} fill="rgb(var(--ink))">
                      {ZONES.find((x) => x.id === z)!.short[locale]}
                    </text>
                  );
                })}
                <text x={BIG_TOE.cx} y={42} textAnchor="middle" fontSize={9} fill="rgb(var(--ink))">{ZONES.find((x) => x.id === "big-toe")!.short[locale]}</text>
                <text x={BIG_TOE.cx} y={67} textAnchor="middle" fontSize={9} fill="rgb(var(--ink))">{ZONES.find((x) => x.id === "big-toe-base")!.short[locale]}</text>
                <text x={40} y={200} textAnchor="middle" fontSize={9} fill="rgb(var(--ink))" transform="rotate(-90 40 200)">{ZONES.find((x) => x.id === "inner-edge")!.short[locale]}</text>
              </g>
            ) : (
              <g>
                <g clipPath="url(#sole-clip)">
                  <rect x={20} y={70} width={SPLIT_X - 20} height={182} fill={NERVE_FILL["medial-plantar"]} />
                  <rect x={SPLIT_X} y={70} width={60} height={182} fill={NERVE_FILL["lateral-plantar"]} />
                  <rect x={20} y={252} width={160} height={95} fill={NERVE_FILL.calcaneal} />
                  <rect x={30} y={150} width={14} height={110} fill={NERVE_FILL.saphenous} />
                </g>
                <ellipse {...BIG_TOE} fill={NERVE_FILL["medial-plantar"]} />
                {TOES.map((t) => (
                  <ellipse key={t.cx} {...t} fill={t.cx < SPLIT_X ? NERVE_FILL["medial-plantar"] : NERVE_FILL["lateral-plantar"]} />
                ))}
                <text x={80} y={170} textAnchor="middle" fontSize={10} fill="rgb(var(--ink))">{NERVES["medial-plantar"].short[locale]}</text>
                <text x={140} y={200} textAnchor="middle" fontSize={10} fill="rgb(var(--ink))" transform="rotate(-90 140 200)">{NERVES["lateral-plantar"].short[locale]}</text>
                <text x={100} y={300} textAnchor="middle" fontSize={10} fill="rgb(var(--ink))">{NERVES.calcaneal.short[locale]}</text>
                <line x1={SPLIT_X} y1={78} x2={SPLIT_X} y2={252} stroke="rgb(var(--ink-2))" strokeDasharray="3 3" />
              </g>
            )}

            {/* Hit areas, and the picked zone's outline, on top in both modes */}
            {ZONES.map((z) => (
              <g key={`hit-${z.id}`} onClick={() => setId(z.id)} className="cursor-pointer">
                {zoneShape(z.id, { fill: "transparent", stroke: z.id === id ? "rgb(var(--ink))" : "none", strokeWidth: 2.2 } as React.SVGProps<SVGElement>)}
              </g>
            ))}
          </svg>
          {mode === "chart" && <figcaption className="mt-2 px-1 text-xs text-ink-3">{c.chartCaveat[locale]}</figcaption>}
        </figure>
        <Choice label={c.zones[locale]} value={id} onChange={setId} options={ZONES.map((z) => ({ id: z.id, name: z.short[locale] }))} />
      </div>
      <article className="min-w-0 space-y-3 rounded-2xl border border-line bg-surface p-5" aria-live="polite">
        <div className="rounded-xl border border-dashed border-line p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">{c.chartSays[locale]}</p>
          <p className="mt-1 text-lg font-semibold italic">{zone.claim[locale]}</p>
        </div>
        <div className="rounded-xl bg-raised p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">{c.nervesSay[locale]}</p>
          <ul className="mt-1 space-y-1">
            {zone.nerves.map((n) => (
              <li key={n}>
                <span className="font-semibold">{NERVES[n].name[locale]}</span>
                <span className="text-sm text-ink-2">, {fill(c.enters[locale], { roots: NERVES[n].roots.replace("-", "\u2011") })}</span>
              </li>
            ))}
          </ul>
        </div>
        {zone.id === "big-toe-base" && <p className="text-sm font-medium">{c.neckNote[locale]}</p>}
        <p className="leading-relaxed text-ink-2">{c.summary[locale]}</p>
        <p className="text-sm text-ink-3">{c.evidence[locale]}</p>
        <SourceList ids={FOOT_SOURCES} locale={locale} />
      </article>
    </div>
  );
}
