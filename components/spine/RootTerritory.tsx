"use client";

import { useState } from "react";
import { shapesFor, SILHOUETTE } from "@/lib/bodyShapes";
import { COPY } from "@/lib/copy";
import type { L, Locale } from "@/lib/i18n";
import { regionById, type MapView } from "@/lib/regions";

/**
 * Where a nerve root reaches, drawn on the same body the map uses. Picking C7
 * on the spine lights the middle finger; picking S1 lights the outer foot and
 * heel. It is the spine and the body map joined up, which is the question a
 * patient actually has: "if it's that root, where would I feel it?"
 */
const VIEWS: { view: MapView; viewBox: string; label: L }[] = [
  { view: "front", viewBox: "0 0 200 444", label: COPY.map.viewFront },
  { view: "back", viewBox: "0 0 200 444", label: COPY.map.viewBack },
  { view: "hand", viewBox: "0 0 200 236", label: COPY.map.viewHand }
];

function weightFor(regionId: string, rootId: string): number {
  return regionById(regionId)?.roots.find(([id]) => id === rootId)?.[1] ?? 0;
}

export function RootTerritory({ rootId, locale }: { rootId: string; locale: Locale }) {
  const c = COPY.spine;
  const [hover, setHover] = useState<string | null>(null);
  const views = VIEWS.filter(({ view }) => shapesFor(view, "R").some((s) => weightFor(s.region, rootId) > 0));
  if (views.length === 0) return null;
  const hasReferred = views.some(({ view }) =>
    shapesFor(view, "R").some((s) => weightFor(s.region, rootId) > 0 && regionById(s.region)?.referred)
  );

  return (
    <section aria-labelledby="territory-title">
      <h3 id="territory-title" className="mb-2 font-semibold">
        {c.territory[locale]}
      </h3>
      <div className="grid gap-3 rounded-xl bg-raised p-3" style={{ gridTemplateColumns: `repeat(${views.length}, minmax(0, 1fr))` }}>
        {views.map(({ view, viewBox, label }) => (
          <figure key={view} className="m-0 min-w-0">
            <svg viewBox={viewBox} className="mx-auto block h-auto w-full max-w-[140px]" role="img" aria-label={label[locale]}>
              <defs>
                <pattern id={`referred-${view}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
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
                const w = weightFor(s.region, rootId);
                const region = regionById(s.region);
                const name = region?.label[locale] ?? s.region;
                const key = `${s.region}|${s.side}`;
                return (
                  <path
                    key={key}
                    d={s.d}
                    fill={
                      // Referred areas are where pain is felt, not skin the root
                      // supplies: striped so they can't be mistaken for a dermatome.
                      w > 0 && region?.referred
                        ? `url(#referred-${view})`
                        : w >= 1
                        ? "rgb(var(--accent))"
                        : w > 0
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
                    <title>{name}</title>
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
          {c.usualArea[locale]}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-accent/45" aria-hidden="true" />
          {c.sharedArea[locale]}
        </span>
        {hasReferred && (
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ background: "repeating-linear-gradient(45deg, rgb(var(--accent)) 0 2px, rgb(var(--accent) / 0.12) 2px 5px)" }}
              aria-hidden="true"
            />
            {c.referredArea[locale]}
          </span>
        )}
        {hover && <span className="font-medium text-ink">{regionById(hover.split("|")[0]!)?.label[locale]}</span>}
      </p>
    </section>
  );
}
