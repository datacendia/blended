"use client";

import { useState } from "react";
import { SourceList } from "@/components/ui/SourceList";
import { fill } from "@/lib/copy";
import {
  effect,
  GLIDE_COPY,
  GLIDE_SOURCES,
  GLIDE_TEXT,
  glideKind,
  JOINTS,
  NERVES,
  nerveTension,
  REST_POSE,
  SLIDER_POSE,
  slideToward,
  TENSION_RANGE,
  TEST_POSE,
  type Joint,
  type NerveId,
  type Pose
} from "@/lib/diagrams/nerveGlide";
import type { Locale } from "@/lib/i18n";
import { Choice } from "./Choice";
import { HALO } from "./shapes";

/**
 * Front view, the person's right arm on the viewer's left. The arm is drawn
 * from its joint angles, so every control moves it. Elbow bending is shown in
 * the plane of the page, as if the shoulder were turned out (the "goalpost"
 * arm): the front of the elbow then faces up, toward the head.
 *
 * The three nerves are drawn along the arm on their own sides: the median
 * down the front, the ulnar behind the inner elbow, the radial behind the
 * upper-arm bone (dashed) and then in front of the outer elbow. The chosen
 * nerve is drawn thick and coloured by its tension.
 */
type V = { x: number; y: number };
const add = (a: V, b: V, k = 1): V => ({ x: a.x + b.x * k, y: a.y + b.y * k });
const dir = (deg: number): V => ({ x: Math.cos((deg * Math.PI) / 180), y: Math.sin((deg * Math.PI) / 180) });
/** The side a joint bends toward: the direction rotated a quarter turn. */
const flexSide = (d: V): V => ({ x: -d.y, y: d.x });

const PIVOT = { x: 250, y: 96 };
const TILT = { toward: -16, neutral: 0, away: 16 } as const;
const NECK_EXIT = { x: 238, y: 100 };
const UPPER = 80;
const FORE = 70;

/** A smooth path through the points (Catmull-Rom as cubic Béziers). */
function smooth(p: V[]): string {
  let d = `M${p[0]!.x.toFixed(1)} ${p[0]!.y.toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i]!;
    const p1 = p[i]!;
    const p2 = p[i + 1]!;
    const p3 = p[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += `C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

function armGeometry(pose: Pose) {
  const out = pose.shoulder === "down-out";
  const S = { x: 214, y: out ? 116 : 110 };
  const thetaU = out ? 180 : 128;
  const thetaF = thetaU + (pose.elbow === "bent" ? 90 : 0);
  const palm = pose.forearm === "up" ? 1 : -1;
  const bend = pose.wrist === "forward" ? 1 : pose.wrist === "back" ? -1 : 0;
  const thetaH = thetaF + palm * bend * 60;
  const du = dir(thetaU);
  const df = dir(thetaF);
  const dh = dir(thetaH);
  const E = add(S, du, UPPER);
  const W = add(E, df, FORE);
  return { S, E, W, du, df, dh, thetaH, palm };
}

function nervePoints(nerve: NerveId, g: ReturnType<typeof armGeometry>): { upper: V[]; lower: V[] } {
  const fu = flexSide(g.du);
  const ff = flexSide(g.df);
  const fh = flexSide(g.dh);
  // The thumb is on the front (flexor) side with the palm up, the back with it down.
  const thumb = (k: number) => ({ x: fh.x * k * g.palm, y: fh.y * k * g.palm });
  const thumbF = (k: number) => ({ x: ff.x * k * g.palm, y: ff.y * k * g.palm });
  const tip = add(g.W, g.dh, 22);
  const shoulder = add(g.S, fu, -2);
  const offsets: Record<NerveId, { upper: number; elbow: number; fore: number; hand: V }> = {
    median: { upper: 2, elbow: 3, fore: 0, hand: add(tip, thumb(3)) },
    radial: { upper: -4, elbow: 5, fore: 0, hand: add(add(g.W, g.dh, 10), thumb(5)) },
    ulnar: { upper: -2, elbow: -7, fore: 0, hand: add(tip, thumb(-4)) }
  };
  const o = offsets[nerve];
  const foreSide = nerve === "radial" ? thumbF(5) : nerve === "ulnar" ? thumbF(-5) : { x: 0, y: 0 };
  const upper = [NECK_EXIT, shoulder, add(add(g.S, g.du, UPPER * 0.5), fu, o.upper), add(g.E, fu, o.elbow)];
  const lower = [add(g.E, fu, o.elbow), add(add(g.E, g.df, FORE * 0.45), foreSide), add(g.W, foreSide), o.hand];
  return { upper, lower };
}

const tensionColour = (t: number) => (t >= 3 ? "rgb(var(--bad))" : t >= 1 ? "rgb(var(--warn))" : "rgb(var(--nerve))");
const EFFECT_STYLE = { 1: "bg-warn/15 text-warn", 0: "bg-raised text-ink-3", [-1]: "bg-good/15 text-good" } as const;

export function NerveGlide({ locale }: { locale: Locale }) {
  const c = GLIDE_COPY;
  const [nerve, setNerve] = useState<NerveId>("median");
  const [pose, setPose] = useState<Pose>({ head: "neutral", shoulder: "down-out", elbow: "straight", forearm: "up", wrist: "neutral" });
  const t = nerveTension(nerve, pose);
  const kind = glideKind(nerve, pose);
  const toward = slideToward(nerve, pose);
  const info = GLIDE_TEXT[kind];
  const g = armGeometry(pose);
  const others = (["median", "radial", "ulnar"] as const).filter((n) => n !== nerve);
  const mine = nervePoints(nerve, g);

  const set = <J extends Joint>(joint: J, value: Pose[J]) => setPose((p) => ({ ...p, [joint]: value }));
  const options: { [J in Joint]: readonly Pose[J][] } = {
    head: ["toward", "neutral", "away"],
    shoulder: ["relaxed", "down-out"],
    elbow: ["bent", "straight"],
    forearm: ["up", "down"],
    wrist: ["back", "neutral", "forward"]
  };

  // Slider arrows sit halfway down the upper arm, pointing along the nerve toward the pulled end.
  const a0 = mine.upper[1]!;
  const a1 = mine.upper[2]!;
  const mid = { x: (a0.x + a1.x) / 2, y: (a0.y + a1.y) / 2 };
  const along = Math.atan2(a1.y - a0.y, a1.x - a0.x) * (180 / Math.PI) + (toward === "neck" ? 180 : 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <div className="min-w-0 space-y-3">
        <Choice label={c.nerve[locale]} value={nerve} onChange={setNerve} options={(["median", "radial", "ulnar"] as const).map((id) => ({ id, name: NERVES[id].name[locale] }))} />
        <figure className="m-0 rounded-2xl border border-line bg-surface p-3">
          <svg viewBox="0 0 340 250" className="block h-auto w-full" role="img" aria-label={`${c.figure[locale]}: ${NERVES[nerve].name[locale]}, ${info.name[locale]}`}>
            {/* Body */}
            <g fill="rgb(var(--ink-3) / 0.2)">
              <path d="M214 104C222 98 236 96 250 96C264 96 278 98 286 104C292 140 292 200 290 250H210C208 200 208 140 214 104Z" />
              <rect x={241} y={78} width={18} height={24} rx={6} />
            </g>
            <g transform={`rotate(${TILT[pose.head]} ${PIVOT.x} ${PIVOT.y})`}>
              <ellipse cx={250} cy={56} rx={22} ry={26} fill="rgb(var(--ink-3) / 0.2)" />
              <circle cx={242} cy={52} r={2.2} fill="rgb(var(--ink-3))" />
              <circle cx={258} cy={52} r={2.2} fill="rgb(var(--ink-3))" />
              <path d="M244 66Q250 69 256 66" fill="none" stroke="rgb(var(--ink-3))" strokeWidth={1.2} />
            </g>
            {/* Collarbone */}
            <path d={`M248 104C238 100 226 ${g.S.y - 8} ${g.S.x - 4} ${g.S.y - 6}`} fill="none" stroke="rgb(var(--bone))" strokeWidth={4} strokeLinecap="round" />
            {/* Arm: upper arm, forearm, hand */}
            <g stroke="rgb(var(--ink-3) / 0.22)" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d={`M${g.S.x} ${g.S.y}L${g.E.x} ${g.E.y}`} strokeWidth={20} />
              <path d={`M${g.E.x} ${g.E.y}L${g.W.x} ${g.W.y}`} strokeWidth={15} />
            </g>
            <g transform={`translate(${g.W.x} ${g.W.y}) rotate(${g.thetaH})`}>
              <rect x={-2} y={-7} width={18} height={14} rx={4} fill={g.palm > 0 ? "rgb(var(--bone))" : "rgb(var(--ink-3) / 0.35)"} stroke="rgb(var(--ink-3) / 0.6)" strokeWidth={0.8} />
              <rect x={14} y={-6.5} width={12} height={13} rx={4} fill={g.palm > 0 ? "rgb(var(--bone))" : "rgb(var(--ink-3) / 0.35)"} stroke="rgb(var(--ink-3) / 0.6)" strokeWidth={0.8} />
              <ellipse cx={8} cy={g.palm * 9} rx={7} ry={3} transform={`rotate(${g.palm * 28} 8 ${g.palm * 9})`} fill={g.palm > 0 ? "rgb(var(--bone))" : "rgb(var(--ink-3) / 0.35)"} stroke="rgb(var(--ink-3) / 0.6)" strokeWidth={0.8} />
              {g.palm > 0 ? <path d="M3 -2Q8 1 13 -1" fill="none" stroke="rgb(var(--ink-3) / 0.6)" strokeWidth={0.8} /> : <path d="M15 -4V4" stroke="rgb(var(--ink-3) / 0.6)" strokeWidth={0.8} strokeDasharray="1.5 1.5" />}
            </g>

            {/* The other two nerves, thin */}
            {others.map((n) => {
              const p = nervePoints(n, g);
              return (
                <g key={n} fill="none" stroke="rgb(var(--ink-3) / 0.55)" strokeWidth={1.6} strokeLinecap="round">
                  <path d={smooth(p.upper)} strokeDasharray={n === "radial" ? "3 2.5" : undefined} />
                  <path d={smooth(p.lower)} />
                </g>
              );
            })}
            {/* The chosen nerve */}
            <g fill="none" stroke={tensionColour(t)} strokeWidth={t >= 3 ? 3 : 4} strokeLinecap="round">
              <path d={smooth(mine.upper)} strokeDasharray={nerve === "radial" ? "6 3" : t <= -2 ? "7 4" : undefined} />
              <path d={smooth(mine.lower)} strokeDasharray={t <= -2 ? "7 4" : undefined} />
            </g>
            {toward && (
              <g transform={`translate(${mid.x} ${mid.y}) rotate(${along})`} fill="rgb(var(--ink))">
                <path d="M10 0l-9 -5v10z" />
                <path d="M-2 0l-9 -5v10z" opacity={0.5} />
              </g>
            )}
            <text x={g.E.x} y={g.E.y + (pose.shoulder === "down-out" && pose.elbow === "straight" ? 26 : 28)} textAnchor="middle" fontSize={9} {...HALO}>
              {NERVES[nerve].name[locale]}
            </text>
          </svg>
          <figcaption className="mt-2 px-1">
            <div className="flex items-baseline justify-between text-xs text-ink-3">
              <span>{c.tension[locale]}</span>
              {toward && <span className="font-medium text-ink">{fill(c.slides[locale], { end: toward === "neck" ? c.neckEnd[locale] : c.handEnd[locale] })}</span>}
            </div>
            <div className="mt-1 grid gap-0.5" style={{ gridTemplateColumns: `repeat(${TENSION_RANGE.max - TENSION_RANGE.min + 1}, minmax(0, 1fr))` }} aria-hidden="true">
              {Array.from({ length: TENSION_RANGE.max - TENSION_RANGE.min + 1 }, (_, i) => TENSION_RANGE.min + i).map((v) => (
                <span key={v} className={`h-2 rounded-full ${v <= t ? (v >= 3 ? "bg-bad" : v >= 1 ? "bg-warn" : "bg-nerve") : "bg-raised"}`} />
              ))}
            </div>
          </figcaption>
        </figure>
        <div role="group" aria-label={c.presets[locale]} className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-3">{c.presets[locale]}</span>
          <button type="button" className="rounded-full border border-line bg-surface px-3 py-1 hover:border-accent" onClick={() => setPose(TEST_POSE[nerve])}>
            {c.testPose[locale]}
          </button>
          <button type="button" className="rounded-full border border-line bg-surface px-3 py-1 hover:border-accent" onClick={() => setPose(SLIDER_POSE[nerve])}>
            {c.sliderPose[locale]}
          </button>
          <button type="button" className="rounded-full border border-line bg-surface px-3 py-1 hover:border-accent" onClick={() => setPose(REST_POSE[nerve])}>
            {c.restPose[locale]}
          </button>
        </div>
      </div>

      <div className="min-w-0 space-y-4">
        <section className="rounded-2xl border border-line bg-surface p-4" aria-label={c.breakdown[locale]}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-3">{c.breakdown[locale]}</p>
          <ul className="divide-y divide-line">
            {JOINTS.map((joint) => {
              const e = effect(nerve, pose, joint);
              return (
                <li key={joint} className="flex flex-wrap items-center gap-x-3 gap-y-1.5 py-2">
                  <span className="w-20 shrink-0 text-sm font-medium">{c.joints[joint][locale]}</span>
                  <div role="group" aria-label={c.joints[joint][locale]} className="flex flex-1 flex-wrap gap-1.5">
                    {(options[joint] as readonly string[]).map((v) => (
                      <button
                        key={v}
                        type="button"
                        aria-pressed={pose[joint] === v}
                        onClick={() => set(joint, v as Pose[typeof joint])}
                        className={`rounded-full border px-2.5 py-0.5 text-xs ${pose[joint] === v ? "border-accent bg-accent text-white" : "border-line bg-surface hover:border-accent"}`}
                      >
                        {(c.positions[joint] as Record<string, { en: string; es: string }>)[v]![locale]}
                      </button>
                    ))}
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${EFFECT_STYLE[e]}`}>{e > 0 ? c.effects.tight[locale] : e < 0 ? c.effects.loose[locale] : c.effects.none[locale]}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <article className="space-y-3 rounded-2xl border border-line bg-surface p-5" aria-live="polite">
          <h4 className="text-lg font-semibold">{info.name[locale]}</h4>
          <p className="leading-relaxed text-ink-2">{info.text[locale]}</p>
          <dl className="grid gap-2 text-sm">
            <div className="rounded-xl bg-raised p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-3">
                {NERVES[nerve].name[locale]} · {c.roots[locale]} <span className="tnum">{NERVES[nerve].roots.replace("-", "‑")}</span>
              </dt>
              <dd className="mt-1">{NERVES[nerve].route[locale]}</dd>
              <dd className="mt-1 text-ink-2">
                {c.supplies[locale]}: {NERVES[nerve].supplies[locale]}
              </dd>
              <dd className="mt-1 text-xs text-ink-3">
                {c.testPose[locale]}: {NERVES[nerve].test[locale]}
              </dd>
            </div>
          </dl>
          <p className="rounded-xl border-l-4 border-warn bg-warn/5 p-3 text-sm">{c.caution[locale]}</p>
          <SourceList ids={GLIDE_SOURCES} locale={locale} />
        </article>
      </div>
    </div>
  );
}
