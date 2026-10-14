"use client";

import { useState } from "react";
import { SourceList } from "@/components/ui/SourceList";
import { MUSCLES, NECK_MUSCLE_COPY, NECK_MUSCLE_SOURCES, type MuscleId } from "@/lib/diagrams/neckMuscles";
import type { Locale } from "@/lib/i18n";
import { Choice } from "./Choice";

export function NeckMuscles({ locale }: { locale: Locale }) {
  const c = NECK_MUSCLE_COPY;
  const [id, setId] = useState<MuscleId>("upper-trapezius");
  const m = MUSCLES.find((x) => x.id === id)!;
  // The picked muscle is drawn last so it sits on top of its neighbours.
  const order = [...MUSCLES.filter((x) => x.id !== id), m];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <div className="min-w-0 space-y-3">
        <Choice label={c.muscles[locale]} value={id} onChange={setId} options={MUSCLES.map((x) => ({ id: x.id, name: x.name[locale] }))} />
        <figure className="m-0 rounded-2xl border border-line bg-surface p-3">
          <svg viewBox="40 10 250 250" className="mx-auto block h-auto w-full max-w-[420px]" role="img" aria-label={`${c.figure[locale]}: ${m.name[locale]}`}>
            {/* Head, neck and shoulder, facing right */}
            <g fill="rgb(var(--ink-3) / 0.16)">
              <ellipse cx={150} cy={74} rx={56} ry={52} />
              <path d="M196 92L214 104L200 112Z" />
              <path d="M108 104C104 140 98 176 70 206H232C206 186 192 160 186 124Z" />
              <rect x={50} y={200} width={220} height={60} rx={26} />
            </g>
            <circle cx={128} cy={84} r={8} fill="rgb(var(--ink-3) / 0.3)" />
            <circle cx={190} cy={66} r={3} fill="rgb(var(--ink-3))" />

            {order.map((x) => {
              const on = x.id === id;
              return (
                <path
                  key={x.id}
                  d={x.d}
                  onClick={() => setId(x.id)}
                  className="cursor-pointer"
                  fill={on ? "rgb(var(--accent))" : "rgb(var(--bad) / 0.18)"}
                  stroke={on ? "rgb(var(--ink))" : "rgb(var(--bad) / 0.45)"}
                  strokeWidth={on ? 1.6 : 1}
                >
                  <title>{x.name[locale]}</title>
                </path>
              );
            })}

            {/* Where firm pressure doesn't belong */}
            <ellipse cx={200} cy={160} rx={8} ry={24} fill="none" stroke="rgb(var(--bad))" strokeWidth={1.6} strokeDasharray="4 3" />
            <text x={212} y={150} fontSize={10} fill="rgb(var(--bad))">{c.carotid[locale]}</text>
            <path d="M164 150C163 180 162 205 158 222C154 234 148 242 140 250" fill="none" stroke="rgb(var(--nerve))" strokeWidth={3} strokeLinecap="round" />
            <text x={150} y={246} fontSize={10} fill="rgb(var(--ink-2))">{c.plexus[locale]}</text>
          </svg>
          <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1 px-1 text-xs text-ink-2">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-4 rounded-sm border-2 border-dashed border-bad" aria-hidden="true" />
              {c.avoid[locale]}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1 w-4 rounded-full bg-nerve" aria-hidden="true" />
              {c.plexus[locale]}
            </span>
          </figcaption>
        </figure>
      </div>
      <article className="min-w-0 space-y-3 rounded-2xl border border-line bg-surface p-5" aria-live="polite">
        <h4 className="text-lg font-semibold">{m.name[locale]}</h4>
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-3">{c.does[locale]}</dt>
            <dd className="mt-0.5">{m.does[locale]}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-3">{c.felt[locale]}</dt>
            <dd className="mt-0.5">{m.felt[locale]}</dd>
          </div>
          <div className={`rounded-xl p-3 ${m.caution ? "border-l-4 border-warn bg-warn/5" : "bg-raised"}`}>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-3">{c.massage[locale]}</dt>
            <dd className="mt-0.5">{m.massage[locale]}</dd>
          </div>
        </dl>
        <p className="text-sm text-ink-3">{c.evidence[locale]}</p>
        <SourceList ids={NECK_MUSCLE_SOURCES} locale={locale} />
      </article>
    </div>
  );
}
