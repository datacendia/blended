"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { SourceList } from "@/components/ui/SourceList";
import { COPY, fill } from "@/lib/copy";
import { vertebraLabel, type Locale } from "@/lib/i18n";
import { href } from "@/lib/nav";
import {
  hasCranialSupply,
  hasSacralSupply,
  organById,
  ORGANS,
  organsAt,
  PARA_NERVE,
  RELAYS,
  SACRAL_OUTFLOW,
  SEGMENTS,
  segmentIndex,
  segmentNote,
  segmentsBetween,
  SYMPATHETIC_OUTFLOW,
  WIRING_SOURCES,
  type Organ,
  type RelayId
} from "@/lib/organs";

/**
 * The organ-wiring poster, redrawn so the paths are the real ones.
 *
 * Left to right: brainstem and spinal nerves, the sympathetic chain beside
 * them, relay ganglia in front of the spine, the vagus, then the organs.
 * Picking an organ draws its sympathetic path (solid, from T1-L2 through a
 * relay) and its parasympathetic one (dashed, from the brainstem or S2-S4).
 * The point the poster can't make shows up on its own: most dashed lines
 * start in the skull and never touch a vertebra.
 */
type Selection = { kind: "organ"; id: string } | { kind: "segment"; id: string };

const W = 360;
const H = 640;
const BRAIN = { x: 42, y: 12, w: 96, h: 58 };
const CORD_X = 82;
const CORD_W = 16;
const CHAIN_X = 124;
const RELAY_X = 172;
const VAGUS_X = 200;
const ORGAN_X = 224;
const SEG_TOP = 84;
const SEG_STEP = 18;
const SEG_H = 15;

const SYMP = "rgb(var(--symp))";
const PARA = "rgb(var(--parasymp))";

const segY = (id: string) => SEG_TOP + segmentIndex(id) * SEG_STEP + SEG_H / 2;
const organY = (organ: Organ) => 36 + ORGANS.indexOf(organ) * 40;
const organEdge = ORGAN_X - 8;
const VAGUS_BADGE_Y = (organY(organById("heart")!) + organY(organById("lungs")!)) / 2;

const symRange = new Set(segmentsBetween(SYMPATHETIC_OUTFLOW.from, SYMPATHETIC_OUTFLOW.to));
const sacralRange = new Set(segmentsBetween(SACRAL_OUTFLOW.from, SACRAL_OUTFLOW.to));

/** Prevertebral relays sit level with the organs they serve, not with the spine. */
function prevertebralY(relay: RelayId): number {
  const served = ORGANS.filter((o) => o.sympathetic.relay === relay);
  return served.reduce((sum, o) => sum + organY(o), 0) / Math.max(served.length, 1);
}

const PREVERTEBRAL = (Object.keys(RELAYS) as RelayId[]).filter((r) => RELAYS[r].prevertebral);

function mid(a: number, b: number) {
  return (a + b) / 2;
}

/** The solid sympathetic path for one organ, as SVG path strings. */
function sympatheticPaths(organ: Organ, only?: string): { rami: string[]; chain: string | null; out: string[] } {
  const { from, to, relay } = organ.sympathetic;
  const range = segmentsBetween(from, to);
  const top = segY(from);
  const bottom = segY(to);
  const oy = organY(organ);
  const rami = (only ? [only] : range).map((s) => `M${CORD_X + CORD_W} ${segY(s)}H${CHAIN_X}`);

  if (organ.id === "skin") {
    // Out to the chain from T1-L2, then back into every spinal nerve.
    const back = SEGMENTS.filter((s) => !symRange.has(s)).map((s) => `M${CHAIN_X} ${segY(s)}H${CORD_X + CORD_W}`);
    return {
      rami: [...rami, ...back],
      chain: `M${CHAIN_X} ${segY("C2")}V${segY("S5")}`,
      out: [`M${CHAIN_X} ${segY("S2")}C${RELAY_X} ${segY("S2")} ${RELAY_X} ${oy} ${organEdge} ${oy}`]
    };
  }
  if (relay === "superior-cervical" || relay === "cervical-thoracic") {
    // Fibres climb the chain to ganglia in the neck before heading out.
    const gy = relay === "superior-cervical" ? segY("C2") : segY("C7");
    return {
      rami,
      chain: `M${CHAIN_X} ${gy}V${bottom}`,
      out: [`M${CHAIN_X} ${gy}C${mid(CHAIN_X, organEdge)} ${gy} ${mid(CHAIN_X, organEdge)} ${oy} ${organEdge} ${oy}`]
    };
  }
  const cy = mid(top, bottom);
  if (RELAYS[relay].prevertebral) {
    const ry = prevertebralY(relay);
    return {
      rami,
      chain: `M${CHAIN_X} ${top}V${bottom}`,
      out: [`M${CHAIN_X} ${cy}C${mid(CHAIN_X, RELAY_X)} ${cy} ${mid(CHAIN_X, RELAY_X)} ${ry} ${RELAY_X} ${ry}`, `M${RELAY_X} ${ry}C${mid(RELAY_X, organEdge)} ${ry} ${mid(RELAY_X, organEdge)} ${oy} ${organEdge} ${oy}`]
    };
  }
  return {
    rami,
    chain: `M${CHAIN_X} ${top}V${bottom}`,
    out: [`M${CHAIN_X} ${cy}C${mid(CHAIN_X, organEdge)} ${cy} ${mid(CHAIN_X, organEdge)} ${oy} ${organEdge} ${oy}`]
  };
}

/** The dashed parasympathetic path: from the brainstem, or from S2-S4. */
function parasympatheticPaths(organ: Organ): string[] {
  const oy = organY(organ);
  const nerves = organ.parasympathetic?.nerves ?? [];
  const paths: string[] = [];
  const brainRight = BRAIN.x + BRAIN.w;
  if (nerves.includes("X")) {
    paths.push(`M${brainRight} ${BRAIN.y + 40}C${VAGUS_X} ${BRAIN.y + 40} ${VAGUS_X} ${BRAIN.y + 52} ${VAGUS_X} ${BRAIN.y + 80}V${oy - 10}Q${VAGUS_X} ${oy} ${organEdge} ${oy}`);
  } else if (nerves.some((n) => n !== "pelvic")) {
    const sy = BRAIN.y + 18;
    paths.push(`M${brainRight} ${sy}C${mid(brainRight, organEdge)} ${sy} ${mid(brainRight, organEdge)} ${oy} ${organEdge} ${oy}`);
  }
  if (nerves.includes("pelvic")) {
    const my = segY("S3");
    for (const s of sacralRange) paths.push(`M${CORD_X + CORD_W} ${segY(s)}C${CHAIN_X} ${segY(s)} ${CHAIN_X} ${my} ${RELAY_X - 20} ${my}`);
    paths.push(`M${RELAY_X - 20} ${my}C${RELAY_X + 10} ${my} ${RELAY_X + 10} ${oy} ${organEdge} ${oy}`);
  }
  return paths;
}

function activate(onPick: () => void) {
  return {
    role: "button" as const,
    tabIndex: 0,
    onClick: onPick,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onPick();
      }
    }
  };
}

export function OrganWiring({ locale }: { locale: Locale }) {
  const c = COPY.organs;
  const [selection, setSelection] = useState<Selection>({ kind: "organ", id: "heart" });
  const organ = selection.kind === "organ" ? organById(selection.id) : undefined;
  const links = selection.kind === "segment" ? organsAt(selection.id) : [];

  // What to light up.
  const litSymp = new Set<string>();
  const litSacral = new Set<string>();
  let brainLit = false;
  const sympDrawn: Organ[] = [];
  const paraDrawn: Organ[] = [];
  if (organ) {
    segmentsBetween(organ.sympathetic.from, organ.sympathetic.to).forEach((s) => litSymp.add(s));
    sympDrawn.push(organ);
    if (organ.parasympathetic) paraDrawn.push(organ);
    if (hasSacralSupply(organ)) sacralRange.forEach((s) => litSacral.add(s));
    brainLit = hasCranialSupply(organ);
  } else if (selection.kind === "segment") {
    for (const link of links) (link.system === "sympathetic" ? sympDrawn : paraDrawn).push(link.organ);
    if (symRange.has(selection.id)) litSymp.add(selection.id);
    if (sacralRange.has(selection.id) && paraDrawn.length) litSacral.add(selection.id);
  }
  const litOrgans = new Map<string, "symp" | "para" | "both">();
  for (const o of sympDrawn) litOrgans.set(o.id, "symp");
  for (const o of paraDrawn) litOrgans.set(o.id, litOrgans.has(o.id) ? "both" : "para");

  const segFill = (s: string) => {
    if (litSymp.has(s)) return SYMP;
    if (litSacral.has(s)) return PARA;
    if (symRange.has(s)) return "rgb(var(--symp) / 0.2)";
    if (sacralRange.has(s)) return "rgb(var(--parasymp) / 0.2)";
    return "rgb(var(--surface))";
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:items-start">
      <figure className="m-0 min-w-0 rounded-2xl border border-line bg-surface p-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="group" aria-label={c.figureLabel[locale]}>
          {/* Brainstem */}
          <g aria-hidden="true">
            <rect
              x={BRAIN.x}
              y={BRAIN.y}
              width={BRAIN.w}
              height={BRAIN.h}
              rx={22}
              fill={brainLit ? PARA : "rgb(var(--parasymp) / 0.2)"}
              stroke="rgb(var(--ink-3))"
              strokeWidth={1}
            />
            <text x={BRAIN.x + BRAIN.w / 2} y={BRAIN.y + BRAIN.h / 2 + 3.5} textAnchor="middle" fontSize={10} fontWeight={600} fill={brainLit ? "white" : "rgb(var(--ink))"}>
              {c.brainstem[locale]}
            </text>
          </g>
          <rect x={CORD_X + 3} y={BRAIN.y + BRAIN.h} width={CORD_W - 6} height={SEG_TOP - BRAIN.y - BRAIN.h} fill="rgb(var(--ink-3) / 0.4)" aria-hidden="true" />

          {/* Sympathetic chain and its ganglia */}
          <g aria-hidden="true">
            <title>{c.chain[locale]}</title>
            <line x1={CHAIN_X} y1={segY("C2")} x2={CHAIN_X} y2={segY("S5")} stroke="rgb(var(--ink-3) / 0.55)" strokeWidth={1.5} />
            {SEGMENTS.filter((s) => s === "C2" || s === "C6" || s === "C7" || segmentIndex(s) >= segmentIndex("T1")).map((s) => (
              <circle key={s} cx={CHAIN_X} cy={segY(s)} r={s === "C2" ? 5 : s === "C7" ? 4.5 : 2.6} fill="rgb(var(--surface))" stroke="rgb(var(--ink-3))" strokeWidth={1.2} />
            ))}
            {SEGMENTS.filter((s) => symRange.has(s)).map((s) => (
              <line key={s} x1={CORD_X + CORD_W} y1={segY(s)} x2={CHAIN_X - 3} y2={segY(s)} stroke="rgb(var(--symp) / 0.35)" strokeWidth={1} />
            ))}
          </g>

          {/* Vagus lane and relay ganglia in front of the spine */}
          <g aria-hidden="true">
            <path
              d={`M${BRAIN.x + BRAIN.w} ${BRAIN.y + 40}C${VAGUS_X} ${BRAIN.y + 40} ${VAGUS_X} ${BRAIN.y + 52} ${VAGUS_X} ${BRAIN.y + 80}V${organY(organById("colon-upper")!)}`}
              fill="none"
              stroke="rgb(var(--parasymp) / 0.4)"
              strokeWidth={1.5}
              strokeDasharray="5 4"
            />
            {/* Between the heart and lung branches, where no path crosses the lane */}
            <circle cx={VAGUS_X} cy={VAGUS_BADGE_Y} r={8.5} fill="rgb(var(--surface))" stroke={PARA} strokeWidth={1.4} />
            <text x={VAGUS_X} y={VAGUS_BADGE_Y + 3.5} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={PARA}>
              X
            </text>
            {PREVERTEBRAL.map((r) => (
              <rect key={r} x={RELAY_X - 5} y={prevertebralY(r) - 5} width={10} height={10} transform={`rotate(45 ${RELAY_X} ${prevertebralY(r)})`} fill="rgb(var(--surface))" stroke="rgb(var(--ink-3))" strokeWidth={1.2}>
                <title>{RELAYS[r].name[locale]}</title>
              </rect>
            ))}
          </g>

          {/* Active paths */}
          <g fill="none" strokeLinecap="round" aria-hidden="true">
            {sympDrawn.map((o) => {
              const p = sympatheticPaths(o, selection.kind === "segment" ? selection.id : undefined);
              return (
                <g key={`s-${o.id}`} stroke={SYMP} strokeWidth={2.4}>
                  {p.rami.map((d, i) => (
                    <path key={i} d={d} />
                  ))}
                  {p.chain && <path d={p.chain} strokeWidth={3.2} />}
                  {p.out.map((d, i) => (
                    <path key={`o${i}`} d={d} />
                  ))}
                </g>
              );
            })}
            {paraDrawn.map((o) => (
              <g key={`p-${o.id}`} stroke={PARA} strokeWidth={2.4} strokeDasharray="6 4">
                {parasympatheticPaths(o).map((d, i) => (
                  <path key={i} d={d} />
                ))}
              </g>
            ))}
          </g>

          {/* Spinal nerves */}
          {SEGMENTS.map((s) => {
            const y = SEG_TOP + segmentIndex(s) * SEG_STEP;
            const picked = selection.kind === "segment" && selection.id === s;
            const label = vertebraLabel(s, locale);
            return (
              <g key={s} {...activate(() => setSelection({ kind: "segment", id: s }))} aria-label={fill(c.levelTitle[locale], { level: label })} aria-pressed={picked} className="cursor-pointer outline-none [&:focus-visible>rect:first-child]:stroke-accent">
                <rect x={30} y={y - 1.5} width={CORD_X + CORD_W - 30 + 6} height={SEG_STEP} fill="transparent" stroke="transparent" strokeWidth={2} />
                <rect x={CORD_X} y={y} width={CORD_W} height={SEG_H} rx={3} fill={segFill(s)} stroke={picked ? "rgb(var(--ink))" : "rgb(var(--ink-3) / 0.6)"} strokeWidth={picked ? 2 : 1} />
                <text x={CORD_X - 6} y={y + SEG_H / 2 + 3.5} textAnchor="end" fontSize={9.5} fontWeight={picked ? 700 : 400} fill={picked ? "rgb(var(--ink))" : "rgb(var(--ink-3))"}>
                  {label}
                </text>
              </g>
            );
          })}

          {/* Organs */}
          {ORGANS.map((o) => {
            const y = organY(o);
            const lit = litOrgans.get(o.id);
            const picked = organ?.id === o.id;
            return (
              <g key={o.id} {...activate(() => setSelection({ kind: "organ", id: o.id }))} aria-label={o.name[locale]} aria-pressed={picked} className="cursor-pointer outline-none [&:focus-visible>rect:first-child]:stroke-accent">
                <rect x={ORGAN_X - 14} y={y - 18} width={W - ORGAN_X + 12} height={36} rx={8} fill={picked ? "rgb(var(--raised))" : "transparent"} stroke="transparent" strokeWidth={2} />
                <circle
                  cx={ORGAN_X}
                  cy={y}
                  r={7}
                  fill={picked ? "rgb(var(--ink))" : lit === "symp" ? SYMP : lit === "para" ? PARA : lit === "both" ? "rgb(var(--ink-2))" : "rgb(var(--surface))"}
                  stroke="rgb(var(--ink-3))"
                  strokeWidth={1.2}
                />
                <text x={ORGAN_X + 13} y={y + 4} fontSize={11.5} fontWeight={picked || lit ? 600 : 400} fill={picked || lit ? "rgb(var(--ink))" : "rgb(var(--ink-2))"}>
                  {o.short[locale]}
                </text>
              </g>
            );
          })}
        </svg>
        <figcaption className="mt-3 space-y-1.5 px-1 text-xs text-ink-2">
          <Legend swatch={<line x1="0" y1="5" x2="22" y2="5" stroke={SYMP} strokeWidth="2.4" />}>{COPY.spine.sympathetic[locale]}</Legend>
          <Legend swatch={<line x1="0" y1="5" x2="22" y2="5" stroke={PARA} strokeWidth="2.4" strokeDasharray="6 4" />}>{COPY.spine.parasympathetic[locale]}</Legend>
          <Legend swatch={<rect x="5" y="0" width="12" height="10" rx="2" fill="rgb(var(--symp) / 0.2)" stroke="rgb(var(--ink-3) / 0.6)" />}>{c.legendTint[locale]}</Legend>
          <Legend
            swatch={
              <>
                <circle cx="6" cy="5" r="3" fill="rgb(var(--surface))" stroke="rgb(var(--ink-3))" />
                <rect x="13" y="1.5" width="7" height="7" transform="rotate(45 16.5 5)" fill="rgb(var(--surface))" stroke="rgb(var(--ink-3))" />
              </>
            }
          >
            {c.legendRelays[locale]}
          </Legend>
          <Legend swatch={<text x="11" y="9" textAnchor="middle" fontSize="10" fontWeight="700" fill={PARA}>X</text>}>{c.legendVagus[locale]}</Legend>
        </figcaption>
      </figure>

      <div className="min-w-0 space-y-4" aria-live="polite">
        {organ ? <OrganPanel organ={organ} locale={locale} /> : selection.kind === "segment" ? <SegmentPanel id={selection.id} locale={locale} onPick={(id) => setSelection({ kind: "organ", id })} /> : null}
        <p className="text-sm text-ink-3">{c.ranges[locale]}</p>
        <SourceList ids={WIRING_SOURCES} locale={locale} />
      </div>
    </div>
  );
}

function Legend({ swatch, children }: { swatch: ReactNode; children: ReactNode }) {
  return (
    <p className="flex items-center gap-2">
      <svg width="22" height="10" viewBox="0 0 22 10" aria-hidden="true" className="shrink-0 overflow-visible">
        {swatch}
      </svg>
      <span>{children}</span>
    </p>
  );
}

function OrganPanel({ organ, locale }: { organ: Organ; locale: Locale }) {
  const c = COPY.organs;
  const { from, to, relay, effect } = organ.sympathetic;
  const levels = from === to ? vertebraLabel(from, locale) : `${vertebraLabel(from, locale)}-${vertebraLabel(to, locale)}`;
  const para = organ.parasympathetic;
  return (
    <article className="space-y-3 rounded-2xl border border-line bg-surface p-5">
      <h2 className="text-xl font-semibold">{organ.name[locale]}</h2>
      <section className="rounded-xl border-l-4 border-symp bg-raised p-4">
        <h3 className="font-semibold">{COPY.spine.sympathetic[locale]}</h3>
        <dl className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-sm">
          <dt className="text-ink-3">{c.levels[locale]}</dt>
          <dd className="tnum font-semibold">{levels}</dd>
          <dt className="text-ink-3">{c.relay[locale]}</dt>
          <dd>{RELAYS[relay].name[locale]}</dd>
          <dt className="text-ink-3">{c.effect[locale]}</dt>
          <dd>{effect[locale]}</dd>
        </dl>
      </section>
      <section className="rounded-xl border-l-4 border-parasymp bg-raised p-4">
        <h3 className="font-semibold">{COPY.spine.parasympathetic[locale]}</h3>
        {para ? (
          <dl className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-sm">
            <dt className="text-ink-3">{c.nerve[locale]}</dt>
            <dd className="font-semibold">{para.nerves.map((n) => PARA_NERVE[n][locale]).join(" · ")}</dd>
            <dt className="text-ink-3">{c.route[locale]}</dt>
            <dd>{para.nerves.includes("pelvic") ? c.sacralRoute[locale] : c.skullRoute[locale]}</dd>
            <dt className="text-ink-3">{c.effect[locale]}</dt>
            <dd>{para.effect[locale]}</dd>
          </dl>
        ) : (
          <p className="mt-1 text-sm text-ink-2">{c.noPara[locale]}</p>
        )}
      </section>
      {organ.note && <p className="text-sm leading-relaxed text-ink-2">{organ.note[locale]}</p>}
    </article>
  );
}

function SegmentPanel({ id, locale, onPick }: { id: string; locale: Locale; onPick: (organId: string) => void }) {
  const c = COPY.organs;
  const label = vertebraLabel(id, locale);
  const links = organsAt(id);
  const note = segmentNote(id);
  return (
    <article className="space-y-3 rounded-2xl border border-line bg-surface p-5">
      <h2 className="text-xl font-semibold">{fill(c.levelTitle[locale], { level: label })}</h2>
      {links.length > 0 ? (
        <>
          <p className="text-sm text-ink-2">{c.levelOrgans[locale]}</p>
          <ul className="flex flex-wrap gap-2">
            {links.map(({ organ, system }) => (
              <li key={`${organ.id}-${system}`}>
                <button
                  type="button"
                  onClick={() => onPick(organ.id)}
                  className={`rounded-full border-2 px-3 py-1 text-sm hover:bg-raised ${system === "sympathetic" ? "border-symp" : "border-dashed border-parasymp"}`}
                >
                  {organ.short[locale]}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="font-medium">{c.noOrgans[locale]}</p>
      )}
      {note && <p className="text-sm leading-relaxed text-ink-2">{note[locale]}</p>}
      <Link className="inline-block text-sm text-accent underline underline-offset-2" href={`${href(locale, "spine")}#root-${id}`}>
        {fill(c.seeOnSpine[locale], { level: label })}
      </Link>
    </article>
  );
}
