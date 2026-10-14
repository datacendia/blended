"use client";

import { useState } from "react";
import { SourceList } from "@/components/ui/SourceList";
import { ANGLE_FACTOR, LAYER_NAME, layerAt, layers, NEEDLE_COPY, NEEDLE_LENGTH, NEEDLE_SOURCES, RISK_TEXT, riskAt, tipDepth, type Build, type LayerId, type NeedleAngle } from "@/lib/diagrams/needle";
import type { Locale } from "@/lib/i18n";
import { Choice } from "./Choice";

/** Figure units to pixels: the slice is drawn 4 px per unit, starting below a strip of air. */
const SCALE = 4;
const TOP = 30;
const FILL: Record<LayerId | "lung", string> = {
  skin: "rgb(var(--bone))",
  fat: "rgb(var(--lumbar) / 0.45)",
  trapezius: "rgb(var(--bad) / 0.35)",
  "deep-muscle": "rgb(var(--bad) / 0.5)",
  ribs: "rgb(var(--bone))",
  pleura: "rgb(var(--parasymp) / 0.6)",
  lung: "rgb(var(--parasymp) / 0.15)"
};
const RISK_STYLE = { shallow: "bg-raised text-ink-2", target: "bg-good/15 text-good", close: "bg-warn/15 text-warn", danger: "bg-bad/10 text-bad" } as const;

export function NeedleDepth({ locale }: { locale: Locale }) {
  const c = NEEDLE_COPY;
  const [build, setBuild] = useState<Build>("slim");
  const [angle, setAngle] = useState<NeedleAngle>("straight");
  const [push, setPush] = useState(55);
  const depth = tipDepth(push / 100, angle);
  const where = layerAt(depth, build);
  const risk = riskAt(where);
  const info = RISK_TEXT[risk];
  const ls = layers(build);
  const bottom = TOP + (ls[ls.length - 1]!.bottom + 14) * SCALE;
  // The needle enters at x=110; angled, it travels sideways as it goes in.
  const entry = { x: 110, y: TOP };
  const len = (NEEDLE_LENGTH * push) / 100;
  const dx = angle === "angled" ? len * Math.cos(Math.PI / 6) : 0;
  const tip = { x: entry.x + dx * SCALE, y: TOP + depth * SCALE };
  const full = { x: entry.x + (angle === "angled" ? NEEDLE_LENGTH * Math.cos(Math.PI / 6) * SCALE : 0), y: TOP + NEEDLE_LENGTH * ANGLE_FACTOR[angle] * SCALE };
  const back = { x: entry.x - (full.x - entry.x) * 0.35, y: entry.y - (full.y - entry.y) * 0.35 };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <div className="min-w-0 space-y-3">
        <Choice label={c.build[locale]} value={build} onChange={setBuild} options={(["slim", "average", "larger"] as const).map((id) => ({ id, name: c.builds[id][locale] }))} />
        <Choice label={c.angle[locale]} value={angle} onChange={setAngle} options={(["straight", "angled"] as const).map((id) => ({ id, name: c.angles[id][locale] }))} />
        <label className="block text-sm font-medium">
          {c.depth[locale]}
          <input type="range" min={0} max={100} value={push} onChange={(e) => setPush(Number(e.target.value))} className="mt-1 block w-full accent-accent" />
        </label>
        <figure className="m-0 rounded-2xl border border-line bg-surface p-3">
          <svg viewBox={`0 0 320 ${bottom}`} className="block h-auto w-full" role="img" aria-label={`${c.figure[locale]}: ${LAYER_NAME[where][locale]}`}>
            {ls.map((l) => (
              <g key={l.id}>
                <rect x={0} y={TOP + l.top * SCALE} width={320} height={(l.bottom - l.top) * SCALE} fill={FILL[l.id]} />
                {l.bottom - l.top >= 4 && (
                  <text x={316} y={TOP + ((l.top + l.bottom) / 2) * SCALE + 3.5} textAnchor="end" fontSize={10} fill="rgb(var(--ink-2))">
                    {LAYER_NAME[l.id][locale]}
                  </text>
                )}
              </g>
            ))}
            {/* Ribs as bone ovals in their band */}
            {(() => {
              const r = ls.find((l) => l.id === "ribs")!;
              return [40, 150, 260].map((x) => <ellipse key={x} cx={x} cy={TOP + ((r.top + r.bottom) / 2) * SCALE} rx={34} ry={(r.bottom - r.top) * SCALE * 0.42} fill="rgb(var(--ink-3) / 0.35)" />);
            })()}
            <rect x={0} y={TOP + ls[ls.length - 1]!.bottom * SCALE} width={320} height={14 * SCALE} fill={FILL.lung} />
            <text x={316} y={TOP + (ls[ls.length - 1]!.bottom + 8) * SCALE} textAnchor="end" fontSize={10} fill="rgb(var(--ink-2))">
              {LAYER_NAME.lung[locale]}
            </text>
            {/* The needle: handle above the skin, shaft to the tip */}
            <line x1={back.x} y1={back.y} x2={entry.x} y2={entry.y} stroke="rgb(var(--ink-3))" strokeWidth={5} strokeLinecap="round" />
            <line x1={entry.x} y1={entry.y} x2={tip.x} y2={tip.y} stroke="rgb(var(--ink))" strokeWidth={1.8} />
            <circle cx={tip.x} cy={tip.y} r={4} fill={risk === "danger" ? "rgb(var(--bad))" : risk === "close" ? "rgb(var(--warn))" : "rgb(var(--ink))"} />
          </svg>
          <figcaption className="mt-2 px-1 text-xs text-ink-3">{c.schematic[locale]}</figcaption>
        </figure>
      </div>
      <article className="min-w-0 space-y-3 rounded-2xl border border-line bg-surface p-5" aria-live="polite">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">{c.tip[locale]}</p>
        <h4 className="text-lg font-semibold">{LAYER_NAME[where][locale]}</h4>
        <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${RISK_STYLE[risk]}`}>{info.name[locale]}</span>
        <p className="leading-relaxed text-ink-2">{info.text[locale]}</p>
        <SourceList ids={NEEDLE_SOURCES} locale={locale} />
      </article>
    </div>
  );
}
