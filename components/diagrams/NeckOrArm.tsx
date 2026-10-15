"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
import { TerritoryFigure } from "@/components/map/TerritoryFigure";
import { SourceList } from "@/components/ui/SourceList";
import { shapesFor, SILHOUETTE } from "@/lib/bodyShapes";
import { COPY, fill } from "@/lib/copy";
import { CLUE_ROWS, differences, MIMIC_COPY, MIMICS, type Cell, type Mimic, type MimicId } from "@/lib/diagrams/mimics";
import type { L, Locale } from "@/lib/i18n";
import { href } from "@/lib/nav";
import { regionById, type MapView } from "@/lib/regions";
import { Choice } from "./Choice";

type Mode = "one" | "compare";
const A = "rgb(var(--cat-1))";
const B = "rgb(var(--cat-2))";
const VIEWS: { view: MapView; viewBox: string; label: L }[] = [
  { view: "front", viewBox: "0 0 200 444", label: COPY.map.viewFront },
  { view: "back", viewBox: "0 0 200 444", label: COPY.map.viewBack },
  { view: "hand", viewBox: "0 0 200 236", label: COPY.map.viewHand }
];
const short = (m: Mimic, locale: Locale) => m.name[locale].replace(/ \(.*\)$/, "");

/**
 * Two patterns on the same figures: blue for the first only, orange for the
 * second only, stripes of both where they overlap. The colours are the
 * validated categorical pair, and the legend and the list of differences
 * name every area, so colour is never the only key.
 */
function CompareFigure({ a, b, locale }: { a: Mimic; b: Mimic; locale: Locale }) {
  const views = VIEWS.filter(({ view }) => shapesFor(view, "R").some((s) => (a.weights[s.region] ?? 0) > 0 || (b.weights[s.region] ?? 0) > 0));
  return (
    <div className="grid gap-3 rounded-xl bg-raised p-3" style={{ gridTemplateColumns: `repeat(${views.length}, minmax(0, 1fr))` }}>
      {views.map(({ view, viewBox, label }) => (
        <figure key={view} className="m-0 min-w-0">
          <svg viewBox={viewBox} className="mx-auto block h-auto w-full max-w-[140px]" role="img" aria-label={label[locale]}>
            <defs>
              <pattern id={`cmp-both-${view}`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="4" height="8" fill={A} />
                <rect x="4" width="4" height="8" fill={B} />
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
              const wa = a.weights[s.region] ?? 0;
              const wb = b.weights[s.region] ?? 0;
              const fillColour =
                wa > 0 && wb > 0 ? `url(#cmp-both-${view})` : wa > 0 ? `rgb(var(--cat-1) / ${wa >= 1 ? 1 : 0.45})` : wb > 0 ? `rgb(var(--cat-2) / ${wb >= 1 ? 1 : 0.45})` : "rgb(var(--surface))";
              return (
                <path key={`${s.region}|${s.side}`} d={s.d} fill={fillColour} stroke="rgb(var(--raised))" strokeWidth="1">
                  <title>{regionById(s.region)?.label[locale] ?? s.region}</title>
                </path>
              );
            })}
          </svg>
          <figcaption className="mt-1 text-center text-xs text-ink-3">{label[locale]}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function CellView({ cell, locale }: { cell: Cell; locale: Locale }) {
  const c = MIMIC_COPY;
  if (cell === "yes")
    return (
      <span className="font-semibold text-ink">
        <span aria-hidden="true">● </span>
        {c.yes[locale]}
      </span>
    );
  if (cell === "some")
    return (
      <span className="text-ink-2">
        <span aria-hidden="true">◐ </span>
        {c.some[locale]}
      </span>
    );
  if (cell === "no")
    return (
      <span className="text-ink-3">
        <span aria-hidden="true">— </span>
        <span className="sr-only">{c.no[locale]}</span>
      </span>
    );
  return <span>{cell[locale]}</span>;
}

export function NeckOrArm({ locale }: { locale: Locale }) {
  const c = MIMIC_COPY;
  const [mode, setMode] = useState<Mode>("one");
  const [id, setId] = useState<MimicId>("c6");
  const [picked, setOther] = useState<MimicId>("carpal");
  // Picking the same pattern on both sides is never useful: fall back to a different one.
  const other: MimicId = picked !== id ? picked : id === "carpal" ? "c6" : "carpal";
  const m = MIMICS.find((x) => x.id === id)!;
  const o = MIMICS.find((x) => x.id === other)!;
  const diff = differences(m, o);
  const groups = [
    { kind: "root" as const, label: c.roots },
    { kind: "peripheral" as const, label: c.peripheral }
  ];
  const label = (r: string) => regionById(r)?.label[locale] ?? r;
  const picker = (value: MimicId, onChange: (v: MimicId) => void, title: L, exclude?: MimicId) => (
    <Choice label={title[locale]} value={value} onChange={onChange} options={MIMICS.filter((x) => x.id !== exclude).map((x) => ({ id: x.id, name: short(x, locale) }))} />
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-3">
          <Choice label={c.mode[locale]} value={mode} onChange={setMode} options={(["one", "compare"] as const).map((x) => ({ id: x, name: c.modes[x][locale] }))} />
          {mode === "one" ? (
            <>
              {groups.map((g) => (
                <div key={g.kind} role="group" aria-label={g.label[locale]}>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-3">{g.label[locale]}</p>
                  <div className="flex flex-wrap gap-2">
                    {MIMICS.filter((x) => x.kind === g.kind).map((x) => (
                      <button
                        key={x.id}
                        type="button"
                        aria-pressed={x.id === id}
                        onClick={() => setId(x.id)}
                        className={`rounded-full border px-3 py-1 text-sm ${x.id === id ? "border-accent bg-accent font-medium text-accent-ink" : "border-line bg-surface hover:border-accent"}`}
                      >
                        {x.name[locale]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <TerritoryFigure weights={m.weights} idPrefix={`mimic-${m.id}`} locale={locale} legend={{ full: c.usual, partial: c.partial, referred: c.referred }} />
            </>
          ) : (
            <>
              {picker(id, (v) => setId(v), c.first, other)}
              {picker(other, (v) => setOther(v), c.second, id)}
              <CompareFigure a={m} b={o} locale={locale} />
              <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-2">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: A }} aria-hidden="true" />
                  {fill(c.only[locale], { name: short(m, locale) })}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: B }} aria-hidden="true" />
                  {fill(c.only[locale], { name: short(o, locale) })}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: `repeating-linear-gradient(45deg, ${A} 0 2px, ${B} 2px 4px)` }} aria-hidden="true" />
                  {c.both[locale]}
                </span>
              </p>
            </>
          )}
        </div>

        {mode === "one" ? (
          <article className="min-w-0 space-y-3 rounded-2xl border border-line bg-surface p-5" aria-live="polite">
            <h4 className="text-lg font-semibold">{m.name[locale]}</h4>
            <p className="text-sm text-ink-3">{m.where[locale]}</p>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">{c.clues[locale]}</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-ink-2">
                {m.clues.map((clue) => (
                  <li key={clue.en}>{clue[locale]}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-raised p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">{c.confirm[locale]}</p>
              <p className="mt-1 text-sm">{m.confirm[locale]}</p>
            </div>
            <Link className="inline-block text-sm text-accent underline underline-offset-2" href={href(locale, "map")}>
              {c.openMap[locale]}
            </Link>
            <SourceList ids={m.sources} locale={locale} />
          </article>
        ) : (
          <article className="min-w-0 space-y-3 rounded-2xl border border-line bg-surface p-5" aria-live="polite">
            <h4 className="text-lg font-semibold">
              {short(m, locale)} · {short(o, locale)}
            </h4>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">{c.tells[locale]}</p>
            {diff.onlyA.length + diff.onlyB.length === 0 ? (
              <p className="text-sm text-ink-2">{c.same[locale]}</p>
            ) : (
              <dl className="grid gap-2 text-sm sm:grid-cols-2">
                {[
                  { who: m, regions: diff.onlyA, colour: A },
                  { who: o, regions: diff.onlyB, colour: B }
                ].map((x) => (
                  <div key={x.who.id} className="rounded-xl bg-raised p-3">
                    <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-3">
                      <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: x.colour }} aria-hidden="true" />
                      {fill(c.only[locale], { name: short(x.who, locale) })}
                    </dt>
                    <dd className="mt-1">{x.regions.length ? x.regions.map(label).join(", ") : "—"}</dd>
                  </div>
                ))}
              </dl>
            )}
            <ul className="space-y-2 border-t border-line pt-3 text-sm">
              {CLUE_ROWS.filter((r) => JSON.stringify(m.table[r.id]) !== JSON.stringify(o.table[r.id])).map((r) => (
                <li key={r.id}>
                  <p className="text-xs text-ink-3">{r.name[locale]}</p>
                  <p className="mt-0.5 flex flex-wrap gap-x-4">
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block h-2 w-2 rounded-full" style={{ background: A }} aria-hidden="true" />
                      <CellView cell={m.table[r.id]} locale={locale} />
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block h-2 w-2 rounded-full" style={{ background: B }} aria-hidden="true" />
                      <CellView cell={o.table[r.id]} locale={locale} />
                    </span>
                  </p>
                </li>
              ))}
            </ul>
            <SourceList ids={[...new Set([...m.sources, ...o.sources])]} locale={locale} />
          </article>
        )}
      </div>

      <section aria-labelledby="clue-table" className="min-w-0">
        <h4 id="clue-table" className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-3">
          {c.table[locale]}
        </h4>
        <div className="relative overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="w-44 p-2" />
                {MIMICS.map((x) => {
                  const on = x.id === id || (mode === "compare" && x.id === other);
                  return (
                    <th key={x.id} scope="col" className={`p-2 align-bottom ${on ? "bg-raised" : ""}`}>
                      <button type="button" onClick={() => setId(x.id)} aria-pressed={x.id === id} className="text-left text-xs font-semibold text-accent underline-offset-2 hover:underline">
                        {short(x, locale)}
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {CLUE_ROWS.map((r) => (
                <tr key={r.id} className="border-b border-line last:border-0">
                  <th scope="row" className="p-2 text-xs font-medium text-ink-2">
                    {r.name[locale]}
                  </th>
                  {MIMICS.map((x) => {
                    const on = x.id === id || (mode === "compare" && x.id === other);
                    return (
                      <Fragment key={x.id}>
                        <td className={`p-2 text-xs ${on ? "bg-raised" : ""}`}>
                          <CellView cell={x.table[r.id]} locale={locale} />
                        </td>
                      </Fragment>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-ink-3">{c.notDiagnosis[locale]}</p>
      </section>
    </div>
  );
}
