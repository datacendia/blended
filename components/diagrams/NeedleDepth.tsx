"use client";

import { useState } from "react";
import { SourceList } from "@/components/ui/SourceList";
import {
  ANGLE_FACTOR,
  boneDepth,
  LAYER_NAME,
  layerAt,
  layers,
  NEEDLE_COPY,
  NEEDLE_LENGTH,
  NEEDLE_SOURCES,
  RISK_TEXT,
  riskAt,
  siteById,
  SITES,
  tipDepth,
  type Build,
  type LayerId,
  type NeedleAngle,
  type SiteId
} from "@/lib/diagrams/needle";
import type { Locale } from "@/lib/i18n";
import { Choice } from "./Choice";
import { HALO } from "./shapes";

/** Figure units to pixels: the slice is drawn 4 px per unit, starting below a strip of air. */
const SCALE = 4;
const TOP = 30;
const FILL: Record<LayerId | "lung", string> = {
  skin: "rgb(var(--muscle) / 0.12)",
  fat: "rgb(var(--lumbar) / 0.45)",
  trapezius: "rgb(var(--muscle) / 0.38)",
  rhomboid: "rgb(var(--muscle) / 0.5)",
  erector: "rgb(var(--muscle) / 0.6)",
  "deep-shoulder": "rgb(var(--muscle) / 0.55)",
  infraspinatus: "rgb(var(--muscle) / 0.48)",
  multifidus: "rgb(var(--muscle) / 0.6)",
  subscapularis: "rgb(var(--muscle) / 0.42)",
  scapula: "rgb(var(--bone))",
  lamina: "rgb(var(--bone))",
  ribs: "rgb(var(--muscle) / 0.25)",
  pleura: "rgb(var(--parasymp) / 0.6)",
  lung: "rgb(var(--parasymp) / 0.15)"
};
const RISK_STYLE = { shallow: "bg-raised text-ink-2", target: "bg-good/15 text-good", bone: "bg-ink/10 text-ink", close: "bg-warn/15 text-warn", danger: "bg-bad/10 text-bad" } as const;

/* The back of the upper body, for the map. Levels: C7 at y=48, then 12 px per thoracic vertebra. */
const TORSO = "M134 0C134 22 130 34 120 40C100 48 72 50 56 58C44 64 40 78 40 94L44 230H256L260 94C260 78 256 64 244 58C228 50 200 48 180 40C170 34 166 22 166 0Z";
const LUNG = "M164 40C170 30 182 30 192 38C214 52 236 74 242 110C246 136 240 156 230 168C210 166 186 166 164 166C162 120 162 80 164 40Z";
const BLADE = "M186 58C200 59 214 60 226 62L240 80C228 100 216 118 204 136C192 116 184 98 186 58Z";
const BLADE_RIDGE = "M188 80C206 74 224 68 242 60L244 65C226 72 208 79 190 86Z";
const LEVEL = (k: number) => 56 + (k - 1) * 12;
const MIRROR = "translate(300 0) scale(-1 1)";

export function NeedleDepth({ locale }: { locale: Locale }) {
  const c = NEEDLE_COPY;
  const [siteId, setSiteId] = useState<SiteId>("beside-spine");
  const [build, setBuild] = useState<Build>("slim");
  const [angle, setAngle] = useState<NeedleAngle>("straight");
  const [push, setPush] = useState(55);
  const site = siteById(siteId);
  const stop = boneDepth(build, siteId);
  const depth = tipDepth(push / 100, angle, stop);
  const where = layerAt(depth, build, siteId);
  const risk = riskAt(where);
  const info = RISK_TEXT[risk];
  const ls = layers(build, siteId);
  const last = ls[ls.length - 1]!;
  const bottom = TOP + (last.bottom + 14) * SCALE;
  // The needle enters at x=110; angled, it travels sideways as it goes in.
  const entry = { x: 110, y: TOP };
  const travelled = depth / ANGLE_FACTOR[angle];
  const dx = angle === "angled" ? travelled * Math.cos(Math.PI / 6) : 0;
  const tip = { x: entry.x + dx * SCALE, y: TOP + depth * SCALE };
  const full = { x: entry.x + (angle === "angled" ? NEEDLE_LENGTH * Math.cos(Math.PI / 6) * SCALE : 0), y: TOP + NEEDLE_LENGTH * ANGLE_FACTOR[angle] * SCALE };
  const back = { x: entry.x - (full.x - entry.x) * 0.35, y: entry.y - (full.y - entry.y) * 0.35 };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <div className="min-w-0 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">{c.sites[locale]}</p>
        <figure className="m-0 rounded-2xl border border-line bg-surface p-3">
          <svg viewBox="34 0 232 200" className="mx-auto block h-auto w-full max-w-[440px]" role="img" aria-label={`${c.map[locale]}: ${site.n}. ${site.name[locale]}`}>
            <path d={TORSO} fill="rgb(var(--ink-3) / 0.14)" />
            {[0, 1].map((side) => (
              <g key={side} transform={side ? MIRROR : undefined}>
                <path d={LUNG} fill="rgb(var(--parasymp) / 0.14)" stroke="rgb(var(--parasymp))" strokeWidth={1} strokeDasharray="4 3" />
                <g fill="none" stroke="rgb(var(--ink-3) / 0.35)" strokeWidth={1}>
                  {Array.from({ length: 10 }, (_, i) => {
                    const y = LEVEL(i + 1);
                    return <path key={i} d={`M156 ${y}C176 ${y - 6} 214 ${y - 2} 240 ${y + 16}`} />;
                  })}
                </g>
                <path d={BLADE} fill="rgb(var(--bone) / 0.9)" stroke="rgb(var(--ink-3))" strokeWidth={0.8} />
                <path d={BLADE_RIDGE} fill="rgb(var(--bone))" stroke="rgb(var(--ink-3))" strokeWidth={0.8} />
              </g>
            ))}
            {/* The spine, with a few levels named */}
            {Array.from({ length: 13 }, (_, i) => {
              const y = i === 0 ? 48 : LEVEL(i);
              const label = i === 0 ? "C7" : [3, 7, 12].includes(i) ? `T${i}` : null;
              return (
                <g key={i}>
                  <rect x={147} y={y - 3} width={6} height={6} rx={1.5} fill="rgb(var(--bone))" stroke="rgb(var(--ink-3))" strokeWidth={0.6} />
                  {label && (
                    <text x={143} y={y + 2.4} textAnchor="end" fontSize={6.5} {...HALO}>
                      {label}
                    </text>
                  )}
                </g>
              );
            })}
            <g fontSize={7} fontStyle="italic" textAnchor="middle" {...HALO} fill="rgb(var(--ink-3))" pointerEvents="none">
              <text x={92} y={150}>{c.lungField[locale]}</text>
              <text x={92} y={104}>{c.blade[locale]}</text>
            </g>

            {/* Each site's twin on the other side */}
            {SITES.map((s) => (
              <circle key={`twin-${s.id}`} cx={300 - s.at[0]} cy={s.at[1]} r={2.4} fill="rgb(var(--ink-3))" />
            ))}
            {SITES.map((s) => {
              const on = s.id === siteId;
              return (
                <g key={s.id} onClick={() => setSiteId(s.id)} className="cursor-pointer">
                  <title>{`${s.n}. ${s.name[locale]}${s.acupoint ? ` (${s.acupoint.code})` : ""}`}</title>
                  {on && <circle cx={s.at[0]} cy={s.at[1]} r={11} fill="none" stroke="rgb(var(--accent))" strokeWidth={2} />}
                  <circle cx={s.at[0]} cy={s.at[1]} r={7} fill={on ? "rgb(var(--ink))" : "rgb(var(--surface))"} stroke="rgb(var(--ink-2))" strokeWidth={0.8} />
                  <text x={s.at[0]} y={s.at[1] + 2.5} textAnchor="middle" fontSize={7.5} fontWeight={700} fill={on ? "rgb(var(--surface))" : "rgb(var(--ink))"}>
                    {s.n}
                  </text>
                </g>
              );
            })}
          </svg>
          <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1 px-1 text-xs text-ink-2">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-4 rounded-sm border border-dashed border-parasymp bg-parasymp/15" aria-hidden="true" />
              {c.lungField[locale]}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-4 rounded-sm border border-ink-3 bg-bone" aria-hidden="true" />
              {c.blade[locale]}
            </span>
            <span className="text-ink-3">{c.bothSides[locale]}</span>
          </figcaption>
        </figure>
        <ul className="space-y-1" aria-label={c.sites[locale]}>
          {SITES.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                aria-pressed={s.id === siteId}
                onClick={() => setSiteId(s.id)}
                className={`flex w-full items-baseline gap-2 rounded-lg px-2 py-1 text-left text-sm ${s.id === siteId ? "bg-ink text-bg" : "hover:bg-raised"}`}
              >
                <span className="tnum w-4 shrink-0 text-right text-xs font-bold">{s.n}</span>
                <span className="min-w-0 flex-1">{s.name[locale]}</span>
                <span className="tnum shrink-0 text-xs opacity-70">{s.acupoint?.code ?? "—"}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="min-w-0 space-y-4">
        <article className="space-y-3 rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-start gap-3">
            <span className="tnum flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-bg">{site.n}</span>
            <div className="min-w-0">
              <h4 className="text-lg font-semibold">{site.name[locale]}</h4>
              <p className="text-xs text-ink-3">
                {site.acupoint ? `${c.acupoint[locale]}: ${site.acupoint.code} · ${site.acupoint.name}` : c.noAcupoint[locale]} · {c.dryNeedling[locale]}: {site.dryNeedling[locale]}
              </p>
            </div>
          </div>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="rounded-xl bg-raised p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-3">{c.where[locale]}</dt>
              <dd className="mt-0.5">{site.where[locale]}</dd>
            </div>
            <div className="rounded-xl bg-raised p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-3">{c.under[locale]}</dt>
              <dd className="mt-0.5">{site.under[locale]}</dd>
            </div>
          </dl>

          <Choice label={c.build[locale]} value={build} onChange={setBuild} options={(["slim", "average", "larger"] as const).map((id) => ({ id, name: c.builds[id][locale] }))} />
          <Choice label={c.angle[locale]} value={angle} onChange={setAngle} options={(["straight", "angled"] as const).map((id) => ({ id, name: c.angles[id][locale] }))} />
          <label className="block text-sm font-medium">
            {c.depth[locale]}
            <input type="range" min={0} max={100} value={push} onChange={(e) => setPush(Number(e.target.value))} className="mt-1 block w-full accent-accent" />
          </label>

          <figure className="m-0 overflow-hidden rounded-xl border border-line">
            <svg viewBox={`0 0 320 ${bottom}`} className="block h-auto w-full" role="img" aria-label={`${c.figure[locale]}: ${LAYER_NAME[where][locale]}`}>
              {ls.map((l) => (
                <rect key={l.id} x={0} y={TOP + l.top * SCALE} width={320} height={(l.bottom - l.top) * SCALE} fill={FILL[l.id]} stroke={l.id === "scapula" || l.id === "lamina" ? "rgb(var(--ink-3))" : "none"} strokeWidth={0.8} />
              ))}
              {/* Ribs as bone ovals in their band, with the gaps between them */}
              {ls
                .filter((l) => l.id === "ribs")
                .map((r) => [40, 150, 260].map((x) => <ellipse key={x} cx={x} cy={TOP + ((r.top + r.bottom) / 2) * SCALE} rx={34} ry={(r.bottom - r.top) * SCALE * 0.42} fill="rgb(var(--bone))" stroke="rgb(var(--ink-3) / 0.6)" strokeWidth={0.6} />))}
              {ls
                .filter((l) => l.bottom - l.top >= 4)
                .map((l) => (
                  <text key={l.id} x={316} y={TOP + ((l.top + l.bottom) / 2) * SCALE + 3.5} textAnchor="end" fontSize={10} {...HALO} fill="rgb(var(--ink-2))">
                    {LAYER_NAME[l.id][locale]}
                  </text>
                ))}
              {site.lungBeneath ? (
                <>
                  <rect x={0} y={TOP + last.bottom * SCALE} width={320} height={14 * SCALE} fill={FILL.lung} />
                  <text x={316} y={TOP + (last.bottom + 8) * SCALE} textAnchor="end" fontSize={10} {...HALO} fill="rgb(var(--ink-2))">
                    {LAYER_NAME.lung[locale]}
                  </text>
                </>
              ) : (
                <rect x={0} y={TOP + last.bottom * SCALE} width={320} height={14 * SCALE} fill={FILL.lamina} />
              )}
              {/* The needle: handle above the skin, shaft to the tip */}
              <line x1={back.x} y1={back.y} x2={entry.x} y2={entry.y} stroke="rgb(var(--ink-3))" strokeWidth={5} strokeLinecap="round" />
              <line x1={entry.x} y1={entry.y} x2={tip.x} y2={tip.y} stroke="rgb(var(--ink))" strokeWidth={1.8} />
              <circle cx={tip.x} cy={tip.y} r={4} fill={risk === "danger" ? "rgb(var(--bad))" : risk === "close" ? "rgb(var(--warn))" : "rgb(var(--ink))"} />
            </svg>
            <figcaption className="border-t border-line px-3 py-2 text-xs text-ink-3">{c.schematic[locale]}</figcaption>
          </figure>

          <div aria-live="polite" className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">{c.tip[locale]}</p>
            <p className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-semibold">{LAYER_NAME[where][locale]}</span>
              <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${RISK_STYLE[risk]}`}>{info.name[locale]}</span>
            </p>
            <p className="leading-relaxed text-ink-2">{info.text[locale]}</p>
          </div>
          <SourceList ids={NEEDLE_SOURCES} locale={locale} />
        </article>
      </div>
    </div>
  );
}
