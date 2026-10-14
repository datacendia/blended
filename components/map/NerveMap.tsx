"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Callout, type Tone } from "@/components/ui/Callout";
import { SourceList } from "@/components/ui/SourceList";
import { SHAPES, shapesFor, SILHOUETTE } from "@/lib/bodyShapes";
import { COPY } from "@/lib/copy";
import { EXAMS, SHOULDER_ABDUCTION_RELIEF } from "@/lib/exams";
import { vertebraLabel, type Locale } from "@/lib/i18n";
import { href } from "@/lib/nav";
import {
  examFor,
  mapAdvice,
  matchRoots,
  parsePickKey,
  pickKey,
  regionById,
  REGIONS,
  SYMPTOMS,
  type AdviceLevel,
  type MapView,
  type Pick,
  type Side,
  type Symptom
} from "@/lib/regions";
import { rootById } from "@/lib/roots";

const ADVICE_TONE: Record<AdviceLevel, Tone> = { emergency: "emergency", urgent: "urgent", note: "note" };

export function NerveMap({ locale }: { locale: Locale }) {
  const c = COPY.map;
  const [view, setView] = useState<MapView>("front");
  const [handSide, setHandSide] = useState<"L" | "R">("R");
  const [picked, setPicked] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>(["pain"]);
  const [hover, setHover] = useState<string | null>(null);

  const picks = useMemo(() => picked.map(parsePickKey).filter((p): p is Pick => Boolean(p)), [picked]);
  const matches = useMemo(() => (symptoms.length ? matchRoots(picks, symptoms).slice(0, 4) : []), [picks, symptoms]);
  const advice = useMemo(() => mapAdvice(picks, symptoms), [picks, symptoms]);
  const exam = examFor(matches);
  const top = matches[0]?.score ?? 1;

  const toggle = (key: string) => setPicked((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  const toggleSymptom = (s: Symptom) => setSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const sideName = (side: Side) => (side === "R" ? COPY.common.right[locale] : side === "L" ? COPY.common.left[locale] : c.centre[locale]);
  const pickName = (p: Pick) => {
    const label = regionById(p.region)?.label[locale] ?? p.region;
    return p.side === "C" ? label : `${label} (${sideName(p.side).toLowerCase()})`;
  };

  const shapes = shapesFor(view, handSide);
  const isBody = view !== "hand";
  const hovered = hover ? parsePickKey(hover) : null;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {(["front", "back", "hand"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={`rounded-full border px-3.5 py-1.5 text-sm ${view === v ? "border-accent bg-accent text-accent-ink" : "border-line bg-surface"}`}
            >
              {v === "front" ? c.viewFront[locale] : v === "back" ? c.viewBack[locale] : c.viewHand[locale]}
            </button>
          ))}
          {view === "hand" && (
            <span className="ml-auto flex items-center gap-1 text-sm">
              <span className="text-ink-3">{c.whichHand[locale]}</span>
              {(["L", "R"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={handSide === s}
                  onClick={() => setHandSide(s)}
                  className={`rounded-full border px-3 py-1 ${handSide === s ? "border-accent bg-accent text-accent-ink" : "border-line bg-surface"}`}
                >
                  {sideName(s)}
                </button>
              ))}
            </span>
          )}
        </div>

        <div className="rounded-2xl border border-line bg-surface p-3">
          <svg
            viewBox={isBody ? "0 0 200 444" : "0 0 200 236"}
            className="mx-auto block h-auto w-full max-w-[380px]"
            role="group"
            aria-label={c.title[locale]}
          >
            {isBody && (
              <>
                <text x="4" y="12" fontSize="8" fill="rgb(var(--ink-3))">
                  {view === "front" ? COPY.common.yourRight[locale] : COPY.common.yourLeft[locale]}
                </text>
                <text x="196" y="12" fontSize="8" fill="rgb(var(--ink-3))" textAnchor="end">
                  {view === "front" ? COPY.common.yourLeft[locale] : COPY.common.yourRight[locale]}
                </text>
                <g aria-hidden="true" fill="rgb(var(--ink-3) / 0.16)">
                  {SILHOUETTE.map((d, i) => (
                    <path key={i} d={d} />
                  ))}
                </g>
              </>
            )}
            {shapes.map((s) => {
              const key = pickKey({ region: s.region, side: s.side });
              const on = picked.includes(key);
              const region = regionById(s.region);
              const label = pickName({ region: s.region, side: s.side });
              return (
                <path
                  key={key}
                  d={s.d}
                  className="tap"
                  role="button"
                  tabIndex={0}
                  aria-label={label}
                  aria-pressed={on}
                  fill={on ? "rgb(var(--accent))" : hover === key ? "rgb(var(--accent) / 0.35)" : "rgb(var(--accent) / 0.13)"}
                  stroke={region?.emergency ? "rgb(var(--bad))" : "rgb(var(--surface))"}
                  strokeWidth={region?.emergency ? 1.2 : 1}
                  strokeDasharray={region?.emergency ? "3 2" : undefined}
                  onClick={() => toggle(key)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggle(key);
                    }
                  }}
                  onMouseEnter={() => setHover(key)}
                  onMouseLeave={() => setHover((h) => (h === key ? null : h))}
                  onFocus={() => setHover(key)}
                  onBlur={() => setHover((h) => (h === key ? null : h))}
                />
              );
            })}
            {view === "hand" &&
              shapes
                .filter((s) => s.labelAt)
                .map((s) => {
                  const [x, y] = s.labelAt!;
                  const on = picked.includes(pickKey({ region: s.region, side: s.side }));
                  return (
                    <text
                      key={`label-${s.region}`}
                      x={x}
                      y={y}
                      fontSize="9"
                      textAnchor="middle"
                      dominantBaseline="central"
                      transform={s.labelAngle ? `rotate(${s.labelAngle} ${x} ${y})` : undefined}
                      fill={on ? "rgb(var(--accent-ink))" : "rgb(var(--ink-2))"}
                      pointerEvents="none"
                      aria-hidden="true"
                    >
                      {regionById(s.region)?.label[locale]}
                    </text>
                  );
                })}
          </svg>
          <p className="min-h-[1.5rem] px-1 text-center text-sm text-ink-2" aria-hidden="true">
            {hovered ? pickName(hovered) : view === "hand" ? c.handHint[locale] : c.hover[locale]}
          </p>
        </div>

        <details className="rounded-xl border border-line bg-surface p-3 text-sm">
          <summary className="cursor-pointer select-none font-medium">{c.list[locale]}</summary>
          <ul className="mt-3 space-y-2">
            {REGIONS.filter((r) => r.view === view).map((r) => {
              const sides: Side[] = SHAPES.some((s) => s.region === r.id && s.side === "C")
                ? ["C"]
                : view === "hand"
                  ? [handSide]
                  : ["R", "L"];
              return (
                <li key={r.id} className="flex items-center justify-between gap-2">
                  <span>{r.label[locale]}</span>
                  <span className="flex gap-1">
                    {sides.map((side) => {
                      const key = pickKey({ region: r.id, side });
                      const on = picked.includes(key);
                      return (
                        <button
                          key={side}
                          type="button"
                          aria-pressed={on}
                          onClick={() => toggle(key)}
                          className={`rounded-md border px-2 py-0.5 ${on ? "border-accent bg-accent text-accent-ink" : "border-line"}`}
                        >
                          {sideName(side)}
                        </button>
                      );
                    })}
                  </span>
                </li>
              );
            })}
          </ul>
        </details>
      </div>

      <div className="space-y-6">
        <fieldset>
          <legend className="mb-2 font-semibold">{c.symptomsLabel[locale]}</legend>
          <div className="flex flex-wrap gap-2">
            {SYMPTOMS.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={symptoms.includes(s.id)}
                onClick={() => toggleSymptom(s.id)}
                className={`rounded-full border px-3.5 py-1.5 text-sm ${symptoms.includes(s.id) ? "border-accent bg-accent text-accent-ink" : "border-line bg-surface"}`}
              >
                {s.label[locale]}
              </button>
            ))}
          </div>
        </fieldset>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-semibold">{c.selected[locale]}</h2>
            {picked.length > 0 && (
              <button type="button" onClick={() => setPicked([])} className="text-sm text-ink-3 underline underline-offset-2">
                {COPY.common.clear[locale]}
              </button>
            )}
          </div>
          {picks.length === 0 ? (
            <p className="text-ink-3">{c.none[locale]}</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {picks.map((p) => (
                <li key={pickKey(p)}>
                  <button
                    type="button"
                    onClick={() => toggle(pickKey(p))}
                    className="rounded-full bg-raised px-3 py-1 text-sm"
                    aria-label={`${COPY.common.remove[locale]}: ${pickName(p)}`}
                  >
                    {pickName(p)} ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {advice.length > 0 && (
          <section className="space-y-2" aria-live="polite">
            <h2 className="font-semibold">{c.advice[locale]}</h2>
            {advice.map((a) => (
              <Callout key={a.id} tone={ADVICE_TONE[a.level]}>
                {a.text[locale]}
                {a.level === "emergency" && (
                  <>
                    {" "}
                    <Link className="font-medium underline" href={href(locale, "warning-signs")}>
                      {COPY.common.seeWarnings[locale]}
                    </Link>
                  </>
                )}
              </Callout>
            ))}
          </section>
        )}

        {picks.length > 0 && (
          <section aria-live="polite">
            <h2 className="mb-3 font-semibold">{c.results[locale]}</h2>
            {symptoms.length === 0 ? (
              <p className="text-ink-3">{c.pickSymptom[locale]}</p>
            ) : matches.length === 0 ? (
              <p className="text-ink-3">{c.noMatch[locale]}</p>
            ) : (
              <ol className="space-y-3">
                {matches.map((m) => {
                  const root = rootById(m.rootId);
                  if (!root) return null;
                  return (
                    <li key={m.rootId} className="rounded-xl border border-line bg-surface p-4">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-xl font-semibold">{vertebraLabel(m.rootId, locale)}</p>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${m.fit === "strong" ? "bg-accent text-accent-ink" : m.fit === "fits" ? "bg-raised text-accent" : "bg-raised text-ink-3"}`}
                        >
                          {c.fit[m.fit][locale]}
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-raised" aria-hidden="true">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${Math.round((m.score / top) * 100)}%` }} />
                      </div>
                      <p className="mt-2 text-xs text-ink-3">
                        {c.matchedBy[locale]}: {m.regions.map((r) => regionById(r)?.label[locale]).join(", ")}
                      </p>
                      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                        <div>
                          <dt className="text-ink-3">{COPY.spine.sensory[locale]}</dt>
                          <dd>{root.sensory[locale]}</dd>
                        </div>
                        <div>
                          <dt className="text-ink-3">{COPY.spine.motor[locale]}</dt>
                          <dd>{root.motor[locale]}</dd>
                        </div>
                        <div>
                          <dt className="text-ink-3">{COPY.spine.reflex[locale]}</dt>
                          <dd>{root.reflex ? root.reflex[locale] : COPY.spine.noReflex[locale]}</dd>
                        </div>
                        {root.typicalDisc && (
                          <div>
                            <dt className="text-ink-3">{COPY.spine.typicalDisc[locale]}</dt>
                            <dd>{root.typicalDisc[locale]}</dd>
                          </div>
                        )}
                      </dl>
                      <Link
                        className="mt-3 inline-block text-sm font-medium text-accent underline underline-offset-2"
                        href={`${href(locale, "spine")}#root-${m.rootId}`}
                      >
                        {c.seeSpine[locale]} →
                      </Link>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>
        )}

        {exam && symptoms.length > 0 && (
          <section className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="font-semibold">{c.examTitle[locale]}</h2>
            <p className="mt-1 text-sm text-ink-2">{EXAMS[exam].title[locale]}:</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {EXAMS[exam].items.map((item) => (
                <li key={item.id} className="flex gap-2">
                  <span className="text-accent" aria-hidden="true">✓</span>
                  <span>{item.text[locale]}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-ink-2">{EXAMS[exam].note[locale]}</p>
            {exam === "cervical" && (
              <div className="mt-3">
                <Callout tone="info">{SHOULDER_ABDUCTION_RELIEF[locale]}</Callout>
              </div>
            )}
            <SourceList ids={EXAMS[exam].sources} locale={locale} />
          </section>
        )}

        <p className="text-sm text-ink-3">{COPY.common.disclaimer[locale]}</p>
      </div>
    </div>
  );
}
