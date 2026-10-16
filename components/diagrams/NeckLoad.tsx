"use client";

import { useState, type ReactNode } from "react";
import { SourceList } from "@/components/ui/SourceList";
import {
  ADVICE_LABEL,
  DEMANDS,
  FIGURES,
  GROUND_Y,
  NECK_LOAD_COPY,
  POSES,
  type Advice,
  type Demand,
  type Pt,
} from "@/lib/diagrams/neckLoad";
import type { L, Locale } from "@/lib/i18n";

const ADVICE_ORDER: Advice[] = ["avoid", "modify", "fine"];
const ADVICE_DOT: Record<Advice, string> = {
  avoid: "bg-bad",
  modify: "bg-warn",
  fine: "bg-good",
};
const ADVICE_STYLE: Record<Advice, string> = {
  avoid: "bg-bad/10 text-bad",
  modify: "bg-warn/15 text-warn",
  fine: "bg-good/15 text-good",
};
const ADVICE_STROKE: Record<Advice, string> = {
  avoid: "rgb(var(--bad))",
  modify: "rgb(var(--warn))",
  fine: "rgb(var(--good))",
};
const line = (pts: readonly Pt[]) =>
  `M${pts.map((p) => p.join(" ")).join("L")}`;

/**
 * The whole pose as a pictogram, the neck drawn in the advice colour so the
 * eye goes to it. Small in the gallery, large beside the close-up.
 */
function PoseFigure({
  id,
  advice,
  label,
  small,
}: {
  id: string;
  advice: Advice;
  label?: string;
  small?: boolean;
}) {
  const f = FIGURES[id];
  if (!f) return null;
  const body = "rgb(var(--ink-3) / 0.5)";
  return (
    <svg
      viewBox="0 0 120 100"
      className={
        small
          ? "block h-auto w-full"
          : "mx-auto block h-auto w-full max-w-[320px]"
      }
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <line
        x1={2}
        y1={GROUND_Y + 2}
        x2={118}
        y2={GROUND_Y + 2}
        stroke="rgb(var(--ink-3) / 0.6)"
        strokeWidth={1}
      />
      <g fill="none" stroke={body} strokeLinecap="round" strokeLinejoin="round">
        {f.limbs.map((l, i) => (
          <path key={i} d={line(l)} strokeWidth={5} />
        ))}
        <path d={line(f.spine)} strokeWidth={9} />
      </g>
      <path
        d={line(f.neck)}
        fill="none"
        stroke={ADVICE_STROKE[advice]}
        strokeWidth={small ? 5 : 4.5}
        strokeLinecap="round"
      />
      <circle cx={f.head[0]} cy={f.head[1]} r={7} fill={body} />
    </svg>
  );
}

/** One small side-view drawing of the head and neck per kind of demand. */
function NeckFigure({
  demand,
  label,
  locale,
}: {
  demand: Demand;
  label: string;
  locale: Locale;
}) {
  const c = NECK_LOAD_COPY;
  const neck = (d: string) => (
    <>
      <path
        d={d}
        fill="none"
        stroke="rgb(var(--ink-3) / 0.55)"
        strokeWidth={19}
        strokeLinecap="round"
      />
      <path
        d={d}
        fill="none"
        stroke="rgb(var(--bone))"
        strokeWidth={15}
        strokeLinecap="round"
        strokeDasharray="7 2.5"
      />
    </>
  );
  const head = (
    cx: number,
    cy: number,
    eye: [number, number],
    extra?: ReactNode,
  ) => (
    <g>
      <circle cx={cx} cy={cy} r={28} fill="rgb(var(--ink-3) / 0.22)" />
      <circle cx={eye[0]} cy={eye[1]} r={3} fill="rgb(var(--ink-2))" />
      {extra}
    </g>
  );
  const arrow = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    colour = "rgb(var(--bad))",
  ) => {
    const a = Math.atan2(y2 - y1, x2 - x1);
    const h = (s: number) =>
      `${x2 - 9 * Math.cos(a + s)} ${y2 - 9 * Math.sin(a + s)}`;
    return (
      <g stroke={colour} strokeWidth={2.4} fill="none" strokeLinecap="round">
        <path d={`M${x1} ${y1}L${x2} ${y2}`} />
        <path d={`M${h(0.5)}L${x2} ${y2}L${h(-0.5)}`} />
      </g>
    );
  };
  const shoulders = (
    <rect
      x={55}
      y={150}
      width={110}
      height={40}
      rx={18}
      fill="rgb(var(--ink-3) / 0.22)"
    />
  );
  const note = (text: L, x: number, y: number, colour = "rgb(var(--bad))") => (
    <text x={x} y={y} fontSize={10} textAnchor="middle" fill={colour}>
      {text[locale]}
    </text>
  );

  const scenes: Record<Demand, ReactNode> = {
    neutral: (
      <>
        {shoulders}
        {neck("M110 152Q106 128 110 104")}
        {head(112, 76, [127, 70])}
      </>
    ),
    extension: (
      <>
        {shoulders}
        {neck("M110 152Q102 130 94 110")}
        {head(86, 84, [98, 62])}
        <path
          d="M84 120q-8 6 0 12M90 118q-8 7 0 14"
          stroke="rgb(var(--bad))"
          strokeWidth={2}
          fill="none"
        />
        {note(c.narrows, 150, 128)}
      </>
    ),
    rotation: (
      <>
        {shoulders}
        {neck("M110 152Q106 128 110 104")}
        {head(
          112,
          76,
          [104, 72],
          <circle cx={120} cy={72} r={3} fill="rgb(var(--ink-2))" />,
        )}
        <path
          d="M76 112Q112 132 148 112"
          fill="none"
          stroke="rgb(var(--bad))"
          strokeWidth={2.4}
        />
        {arrow(140, 117, 150, 110)}
        {note(c.narrows, 112, 146)}
      </>
    ),
    "forced-flexion": (
      <>
        {shoulders}
        {neck("M108 152Q120 132 138 122")}
        {head(158, 128, [168, 146])}
        {arrow(84, 18, 84, 62)}
        {arrow(132, 18, 132, 62)}
        {note(c.weight, 108, 12)}
      </>
    ),
    axial: (
      <>
        {shoulders}
        {neck("M110 152Q106 128 110 104")}
        {head(112, 76, [127, 70])}
        {arrow(112, 4, 112, 40)}
        {note(c.weight, 160, 22)}
      </>
    ),
    "head-lift": (
      <>
        <line
          x1={6}
          y1={172}
          x2={214}
          y2={172}
          stroke="rgb(var(--ink-3))"
          strokeWidth={1.5}
        />
        <rect
          x={6}
          y={138}
          width={116}
          height={34}
          rx={16}
          fill="rgb(var(--ink-3) / 0.22)"
        />
        {neck("M116 152Q140 142 152 122")}
        {head(166, 102, [180, 92])}
        {arrow(166, 132, 166, 166, "rgb(var(--warn))")}
        {note(c.headWeight, 166, 186, "rgb(var(--ink-2))")}
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 220 192"
      className="mx-auto block h-auto w-full max-w-[300px]"
      role="img"
      aria-label={label}
    >
      {scenes[demand]}
    </svg>
  );
}

export function NeckLoad({
  locale,
  set,
}: {
  locale: Locale;
  set: "yoga" | "pilates";
}) {
  const c = NECK_LOAD_COPY;
  const poses = POSES.filter((p) => p.set === set);
  const [id, setId] = useState(poses[0]!.id);
  const pose = poses.find((p) => p.id === id) ?? poses[0]!;
  const demand = DEMANDS[pose.demand];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <div className="min-w-0 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">
          {c.gallery[locale]}
        </p>
        {ADVICE_ORDER.map((advice) => (
          <div
            key={advice}
            role="group"
            aria-label={ADVICE_LABEL[advice][locale]}
          >
            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-ink-2">
              <span
                className={`h-2 w-2 rounded-full ${ADVICE_DOT[advice]}`}
                aria-hidden="true"
              />
              {ADVICE_LABEL[advice][locale]}
            </p>
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {poses
                .filter((p) => p.advice === advice)
                .map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      aria-pressed={p.id === pose.id}
                      onClick={() => setId(p.id)}
                      className={`flex h-full w-full flex-col items-center gap-1 rounded-xl border p-1.5 text-center text-xs ${p.id === pose.id ? "border-accent bg-accent/10 font-semibold ring-2 ring-accent" : "border-line bg-surface hover:border-accent"}`}
                    >
                      <PoseFigure id={p.id} advice={p.advice} small />
                      <span className="leading-tight">{p.name[locale]}</span>
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="min-w-0 space-y-4">
        <figure className="m-0 grid gap-3 rounded-2xl border border-line bg-surface p-3 sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] sm:items-center">
          <PoseFigure
            id={pose.id}
            advice={pose.advice}
            label={pose.name[locale]}
          />
          <div>
            <NeckFigure
              demand={pose.demand}
              label={`${c.figure[locale]}: ${demand.name[locale]}`}
              locale={locale}
            />
            <figcaption className="mt-1 text-center text-xs text-ink-2">
              <span className="font-semibold">{c.closeUp[locale]}:</span>{" "}
              {demand.name[locale]}
            </figcaption>
          </div>
        </figure>
        <article
          className="space-y-3 rounded-2xl border border-line bg-surface p-5"
          aria-live="polite"
        >
          <span
            className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${ADVICE_STYLE[pose.advice]}`}
          >
            {ADVICE_LABEL[pose.advice][locale]}
          </span>
          <h4 className="text-lg font-semibold">{pose.name[locale]}</h4>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">
              {c.why[locale]}
            </p>
            <p className="mt-0.5">{pose.why[locale]}</p>
          </div>
          <p className="text-sm text-ink-2">{demand.text[locale]}</p>
          <div className="rounded-xl bg-raised p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">
              {c.instead[locale]}
            </p>
            <p className="mt-0.5 text-sm">{pose.instead[locale]}</p>
          </div>
          <p className="border-t border-line pt-3 text-sm text-ink-3">
            {c.caveat[locale]}
          </p>
          <SourceList ids={demand.sources} locale={locale} />
        </article>
      </div>
    </div>
  );
}
