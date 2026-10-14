"use client";

import { useState } from "react";
import { SourceList } from "@/components/ui/SourceList";
import { COPY, fill } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { KIND_INFO, partName, partsFor, VERTEBRA_KINDS, type PartId, type VertebraKind } from "@/lib/vertebra";
import { TOP_VIEW, TOP_VIEWS, type Shape } from "@/lib/vertebraShapes";

/**
 * A vertebra from above, every part tappable. The parts list under the figure
 * is the accessible control (real buttons); the drawing answers taps too, but
 * is one image to a screen reader rather than a dozen unnamed shapes.
 */
export function VertebraUpClose({ locale }: { locale: Locale }) {
  const c = COPY.vertebra;
  const [kind, setKind] = useState<VertebraKind>("cervical");
  const [partId, setPartId] = useState<PartId>("root");
  const parts = partsFor(kind);
  const part = parts.find((p) => p.id === partId) ?? parts[0]!;
  const view = TOP_VIEWS[kind];
  const kindName = COPY.spine.short[kind][locale];

  const boneFill = (s: Shape) => {
    const on = s.part === part.id;
    if (s.hole) return on ? "rgb(var(--accent) / 0.28)" : "rgb(var(--surface))";
    return on ? "rgb(var(--accent))" : "rgb(var(--bone))";
  };
  const pick = (id: PartId) => () => setPartId(id);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <div className="min-w-0">
        <div role="group" aria-label={c.kindLabel[locale]} className="mb-3 flex flex-wrap gap-2">
          {VERTEBRA_KINDS.map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={k === kind}
              onClick={() => setKind(k)}
              className={`rounded-full border px-3.5 py-1.5 text-sm ${k === kind ? "border-accent bg-accent font-medium text-accent-ink" : "border-line bg-surface hover:border-accent"}`}
            >
              {COPY.spine.short[k][locale]} <span className="tnum opacity-75">· {KIND_INFO[k].example}</span>
            </button>
          ))}
        </div>
        <figure className="m-0 rounded-2xl border border-line bg-surface p-3">
          <svg viewBox={`${view.box.x} ${view.box.y} ${view.box.w} ${view.box.h}`} className="mx-auto block h-auto w-full max-w-[460px]" role="img" aria-label={fill(c.figureLabel[locale], { kind: kindName.toLowerCase() })}>
            <text x={160} y={view.box.y + 18} textAnchor="middle" fontSize={11} fill="rgb(var(--ink-3))" letterSpacing="0.08em">
              {c.front[locale].toUpperCase()}
            </text>
            <text x={160} y={view.box.y + view.box.h - 6} textAnchor="middle" fontSize={11} fill="rgb(var(--ink-3))" letterSpacing="0.08em">
              {c.back[locale].toUpperCase()}
            </text>
            {view.context && (
              <g fill="none" stroke="rgb(var(--ink-3) / 0.35)" strokeWidth={10} strokeLinecap="round">
                <path d={view.context} />
                <path d={view.context} transform={TOP_VIEW.mirror} />
              </g>
            )}
            {view.shapes.map((s, i) => {
              const props = {
                d: s.d,
                fill: boneFill(s),
                fillRule: "evenodd" as const,
                stroke: s.part === part.id ? "rgb(var(--ink))" : "rgb(var(--ink-3))",
                strokeWidth: s.part === part.id ? 1.8 : 1.2,
                strokeDasharray: s.hole ? "4 3" : undefined,
                onClick: pick(s.part),
                className: "cursor-pointer"
              };
              return (
                <g key={i}>
                  <path {...props} />
                  {s.paired && <path {...props} transform={TOP_VIEW.mirror} />}
                </g>
              );
            })}
            {view.artery && (
              <g onClick={pick("transverseForamen")} className="cursor-pointer" fill="rgb(var(--bad))">
                <circle cx={view.artery.cx} cy={view.artery.cy} r={view.artery.r} />
                <circle cx={view.artery.cx} cy={view.artery.cy} r={view.artery.r} transform={TOP_VIEW.mirror} />
              </g>
            )}
            <g onClick={pick("cord")} className="cursor-pointer">
              {view.contents.kind === "cord" ? (
                <>
                  <ellipse
                    cx={view.contents.cx}
                    cy={view.contents.cy}
                    rx={view.contents.rx}
                    ry={view.contents.ry}
                    fill={part.id === "cord" ? "rgb(var(--nerve))" : "rgb(var(--nerve) / 0.45)"}
                    stroke="rgb(var(--nerve))"
                    strokeWidth={part.id === "cord" ? 2.4 : 1.4}
                  />
                  {/* The grey-matter butterfly */}
                  <path
                    d={`M${view.contents.cx - view.contents.rx * 0.45} ${view.contents.cy - view.contents.ry * 0.5}Q${view.contents.cx} ${view.contents.cy} ${view.contents.cx - view.contents.rx * 0.45} ${view.contents.cy + view.contents.ry * 0.5}M${view.contents.cx + view.contents.rx * 0.45} ${view.contents.cy - view.contents.ry * 0.5}Q${view.contents.cx} ${view.contents.cy} ${view.contents.cx + view.contents.rx * 0.45} ${view.contents.cy + view.contents.ry * 0.5}`}
                    fill="none"
                    stroke="rgb(var(--ink-2) / 0.6)"
                    strokeWidth={1.4}
                  />
                </>
              ) : (
                view.contents.dots.map(([x, y]) => (
                  <circle key={`${x}-${y}`} cx={x} cy={y} r={3.6} fill={part.id === "cord" ? "rgb(var(--nerve))" : "rgb(var(--nerve) / 0.7)"} stroke="rgb(var(--ink-2) / 0.5)" strokeWidth={0.8} />
                ))
              )}
            </g>
            <g onClick={pick("root")} className="cursor-pointer" fill="none" strokeLinecap="round">
              {[undefined, TOP_VIEW.mirror].map((t, i) => (
                <g key={i} transform={t}>
                  <path d={view.root} stroke="transparent" strokeWidth={18} />
                  <path d={view.root} stroke={part.id === "root" ? "rgb(var(--ink))" : "rgb(var(--ink-3) / 0.7)"} strokeWidth={part.id === "root" ? 10 : 8.5} />
                  <path d={view.root} stroke="rgb(var(--nerve))" strokeWidth={6.5} />
                </g>
              ))}
            </g>
          </svg>
          <figcaption className="mt-2 text-center text-xs text-ink-3">
            {KIND_INFO[kind].summary[locale]} {c.schematic[locale]}
          </figcaption>
        </figure>
        <div role="group" aria-label={c.partsLabel[locale]} className="mt-3 flex flex-wrap gap-2">
          {parts.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={p.id === part.id}
              onClick={pick(p.id)}
              className={`rounded-full border px-3 py-1 text-sm ${p.id === part.id ? "border-ink bg-ink font-medium text-bg" : "border-line bg-surface hover:border-accent"}`}
            >
              {partName(p, kind)[locale]}
            </button>
          ))}
        </div>
      </div>

      <article className="min-w-0 space-y-3 rounded-2xl border border-line bg-surface p-5" aria-live="polite">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">{fill(c.inThis[locale], { kind: kindName.toLowerCase() })}</p>
        <h3 className="text-xl font-semibold">{partName(part, kind)[locale]}</h3>
        <p className="leading-relaxed">{part.role[locale]}</p>
        {part.byKind?.[kind] && <p className="leading-relaxed text-ink-2">{part.byKind[kind]![locale]}</p>}
        {part.matters && (
          <div className="rounded-xl bg-raised p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">{c.matters[locale]}</p>
            <p className="mt-1 text-sm leading-relaxed">{part.matters[locale]}</p>
            {part.id === "root" && (
              <a className="mt-2 inline-block text-sm text-accent underline underline-offset-2" href="#trapped">
                {c.seeTrapped[locale]}
              </a>
            )}
          </div>
        )}
        <SourceList ids={part.sources} locale={locale} />
      </article>
    </div>
  );
}
