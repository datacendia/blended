"use client";

import { useState } from "react";
import { shapesFor, SILHOUETTE } from "@/lib/bodyShapes";
import { COPY } from "@/lib/copy";
import type { L, Locale } from "@/lib/i18n";
import { regionById, type MapView } from "@/lib/regions";

/**
 * Areas of skin shaded on the same front, back and hand figures the body map
 * uses. Weight 1 is solid, anything less is half-tone, and referred-pain
 * regions are striped so they can't be mistaken for skin a nerve supplies.
 * Only the views with something shaded are drawn.
 */
const VIEWS: { view: MapView; viewBox: string; label: L }[] = [
  { view: "front", viewBox: "0 0 200 444", label: COPY.map.viewFront },
  { view: "back", viewBox: "0 0 200 444", label: COPY.map.viewBack },
  { view: "hand", viewBox: "0 0 200 236", label: COPY.map.viewHand }
];

export interface TerritoryLegend {
  full: L;
  partial?: L;
  referred?: L;
}

export function TerritoryFigure({
  weights,
  legend,
  locale,
  idPrefix,
  solid = false
}: {
  weights: Record<string, number>;
  legend: TerritoryLegend;
  locale: Locale;
  idPrefix: string;
  /** Shade referred-pain regions like any other: for maps that are all referred pain, such as a muscle's. */
  solid?: boolean;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const w = (region: string) => weights[region] ?? 0;
  const isReferred = (region: string) => !solid && Boolean(regionById(region)?.referred);
  const views = VIEWS.filter(({ view }) => shapesFor(view, "R").some((s) => w(s.region) > 0));
  if (views.length === 0) return null;
  const shaded = (pred: (weight: number, referred: boolean) => boolean) =>
    views.some(({ view }) => shapesFor(view, "R").some((s) => pred(w(s.region), isReferred(s.region))));
  const hasPartial = shaded((x, referred) => x > 0 && x < 1 && !referred);
  const hasReferred = shaded((x, referred) => x > 0 && referred);

  return (
    <div>
      <div className="grid gap-3 rounded-xl bg-raised p-3" style={{ gridTemplateColumns: `repeat(${views.length}, minmax(0, 1fr))` }}>
        {views.map(({ view, viewBox, label }) => (
          <figure key={view} className="m-0 min-w-0">
            <svg viewBox={viewBox} className="mx-auto block h-auto w-full max-w-[140px]" role="img" aria-label={label[locale]}>
              <defs>
                <pattern id={`${idPrefix}-referred-${view}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width="6" height="6" fill="rgb(var(--accent) / 0.12)" />
                  <rect width="2.4" height="6" fill="rgb(var(--accent))" />
                </pattern>
              </defs>
              {view !== "hand" && (
                <g aria-hidden="true" fill="rgb(var(--ink-3) / 0.16)">
                  {SILHOUETTE.map((d, i) => (
                    <path key={i} d={d} />
                  ))}
                </g>
              )}
              {shapesFor(view, "R").map((s) => {
                const weight = w(s.region);
                const region = regionById(s.region);
                const key = `${s.region}|${s.side}`;
                return (
                  <path
                    key={key}
                    d={s.d}
                    fill={
                      weight > 0 && isReferred(s.region)
                        ? `url(#${idPrefix}-referred-${view})`
                        : weight >= 1
                          ? "rgb(var(--accent))"
                          : weight > 0
                            ? "rgb(var(--accent) / 0.45)"
                            : hover === key
                              ? "rgb(var(--ink-3) / 0.3)"
                              : "rgb(var(--surface))"
                    }
                    stroke="rgb(var(--raised))"
                    strokeWidth="1"
                    onMouseEnter={() => setHover(key)}
                    onMouseLeave={() => setHover((h) => (h === key ? null : h))}
                  >
                    <title>{region?.label[locale] ?? s.region}</title>
                  </path>
                );
              })}
            </svg>
            <figcaption className="mt-1 text-center text-xs text-ink-3">{label[locale]}</figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-2 flex min-h-[1.25rem] flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-2">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-accent" aria-hidden="true" />
          {legend.full[locale]}
        </span>
        {legend.partial && hasPartial && (
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-accent/45" aria-hidden="true" />
            {legend.partial[locale]}
          </span>
        )}
        {legend.referred && hasReferred && (
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ background: "repeating-linear-gradient(45deg, rgb(var(--accent)) 0 2px, rgb(var(--accent) / 0.12) 2px 5px)" }}
              aria-hidden="true"
            />
            {legend.referred[locale]}
          </span>
        )}
        {hover && <span className="font-medium text-ink">{regionById(hover.split("|")[0]!)?.label[locale]}</span>}
      </p>
    </div>
  );
}
