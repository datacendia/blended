"use client";

import Link from "next/link";
import { useState } from "react";
import { TerritoryFigure } from "@/components/map/TerritoryFigure";
import { SourceList } from "@/components/ui/SourceList";
import {
  CONTEXT,
  FIGURES,
  lookalikeRoots,
  MUSCLE_GROUPS,
  MUSCLE_MAP_SOURCES,
  MUSCLES,
  muscleById,
  NECK_BOX,
  NECK_MUSCLE_COPY,
  NECK_MUSCLE_SOURCES,
  PAINT_ORDER,
  PRESSURE,
  SPINE_MARKS,
  type Muscle,
  type MuscleGroup,
  type NeckView,
  type Pressure
} from "@/lib/diagrams/neckMuscles";
import type { Locale } from "@/lib/i18n";
import { href } from "@/lib/nav";
import { Choice } from "./Choice";
import { HALO } from "./shapes";

type Mode = "muscles" | "pressure";

const PRESSURE_FILL: Record<Pressure, string> = {
  firm: "rgb(var(--good) / 0.45)",
  gentle: "rgb(var(--warn) / 0.6)",
  avoid: "rgb(var(--bad) / 0.6)"
};
const PRESSURE_BADGE: Record<Pressure, string> = { firm: "bg-good/15 text-good", gentle: "bg-warn/15 text-warn", avoid: "bg-bad/10 text-bad" };
const PRESSURE_BORDER: Record<Pressure, string> = { firm: "border-good bg-good/5", gentle: "border-warn bg-warn/5", avoid: "border-bad bg-bad/5" };
const GROUP_ORDER: MuscleGroup[] = ["back", "neck", "chest"];
const DANGER = "rgb(var(--bad))";

export function NeckMuscles({ locale }: { locale: Locale }) {
  const c = NECK_MUSCLE_COPY;
  const [view, setView] = useState<NeckView>("back");
  const [mode, setMode] = useState<Mode>("muscles");
  const [id, setId] = useState("upper-trapezius");
  const m = muscleById(id)!;
  const fig = FIGURES[view];
  const shown = PAINT_ORDER.map((x) => muscleById(x)!).filter((x) => x.views[view]);
  const painted = [...shown.filter((x) => x.id !== id), ...shown.filter((x) => x.id === id)];
  const roots = lookalikeRoots(m);
  const angles = [...new Set(shown.flatMap((x) => x.views[view]!.fibres ?? []))];

  const pick = (x: Muscle) => {
    setId(x.id);
    // A muscle not drawn in this view: turn the figure to one that shows it.
    if (!x.views[view]) setView((["back", "side", "front"] as const).find((v) => x.views[v])!);
  };

  const fillFor = (x: Muscle) => {
    const on = x.id === id;
    if (x.views[view]?.hidden) return on ? "rgb(var(--accent) / 0.25)" : "transparent";
    // The platysma is a film over the others: in the pressure guide it must not hide them.
    if (mode === "pressure" && x.id === "platysma") return on ? "rgb(var(--warn) / 0.5)" : "rgb(var(--warn) / 0.15)";
    if (mode === "pressure") return on ? PRESSURE_FILL[x.pressure].replace(/\/ [\d.]+\)/, "/ 0.95)") : PRESSURE_FILL[x.pressure];
    if (on) return "rgb(var(--accent) / 0.9)";
    if (x.id === "platysma") return "url(#platysma-hatch)";
    return "rgb(var(--muscle) / 0.42)";
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
      <div className="min-w-0 space-y-3">
        <Choice label={c.view[locale]} value={view} onChange={setView} options={(["back", "side", "front"] as const).map((v) => ({ id: v, name: c.views[v][locale] }))} />
        <Choice label={c.mode[locale]} value={mode} onChange={setMode} options={(["muscles", "pressure"] as const).map((v) => ({ id: v, name: c.modes[v][locale] }))} />
        <figure className="m-0 rounded-2xl border border-line bg-surface p-3">
          <svg
            viewBox={`0 0 ${NECK_BOX.width} ${NECK_BOX.height + 26}`}
            className="mx-auto block h-auto w-full max-w-[460px]"
            role="img"
            aria-label={`${c.figure[locale]}, ${c.views[view][locale]}: ${m.n}. ${m.name[locale]}`}
          >
            <defs>
              {/* Fibre lines in ink at low opacity read on any fill, in both schemes */}
              {angles.map((a) => (
                <pattern key={a} id={`fib-${a}`} width="3.2" height="3.2" patternUnits="userSpaceOnUse" patternTransform={`rotate(${a})`}>
                  <line x1="0.5" y1="0" x2="0.5" y2="3.2" stroke="rgb(var(--ink) / 0.2)" strokeWidth="0.55" />
                </pattern>
              ))}
              <pattern id="platysma-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(70)">
                <rect width="5" height="5" fill="rgb(var(--muscle) / 0.1)" />
                <rect width="1.2" height="5" fill="rgb(var(--muscle) / 0.55)" />
              </pattern>
            </defs>

            <g fill="rgb(var(--ink-3) / 0.15)">
              {fig.body.map((d, i) => (
                <path key={i} d={d} />
              ))}
              <path d={fig.head} />
            </g>
            {view !== "side" && fig.bones.map((d, i) => <path key={i} d={d} fill="rgb(var(--bone) / 0.7)" stroke="rgb(var(--ink-3) / 0.6)" strokeWidth={0.8} />)}

            {CONTEXT[view].map((x, i) => (
              <path key={i} d={x.d} fill="rgb(var(--muscle) / 0.16)" stroke="rgb(var(--surface) / 0.9)" strokeWidth={0.8}>
                <title>{x.name[locale]}</title>
              </path>
            ))}

            {painted.map((x) => {
              const v = x.views[view]!;
              const on = x.id === id;
              return (
                <g key={x.id} onClick={() => pick(x)} className="cursor-pointer">
                  <title>{`${x.n}. ${x.name[locale]}`}</title>
                  {v.d.map((d, i) => (
                    <g key={i}>
                      <path
                        d={d}
                        fill={fillFor(x)}
                        stroke={on ? "rgb(var(--ink))" : v.hidden ? "rgb(var(--ink-2))" : "rgb(var(--surface) / 0.9)"}
                        strokeWidth={on ? 1.5 : v.hidden ? 1 : 0.8}
                        strokeDasharray={v.hidden ? "3 2" : undefined}
                      />
                      {v.fibres?.[i] !== undefined && <path d={d} fill={`url(#fib-${v.fibres[i]})`} pointerEvents="none" />}
                    </g>
                  ))}
                </g>
              );
            })}

            {/* Bone landmarks drawn over the muscles, so levels can be read */}
            {view === "side" && fig.bones.map((d, i) => <path key={i} d={d} fill="rgb(var(--bone))" stroke="rgb(var(--ink-3))" strokeWidth={0.8} />)}
            {view === "front" && fig.bones.map((d, i) => <path key={i} d={d} fill="rgb(var(--bone))" stroke="rgb(var(--ink-3))" strokeWidth={0.8} pointerEvents="none" />)}
            <g fill="none" stroke="rgb(var(--ink-3) / 0.7)" strokeWidth={0.8} pointerEvents="none">
              {fig.under?.map((d, i) => (
                <path key={i} d={d} strokeDasharray="2 2" />
              ))}
              {fig.lines.map((d, i) => (
                <path key={i} d={d} />
              ))}
            </g>
            {view === "back" &&
              SPINE_MARKS.map((s) => (
                <g key={s.label} pointerEvents="none">
                  <circle cx={150} cy={s.y} r={1.8} fill="rgb(var(--ink-2))" />
                  <text x={146} y={s.y + 2.4} textAnchor="end" fontSize={6.5} {...HALO}>
                    {s.label}
                  </text>
                </g>
              ))}

            <g pointerEvents="none">
              {CONTEXT[view].map((x, i) => (
                <text key={i} x={x.at[0]} y={x.at[1]} textAnchor="middle" fontSize={6.5} fontStyle="italic" {...HALO} fill="rgb(var(--ink-3))">
                  {x.name[locale]}
                </text>
              ))}
            </g>

            {view === "side" && (
              <g pointerEvents="none">
                <path d="M186 194C182 170 176 148 172 132C170 126 168 120 164 114M172 132C176 126 180 120 184 116" fill="none" stroke={DANGER} strokeWidth={2} strokeDasharray="4 2" />
                <path d="M153 136C153 160 152 178 150 194C146 204 140 212 134 220" fill="none" stroke="rgb(var(--nerve))" strokeWidth={3} strokeLinecap="round" />
                <path d="M212 150L179 152" stroke="rgb(var(--ink-3))" strokeWidth={0.6} />
                <text x={214} y={152} fontSize={8} {...HALO} fill={DANGER}>
                  {c.carotid[locale]}
                </text>
                <path d="M135 220L148 262" stroke="rgb(var(--ink-3))" strokeWidth={0.6} />
                <text x={150} y={272} fontSize={8} textAnchor="middle" {...HALO}>
                  {c.plexus[locale]}
                </text>
              </g>
            )}
            {view === "front" && (
              <g pointerEvents="none">
                <path d="M140 186C136 160 132 138 130 122M160 186C164 160 168 138 170 122" fill="none" stroke={DANGER} strokeWidth={2} strokeDasharray="4 2" />
                <g fill="none" stroke={DANGER} strokeWidth={1} strokeDasharray="2 1.5">
                  <ellipse cx={143} cy={166} rx={6} ry={10} />
                  <ellipse cx={157} cy={166} rx={6} ry={10} />
                </g>
                <path d="M186 136C188 160 194 180 206 194C216 206 226 218 238 230" fill="none" stroke="rgb(var(--nerve))" strokeWidth={3} strokeLinecap="round" />
                <path d="M228 110L170 128M228 148L187 150M72 128L137 162" stroke="rgb(var(--ink-3))" strokeWidth={0.6} />
                <text x={296} y={112} fontSize={8} textAnchor="end" {...HALO} fill={DANGER}>
                  {c.carotid[locale]}
                </text>
                <text x={296} y={150} fontSize={8} textAnchor="end" {...HALO}>
                  {c.plexus[locale]}
                </text>
                <text x={4} y={126} fontSize={8} {...HALO} fill={DANGER}>
                  {c.windpipe[locale]}
                </text>
              </g>
            )}

            {shown.map((x) => {
              const [ax, ay] = x.views[view]!.at;
              const on = x.id === id;
              return (
                <g key={`n-${x.id}`} onClick={() => pick(x)} className="cursor-pointer">
                  <circle cx={ax} cy={ay} r={6.5} fill={on ? "rgb(var(--ink))" : "rgb(var(--surface) / 0.94)"} stroke="rgb(var(--ink-3))" strokeWidth={0.6} />
                  <text x={ax} y={ay + 2.4} textAnchor="middle" fontSize={7} fontWeight={700} fill={on ? "rgb(var(--surface))" : "rgb(var(--ink))"}>
                    {x.n}
                  </text>
                </g>
              );
            })}

            {view === "back" && (
              <g fontSize={8} letterSpacing="0.08em" fill="rgb(var(--ink-3))" textAnchor="middle">
                <text x={78} y={NECK_BOX.height + 23}>{c.surface[locale].toUpperCase()}</text>
                <text x={222} y={NECK_BOX.height + 23}>{c.deeper[locale].toUpperCase()}</text>
              </g>
            )}
          </svg>
          <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1 px-1 text-xs text-ink-2">
            {mode === "pressure" &&
              (["firm", "gentle", "avoid"] as const).map((p) => (
                <span key={p} className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: PRESSURE_FILL[p] }} aria-hidden="true" />
                  <span aria-hidden="true">{PRESSURE[p].icon}</span> {PRESSURE[p].name[locale]}
                </span>
              ))}
            {view !== "back" && (
              <>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-0 w-4 border-t-2 border-dashed border-bad" aria-hidden="true" />
                  {c.carotid[locale]}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-1 w-4 rounded-full bg-nerve" aria-hidden="true" />
                  {c.plexus[locale]}
                </span>
              </>
            )}
            {view === "front" && <span>{c.hidden[locale]}</span>}
          </figcaption>
        </figure>
      </div>

      <div className="min-w-0 space-y-4">
        <article className="space-y-3 rounded-2xl border border-line bg-surface p-5" aria-live="polite">
          <div className="flex items-start gap-3">
            <span className="tnum flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-bg">{m.n}</span>
            <div className="min-w-0">
              <h4 className="text-lg font-semibold">{m.name[locale]}</h4>
              <p className="text-xs text-ink-3">{MUSCLE_GROUPS[m.group][locale]}</p>
            </div>
            <span className={`ml-auto shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${PRESSURE_BADGE[m.pressure]}`}>
              <span aria-hidden="true">{PRESSURE[m.pressure].icon}</span> {PRESSURE[m.pressure].name[locale]}
            </span>
          </div>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <Fact label={c.attaches[locale]} value={m.attaches[locale]} />
            <Fact label={c.does[locale]} value={m.does[locale]} />
            <Fact label={c.nerve[locale]} value={m.nerve[locale]} wide />
          </dl>
          <div className={`rounded-xl border-l-4 p-3 text-sm ${PRESSURE_BORDER[m.pressure]}`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">{c.massage[locale]}</p>
            <p className="mt-0.5">{m.massage[locale]}</p>
          </div>

          <section className="space-y-2 border-t border-line pt-3">
            <h5 className="text-xs font-semibold uppercase tracking-wide text-ink-3">{c.felt[locale]}</h5>
            {m.felt ? (
              <>
                <p className="text-sm">{m.felt[locale]}</p>
                <TerritoryFigure
                  key={m.id}
                  weights={Object.fromEntries(m.refers.map((r) => [r, 1]))}
                  legend={{ full: c.figureLegend }}
                  locale={locale}
                  idPrefix="neck-refer"
                  solid
                />
                {roots.length > 0 && (
                  <div className="rounded-xl bg-raised p-3 text-sm">
                    <p>{c.lookalike[locale]}</p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {roots.map((r) => (
                        <li key={r}>
                          <Link href={`${href(locale, "spine")}#root-${r}`} className="tnum inline-block rounded-full border border-line bg-surface px-2.5 py-0.5 font-semibold text-accent hover:border-accent">
                            {r}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 text-ink-2">{c.exam[locale]}</p>
                  </div>
                )}
                <p className="text-xs text-ink-3">{c.mapCaveat[locale]}</p>
                <SourceList ids={MUSCLE_MAP_SOURCES} locale={locale} />
              </>
            ) : (
              <p className="text-sm text-ink-3">{c.noMap[locale]}</p>
            )}
          </section>

          <p className="border-t border-line pt-3 text-sm text-ink-3">{c.evidence[locale]}</p>
          <SourceList ids={NECK_MUSCLE_SOURCES} locale={locale} />
        </article>

        <section aria-label={c.key[locale]} className="rounded-2xl border border-line bg-surface p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-3">{c.key[locale]}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {GROUP_ORDER.map((g) => (
              <div key={g}>
                <p className="mb-1 text-xs font-semibold">{MUSCLE_GROUPS[g][locale]}</p>
                <ul className="space-y-0.5">
                  {MUSCLES.filter((x) => x.group === g).map((x) => (
                    <li key={x.id}>
                      <button
                        type="button"
                        aria-pressed={x.id === id}
                        onClick={() => pick(x)}
                        className={`flex w-full items-baseline gap-2 rounded-md px-1.5 py-0.5 text-left text-sm ${x.id === id ? "bg-ink text-bg" : "hover:bg-raised"}`}
                      >
                        <span className="tnum w-5 shrink-0 text-right text-xs font-bold">{x.n}</span>
                        <span className="min-w-0 flex-1">{x.name[locale]}</span>
                        <span className="sr-only">{PRESSURE[x.pressure].name[locale]}</span>
                        <span
                          className="inline-block h-2 w-2 shrink-0 self-center rounded-full"
                          style={{ background: PRESSURE_FILL[x.pressure].replace(/\/ [\d.]+\)/, ")") }}
                          aria-hidden="true"
                        />
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

function Fact({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={`rounded-xl bg-raised p-3 ${wide ? "sm:col-span-2" : ""}`}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink-3">{label}</dt>
      <dd className="mt-0.5">{value}</dd>
    </div>
  );
}
