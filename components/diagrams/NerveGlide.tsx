"use client";

import { useState } from "react";
import { SourceList } from "@/components/ui/SourceList";
import { GLIDE_COPY, GLIDE_SOURCES, GLIDE_TEXT, glideKind, nerveTension, type ArmPos, type HeadTilt } from "@/lib/diagrams/nerveGlide";
import type { Locale } from "@/lib/i18n";
import { Choice } from "./Choice";

/**
 * Front view, the person's right arm out to the side (on the viewer's
 * left), the nerve drawn along its inner edge from the neck to the palm.
 * The head pivots at the base of the neck; the arm is either straight with
 * the wrist back, or bent at the elbow.
 */
const PIVOT = { x: 235, y: 96 };
const TILT: Record<HeadTilt, number> = { toward: -18, neutral: 0, away: 18 };

const NERVE_COLOUR = (t: number) => (t >= 2 ? "rgb(var(--bad))" : t === 1 ? "rgb(var(--warn))" : "rgb(var(--nerve))");

export function NerveGlide({ locale }: { locale: Locale }) {
  const c = GLIDE_COPY;
  const [head, setHead] = useState<HeadTilt>("neutral");
  const [arm, setArm] = useState<ArmPos>("straight");
  const t = nerveTension(head, arm);
  const kind = glideKind(head, arm);
  const info = GLIDE_TEXT[kind];

  // Where the nerve leaves the neck moves with the head.
  const neck = head === "away" ? { x: 231, y: 90 } : head === "toward" ? { x: 222, y: 103 } : { x: 226, y: 98 };
  const straight = arm === "straight";
  const elbow = { x: 120, y: 112 };
  const wrist = straight ? { x: 46, y: 112 } : { x: 120, y: 44 };
  const tip = straight ? { x: 38, y: 86 } : { x: 104, y: 32 };
  const nerve = straight
    ? `M${neck.x} ${neck.y}Q208 108 198 121L120 120L48 120Q42 112 42 100`
    : `M${neck.x} ${neck.y}Q208 108 198 121L128 120L128 50Q126 40 116 36`;
  // A slider moves the nerve toward whichever end is being pulled.
  const towardNeck = kind === "slider" && head === "away";
  const towardHand = kind === "slider" && head === "toward";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="min-w-0 space-y-3">
        <Choice label={c.head[locale]} value={head} onChange={setHead} options={(["toward", "neutral", "away"] as const).map((id) => ({ id, name: c.headTilt[id][locale] }))} />
        <Choice label={c.arm[locale]} value={arm} onChange={setArm} options={(["bent", "straight"] as const).map((id) => ({ id, name: c.armPos[id][locale] }))} />
        <figure className="m-0 rounded-2xl border border-line bg-surface p-3">
          <svg viewBox="0 0 320 232" className="block h-auto w-full" role="img" aria-label={`${c.figure[locale]}: ${info.name[locale]}`}>
            <g fill="rgb(var(--ink-3) / 0.22)" stroke="none">
              <rect x={200} y={100} width={72} height={132} rx={22} />
              <rect x={227} y={80} width={17} height={26} rx={6} />
            </g>
            <g stroke="rgb(var(--ink-3) / 0.22)" strokeWidth={16} strokeLinecap="round" fill="none">
              <path d={`M204 112L${elbow.x} ${elbow.y}L${wrist.x} ${wrist.y}`} strokeLinejoin="round" />
              <path d={`M${wrist.x} ${wrist.y}L${tip.x} ${tip.y}`} strokeWidth={11} />
            </g>
            <g transform={`rotate(${TILT[head]} ${PIVOT.x} ${PIVOT.y})`}>
              <circle cx={235} cy={60} r={24} fill="rgb(var(--ink-3) / 0.22)" />
              <circle cx={226} cy={56} r={2.4} fill="rgb(var(--ink-3))" />
              <circle cx={244} cy={56} r={2.4} fill="rgb(var(--ink-3))" />
            </g>
            <path d={nerve} fill="none" stroke={NERVE_COLOUR(t)} strokeWidth={t >= 2 ? 3 : 4.5} strokeLinecap="round" strokeDasharray={t <= -2 ? "7 4" : undefined} />
            {(towardNeck || towardHand) && (
              <g fill="rgb(var(--ink))">
                <path d={towardNeck ? "M176 126l-12 -6v12z" : "M150 126l12 -6v12z"} />
                <path d={towardNeck ? "M150 126l-12 -6v12z" : "M176 126l12 -6v12z"} opacity={0.5} />
              </g>
            )}
            <text x={straight ? 84 : 150} y={straight ? 140 : 140} textAnchor="middle" fontSize={10} fill="rgb(var(--ink-3))">
              {c.nerve[locale]}
            </text>
          </svg>
          <figcaption className="mt-2 px-1">
            <p className="mb-1 text-xs text-ink-3">{c.tension[locale]}</p>
            <div className="grid grid-cols-5 gap-1" aria-hidden="true">
              {[-2, -1, 0, 1, 2].map((v) => (
                <span key={v} className={`h-2 rounded-full ${v === t ? (v >= 2 ? "bg-bad" : v === 1 ? "bg-warn" : "bg-nerve") : "bg-raised"}`} />
              ))}
            </div>
          </figcaption>
        </figure>
      </div>
      <article className="min-w-0 space-y-3 rounded-2xl border border-line bg-surface p-5" aria-live="polite">
        <h4 className="text-lg font-semibold">{info.name[locale]}</h4>
        <p className="leading-relaxed text-ink-2">{info.text[locale]}</p>
        <p className="rounded-xl border-l-4 border-warn bg-warn/5 p-3 text-sm">{c.caution[locale]}</p>
        <SourceList ids={GLIDE_SOURCES} locale={locale} />
      </article>
    </div>
  );
}
