"use client";

import { useState } from "react";
import { SourceList } from "@/components/ui/SourceList";
import { fill } from "@/lib/copy";
import {
  BONES,
  FOOT_BOX,
  FOOT_COPY,
  FOOT_OUTLINE,
  FOOT_SOURCES,
  GROUPS,
  NERVE_AREAS,
  NERVES,
  STRUCTURES,
  TOES,
  zoneById,
  ZONES,
  zonesFor,
  type FootSide,
  type GroupId,
  type Zone
} from "@/lib/diagrams/foot";
import type { Locale } from "@/lib/i18n";
import { Choice } from "./Choice";
import { HALO, ShapeEl } from "./shapes";
import { useMediaQuery } from "./useMediaQuery";

/**
 * Both soles, as the printed charts draw them: the left foot on the left with
 * its big toe toward the middle, the right foot mirrored. Three views share
 * one set of tappable zones, so a zone picked on the chart stays outlined
 * when you switch to the nerves or the bones underneath.
 *
 * The left foot is the right foot's geometry mirrored. Shapes are mirrored
 * with a transform; numbers and labels are placed at mirrored coordinates
 * instead, so the text doesn't read backwards.
 */
type View = "chart" | "nerves" | "bones";
type Feet = "both" | FootSide;

const W = FOOT_BOX.width;
const GAP = 24;
const cat = (slot: number, alpha = 1) => `rgb(var(--cat-${slot}) / ${alpha})`;
const flipX = (foot: FootSide, x: number) => (foot === "left" ? W - x : x);
const GROUP_ORDER: GroupId[] = ["head", "glands", "chest", "digestion", "urinary", "spine", "limbs"];

export function FootMap({ locale }: { locale: Locale }) {
  const c = FOOT_COPY;
  const narrow = useMediaQuery("(max-width: 639px)");
  const [view, setView] = useState<View>("chart");
  const [feetChoice, setFeetChoice] = useState<Feet | null>(null);
  const [id, setId] = useState("neck");
  const feet: Feet = feetChoice ?? (narrow ? "right" : "both");
  const zone = zoneById(id)!;
  const shown: FootSide[] = feet === "both" ? ["left", "right"] : [feet];
  const width = shown.length * W + (shown.length - 1) * GAP;

  const pick = (z: Zone) => {
    setId(z.id);
    // A zone only drawn on the other foot: bring that foot into view.
    if (feet !== "both" && z.feet !== "both" && z.feet !== feet) setFeetChoice(z.feet);
  };

  const footLayer = (foot: FootSide, ox: number) => {
    const mirror = foot === "left" ? `translate(${ox + W} 0) scale(-1 1)` : `translate(${ox} 0)`;
    const clip = `foot-clip-${foot}`;
    const zones = zonesFor(foot);
    return (
      <g key={foot}>
        <defs>
          <clipPath id={clip}>
            <path d={FOOT_OUTLINE} />
            {TOES.map((t, i) => (
              <ShapeEl key={i} shape={t} />
            ))}
          </clipPath>
        </defs>
        <g transform={mirror}>
          {TOES.map((t, i) => (
            <ShapeEl key={i} shape={t} fill="rgb(var(--bone))" stroke="rgb(var(--ink-3))" strokeWidth={1} />
          ))}
          <path d={FOOT_OUTLINE} fill="rgb(var(--bone))" stroke="rgb(var(--ink-3))" strokeWidth={1} />

          {view === "chart" &&
            zones.map((z) =>
              z.shapes.map((s, i) => (
                <ShapeEl
                  key={`${z.id}-${i}`}
                  shape={s}
                  clipPath={s.kind === "rect" ? `url(#${clip})` : undefined}
                  fill={s.kind === "path" && s.stroke ? "none" : cat(GROUPS[z.group].slot, z.id === id ? 0.95 : 0.5)}
                  stroke={s.kind === "path" && s.stroke ? cat(GROUPS[z.group].slot, 0.9) : "rgb(var(--surface) / 0.8)"}
                  strokeWidth={s.kind === "path" && s.stroke ? 4 : 0.8}
                  strokeLinecap="round"
                />
              ))
            )}

          {view === "nerves" && (
            <g clipPath={`url(#${clip})`}>
              {NERVE_AREAS.map((a) =>
                a.shapes.map((s, i) => <ShapeEl key={`${a.nerve}-${i}`} shape={s} fill={cat(NERVES[a.nerve].slot, 0.5)} stroke="none" />)
              )}
              <line x1={128} y1={40} x2={128} y2={300} stroke="rgb(var(--ink-2))" strokeDasharray="3 3" />
            </g>
          )}

          {view === "bones" && (
            <g>
              <path d={FOOT_OUTLINE} fill="rgb(var(--lumbar) / 0.2)" stroke="none" />
              {BONES.map((b) =>
                b.shapes.map((s, i) => <ShapeEl key={`${b.label.en}-${i}`} shape={s} fill="rgb(var(--surface))" stroke="rgb(var(--ink-3))" strokeWidth={1} />)
              )}
            </g>
          )}

          {/* Hit areas and the picked zone's outline, in every view */}
          {zones.map((z) => (
            <g key={`hit-${z.id}`} onClick={() => pick(z)} className="cursor-pointer">
              <title>{`${z.n}. ${z.name[locale]}`}</title>
              {z.shapes.map((s, i) => (
                <ShapeEl
                  key={i}
                  shape={s}
                  clipPath={s.kind === "rect" ? `url(#${clip})` : undefined}
                  fill={s.kind === "path" && s.stroke ? "none" : "transparent"}
                  stroke={z.id === id ? "rgb(var(--ink))" : s.kind === "path" && s.stroke ? "transparent" : "none"}
                  strokeWidth={s.kind === "path" && s.stroke ? (z.id === id ? 6 : 10) : 1.8}
                  strokeOpacity={s.kind === "path" && s.stroke && z.id === id ? 0.35 : 1}
                  strokeDasharray={z.id === id && view !== "chart" ? "3 2" : undefined}
                />
              ))}
            </g>
          ))}
        </g>

        {/* Text, placed rather than mirrored */}
        {view === "chart" &&
          zones.map((z) => {
            const x = ox + flipX(foot, z.at[0]);
            const on = z.id === id;
            return (
              <g key={`n-${z.id}`} onClick={() => pick(z)} className="cursor-pointer">
                <circle cx={x} cy={z.at[1]} r={6} fill={on ? "rgb(var(--ink))" : "rgb(var(--surface) / 0.92)"} stroke="rgb(var(--ink-3))" strokeWidth={0.6} />
                <text x={x} y={z.at[1] + 2.3} textAnchor="middle" fontSize={6.5} fontWeight={700} fill={on ? "rgb(var(--surface))" : "rgb(var(--ink))"}>
                  {z.n}
                </text>
              </g>
            );
          })}
        {view === "nerves" &&
          (
            [
              ["medial-plantar", 74, 170],
              ["lateral-plantar", 148, 120],
              ["calcaneal", 104, 356]
            ] as const
          ).map(([n, x, y]) => (
            <text key={n} x={ox + flipX(foot, x)} y={y} textAnchor="middle" fontSize={8} fontWeight={600} {...HALO}>
              {NERVES[n].short[locale]}
            </text>
          ))}
        {view === "bones" &&
          BONES.map((b) => (
            <text key={b.label.en} x={ox + flipX(foot, b.at[0])} y={b.at[1]} textAnchor="middle" fontSize={7.5} fontWeight={600} {...HALO}>
              {b.label[locale]}
            </text>
          ))}
        <text x={ox + W / 2} y={FOOT_BOX.height + 14} textAnchor="middle" fontSize={9} letterSpacing="0.1em" fill="rgb(var(--ink-3))">
          {foot === "left" ? c.left[locale] : c.right[locale]}
        </text>
      </g>
    );
  };

  const caption = view === "chart" ? c.chartCaveat : view === "nerves" ? c.nervesCaption : c.bonesCaption;
  const organ = zone.name[locale].toLowerCase();

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start">
      <div className="min-w-0 space-y-3">
        <Choice label={c.view[locale]} value={view} onChange={setView} options={(["chart", "nerves", "bones"] as const).map((v) => ({ id: v, name: c.views[v][locale] }))} />
        <Choice label={c.feet[locale]} value={feet} onChange={setFeetChoice} options={(["both", "left", "right"] as const).map((f) => ({ id: f, name: c.feetOptions[f][locale] }))} />
        <figure className="m-0 rounded-2xl border border-line bg-surface p-3">
          <svg viewBox={`0 0 ${width} ${FOOT_BOX.height + 20}`} className="mx-auto block h-auto w-full" style={{ maxWidth: shown.length === 1 ? 320 : 560 }} role="img" aria-label={`${c.figure[locale]}: ${zone.n}. ${zone.name[locale]}`}>
            {shown.map((foot, i) => footLayer(foot, i * (W + GAP)))}
          </svg>
          <figcaption className="mt-2 px-1 text-xs text-ink-3">{caption[locale]}</figcaption>
          {view === "nerves" && (
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 px-1 text-xs text-ink-2">
              {(Object.keys(NERVES) as (keyof typeof NERVES)[]).map((n) => (
                <li key={n} className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: cat(NERVES[n].slot, 0.6) }} aria-hidden="true" />
                  {NERVES[n].short[locale]} <span className="tnum text-ink-3">{NERVES[n].roots}</span>
                </li>
              ))}
            </ul>
          )}
        </figure>
      </div>

      <div className="min-w-0 space-y-4">
        <article className="space-y-3 rounded-2xl border border-line bg-surface p-5" aria-live="polite">
          <div className="flex items-start gap-3">
            <span className="tnum flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: cat(GROUPS[zone.group].slot) }}>
              {zone.n}
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">{c.chartSays[locale]}</p>
              <h4 className="text-lg font-semibold">{zone.name[locale]}</h4>
              <p className="text-xs text-ink-3">
                {GROUPS[zone.group].name[locale]} · {zone.feet === "both" ? c.bothFeet[locale] : zone.feet === "left" ? c.leftOnly[locale] : c.rightOnly[locale]}
              </p>
            </div>
          </div>
          <div className="rounded-xl bg-raised p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">{c.under[locale]}</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm">
              {zone.under.map((u) => (
                <li key={u}>{STRUCTURES[u][locale]}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-raised p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">{c.nerve[locale]}</p>
            <ul className="mt-1 space-y-1 text-sm">
              {zone.nerves.map((n) => (
                <li key={n}>
                  <span className="font-semibold">{NERVES[n].name[locale]}</span>
                  <span className="text-ink-2">, {fill(c.enters[locale], { roots: NERVES[n].roots.replace("-", "‑") })}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="font-medium leading-relaxed">
            {zone.id === "neck" ? c.neckNote[locale] : zone.id === "sciatic" ? c.sciaticNote[locale] : fill(c.noPath[locale], { organ })}
          </p>
          <p className="text-sm text-ink-3">{c.evidence[locale]}</p>
          <SourceList ids={FOOT_SOURCES} locale={locale} />
        </article>

        <section aria-label={c.key[locale]} className="rounded-2xl border border-line bg-surface p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-3">{c.key[locale]}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {GROUP_ORDER.map((g) => (
              <div key={g}>
                <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: cat(GROUPS[g].slot) }} aria-hidden="true" />
                  {GROUPS[g].name[locale]}
                </p>
                <ul className="space-y-0.5">
                  {ZONES.filter((z) => z.group === g).map((z) => (
                    <li key={z.id}>
                      <button
                        type="button"
                        aria-pressed={z.id === id}
                        onClick={() => pick(z)}
                        className={`flex w-full items-baseline gap-2 rounded-md px-1.5 py-0.5 text-left text-sm ${z.id === id ? "bg-ink text-bg" : "hover:bg-raised"}`}
                      >
                        <span className="tnum w-5 shrink-0 text-right text-xs font-bold">{z.n}</span>
                        <span>
                          {z.name[locale]}
                          {z.feet !== "both" && <span className="ml-1.5 whitespace-nowrap text-xs opacity-70">({z.feet === "left" ? c.feetOptions.left[locale] : c.feetOptions.right[locale]})</span>}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
