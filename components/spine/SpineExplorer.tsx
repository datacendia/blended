"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { Callout } from "@/components/ui/Callout";
import { COPY, fill } from "@/lib/copy";
import { vertebraLabel, type Locale } from "@/lib/i18n";
import { href } from "@/lib/nav";
import { REGIONS } from "@/lib/regions";
import { rootById, rootForDisc, rootsExitingAbove, rootsExitingBelow, type Root } from "@/lib/roots";
import { autonomicFor, nextVertebra, REGION_INFO, vertebraById, type SpineRegion } from "@/lib/spine";
import { PLACED, ROOT_MARKS, regionExtent, SPINE_VIEWBOX, type Placed } from "@/lib/spineGeometry";
import { RootTerritory } from "./RootTerritory";

type Selection = { kind: "vertebra"; id: string } | { kind: "root"; id: string };
type Zoom = "whole" | "cervical" | "thoracic" | "lumbar" | "pelvis";

const ZOOMS: Zoom[] = ["whole", "cervical", "thoracic", "lumbar", "pelvis"];

const FILL: Record<SpineRegion, string> = {
  cervical: "rgb(var(--cervical))",
  thoracic: "rgb(var(--thoracic))",
  lumbar: "rgb(var(--lumbar))",
  sacral: "rgb(var(--sacral))",
  coccyx: "rgb(var(--coccyx))"
};

function viewBoxFor(zoom: Zoom): string {
  if (zoom === "whole") return `0 0 ${SPINE_VIEWBOX.width} ${SPINE_VIEWBOX.height}`;
  const extents = zoom === "pelvis" ? [regionExtent("sacral"), regionExtent("coccyx")] : [regionExtent(zoom)];
  const top = Math.min(...extents.map((e) => e.top)) - 26;
  const bottom = Math.max(...extents.map((e) => e.bottom)) + 26;
  return `0 ${top.toFixed(1)} ${SPINE_VIEWBOX.width} ${(bottom - top).toFixed(1)}`;
}

function parseHash(hash: string): Selection | null {
  const m = hash.match(/^#(root|v)-([A-Za-z0-9]+)$/);
  if (!m) return null;
  const id = m[2]!;
  if (m[1] === "root") return rootById(id) ? { kind: "root", id } : null;
  return vertebraById(id) ? { kind: "vertebra", id } : null;
}

function subscribeHash(onChange: () => void): () => void {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

function zoomFor(selection: Selection): Zoom {
  const region = selection.kind === "root" ? rootById(selection.id)?.region : vertebraById(selection.id)?.region;
  if (region === "cervical" || region === "thoracic" || region === "lumbar") return region;
  return region ? "pelvis" : "whole";
}

const DEFAULT_SELECTION: Selection = { kind: "vertebra", id: "C6" };

export function SpineExplorer({ locale }: { locale: Locale }) {
  const c = COPY.spine;
  // A deep link from the body map (#root-C6) lives in the address bar, which
  // is external state, so it is read with useSyncExternalStore. Copying it
  // into state from an effect rendered C6-the-vertebra first and swapped to
  // the root a frame later; CI caught the flash. A tap overrides the link
  // until the link changes, which is why each choice remembers its hash.
  const hash = useSyncExternalStore(subscribeHash, () => window.location.hash, () => "");
  const linked = useMemo(() => parseHash(hash), [hash]);
  const [picked, setPicked] = useState<{ hash: string; selection: Selection } | null>(null);
  const [zoomed, setZoomed] = useState<{ hash: string; zoom: Zoom } | null>(null);
  const selection = picked?.hash === hash ? picked.selection : (linked ?? DEFAULT_SELECTION);
  const zoom = zoomed?.hash === hash ? zoomed.zoom : linked ? zoomFor(linked) : "whole";
  const setSelection = (next: Selection) => setPicked({ hash, selection: next });
  const setZoom = (next: Zoom) => setZoomed({ hash, zoom: next });

  const highlightedRoots = useMemo(() => {
    if (selection.kind === "root") return new Set([selection.id]);
    return new Set([...rootsExitingAbove(selection.id), ...rootsExitingBelow(selection.id)].map((r) => r.id));
  }, [selection]);

  const activate = (next: Selection) => () => setSelection(next);
  const onKey = (next: Selection) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelection(next);
    }
  };

  const zoomLabel = (z: Zoom) => (z === "whole" ? c.whole[locale] : c.short[z][locale]);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <div>
        <div role="group" aria-label={c.zoom[locale]} className="mb-3 flex flex-wrap gap-1.5">
          {ZOOMS.map((z) => (
            <button
              key={z}
              type="button"
              aria-pressed={zoom === z}
              onClick={() => setZoom(z)}
              className={`rounded-full border px-3 py-1 text-sm ${zoom === z ? "border-accent bg-accent text-accent-ink" : "border-line bg-surface text-ink-2"}`}
            >
              {zoomLabel(z)}
            </button>
          ))}
        </div>
        <div className="rounded-2xl border border-line bg-surface p-2">
          <svg
            viewBox={viewBoxFor(zoom)}
            className="mx-auto block h-auto w-full max-w-[420px]"
            style={{ maxHeight: "78vh" }}
            role="group"
            aria-label={c.title[locale]}
          >
            <Skull />
            <text x="8" y="20" fontSize="9" fill="rgb(var(--ink-3))">← {c.back[locale]}</text>
            <text x="232" y="20" fontSize="9" fill="rgb(var(--ink-3))" textAnchor="end">{c.front[locale]} →</text>

            {(["cervical", "thoracic", "lumbar", "sacral", "coccyx"] as const).map((region) => {
              const { top, bottom } = regionExtent(region);
              return (
                <g key={region} aria-hidden="true">
                  <line x1="190" x2="190" y1={top + 1} y2={bottom - 1} stroke={FILL[region]} strokeWidth="3" strokeLinecap="round" />
                  <text x="196" y={(top + bottom) / 2 + 3} fontSize="9" fill="rgb(var(--ink-2))">
                    {c.short[region][locale]}
                  </text>
                </g>
              );
            })}

            {PLACED.map((p) => {
              const sel: Selection = { kind: "vertebra", id: p.id };
              const active = selection.kind === "vertebra" && selection.id === p.id;
              const label = p.id === "sacrum" ? c.short.sacral[locale] : p.id === "coccyx" ? c.short.coccyx[locale] : vertebraLabel(p.id, locale);
              return (
                <g key={p.id}>
                  <line
                    x1={p.region === "sacral" || p.region === "coccyx" ? 40 : 30}
                    x2={p.x - p.w / 2 - p.spine - 4}
                    y1={p.y}
                    y2={p.y}
                    stroke="rgb(var(--line))"
                    strokeWidth="0.6"
                    aria-hidden="true"
                  />
                  <text
                    x={p.region === "sacral" || p.region === "coccyx" ? 38 : 28}
                    y={p.y + 3}
                    fontSize={p.region === "cervical" ? 8 : 9}
                    textAnchor="end"
                    fill={active ? "rgb(var(--accent))" : "rgb(var(--ink-2))"}
                    fontWeight={active ? 700 : 400}
                    aria-hidden="true"
                  >
                    {p.region === "sacral" || p.region === "coccyx" ? "" : label}
                  </text>
                  <g
                    className="tap"
                    transform={`translate(${p.x} ${p.y}) rotate(${p.angle})`}
                    role="button"
                    tabIndex={0}
                    aria-label={label}
                    aria-pressed={active}
                    onClick={activate(sel)}
                    onKeyDown={onKey(sel)}
                  >
                    <VertebraShape p={p} active={active} />
                  </g>
                </g>
              );
            })}

            {ROOT_MARKS.map((m) => {
              const sel: Selection = { kind: "root", id: m.rootId };
              const on = highlightedRoots.has(m.rootId);
              return (
                <g
                  key={m.rootId}
                  className="tap"
                  role="button"
                  tabIndex={0}
                  aria-label={fill(c.rootTitle[locale], { root: m.rootId })}
                  aria-pressed={selection.kind === "root" && selection.id === m.rootId}
                  onClick={activate(sel)}
                  onKeyDown={onKey(sel)}
                >
                  <circle cx={m.x} cy={m.y} r="7" fill="transparent" />
                  <circle
                    cx={m.x}
                    cy={m.y}
                    r={on ? 3.6 : 2.4}
                    fill={on ? "rgb(var(--accent))" : "rgb(var(--ink-3))"}
                    stroke="rgb(var(--surface))"
                    strokeWidth="1"
                  />
                </g>
              );
            })}
          </svg>
          <p className="flex items-center gap-2 px-2 pb-1 text-xs text-ink-3">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
            {c.rootDot[locale]}
          </p>
        </div>
      </div>

      <div aria-live="polite">
        {selection.kind === "vertebra" ? (
          <VertebraPanel id={selection.id} locale={locale} onRoot={(id) => setSelection({ kind: "root", id })} />
        ) : (
          <RootPanel id={selection.id} locale={locale} onVertebra={(id) => setSelection({ kind: "vertebra", id })} />
        )}
      </div>
    </div>
  );
}

function VertebraShape({ p, active }: { p: Placed; active: boolean }) {
  const stroke = active ? "rgb(var(--accent))" : "rgb(var(--surface))";
  const strokeWidth = active ? 2.2 : 0.8;
  if (p.id === "sacrum") {
    const w = p.w;
    const h = p.h;
    return (
      <path
        d={`M${-w / 2} ${-h / 2} L${w / 2} ${-h / 2} Q${w * 0.42} ${h * 0.1} ${w * 0.16} ${h / 2} L${-w * 0.2} ${h / 2} Q${-w * 0.5} ${h * 0.05} ${-w / 2} ${-h / 2} Z`}
        fill={FILL.sacral}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    );
  }
  if (p.id === "coccyx") {
    return (
      <path
        d={`M${-p.w / 2} ${-p.h / 2} L${p.w / 2} ${-p.h / 2} L${p.w * 0.1} ${p.h / 2} Z`}
        fill={FILL.coccyx}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    );
  }
  const { w, h, spine, drop } = p;
  const back = -w / 2;
  const process = `M${back} ${-h * 0.32} L${back - 4} ${-h * 0.28} L${back - 4 - spine} ${-h * 0.05 + drop} L${back - 4 - spine + 1} ${h * 0.32 + drop} L${back - 4} ${h * 0.34} L${back} ${h * 0.3} Z`;
  return (
    <>
      <path d={process} fill={FILL[p.region]} opacity={0.72} stroke={stroke} strokeWidth={strokeWidth * 0.8} strokeLinejoin="round" />
      <rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        rx={Math.min(3.5, h / 3)}
        fill={FILL[p.region]}
        opacity={p.id === "C1" ? 0.75 : 1}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </>
  );
}

/** A quiet skull profile, facing front, so the neck has something to hold up. */
function Skull() {
  const c1 = PLACED[0]!;
  const x = c1.x + 4;
  const y = c1.y - 40;
  const d = [
    `M${x - 30} ${y + 30}`,
    `C${x - 52} ${y + 6} ${x - 44} ${y - 46} ${x + 4} ${y - 52}`,
    `C${x + 46} ${y - 56} ${x + 70} ${y - 26} ${x + 66} ${y + 2}`,
    `L${x + 72} ${y + 16} L${x + 64} ${y + 22} L${x + 68} ${y + 34}`,
    `L${x + 60} ${y + 48} L${x + 42} ${y + 52} L${x + 30} ${y + 50}`,
    `L${x + 26} ${y + 30} L${x - 2} ${y + 28} Z`
  ].join(" ");
  return (
    <g aria-hidden="true">
      <path d={d} fill="rgb(var(--raised))" stroke="rgb(var(--line))" strokeWidth="1.2" strokeLinejoin="round" />
      <ellipse cx={x + 40} cy={y + 2} rx="9" ry="7" fill="rgb(var(--line))" opacity="0.7" />
    </g>
  );
}

function RootChip({ root, locale, onClick }: { root: Root; locale: Locale; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-accent px-3 py-1 text-sm font-semibold text-accent hover:bg-accent hover:text-accent-ink"
    >
      {fill(COPY.spine.rootTitle[locale], { root: vertebraLabel(root.id, locale) })}
    </button>
  );
}

function VertebraPanel({ id, locale, onRoot }: { id: string; locale: Locale; onRoot: (id: string) => void }) {
  const c = COPY.spine;
  const v = vertebraById(id);
  if (!v) return <p className="text-ink-2">{c.pick[locale]}</p>;
  const info = REGION_INFO[v.region];
  const above = rootsExitingAbove(id);
  const below = rootsExitingBelow(id);
  const next = nextVertebra(id);
  const discRoot = next ? rootForDisc(id, next.id) : undefined;
  const autonomic = autonomicFor(id);
  const title = id === "sacrum" ? c.short.sacral[locale] : id === "coccyx" ? c.short.coccyx[locale] : vertebraLabel(id, locale);

  return (
    <article className="space-y-5 rounded-2xl border border-line bg-surface p-5">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-3">{info.name[locale]}</p>
        <h2 className="mt-1 text-3xl font-semibold">
          {title}
          {v.name && <span className="ml-2 text-xl font-normal text-ink-2">{v.name[locale]}</span>}
        </h2>
        <p className="mt-1 text-sm text-ink-2">
          {info.count[locale]} · {info.curve[locale]}
        </p>
      </header>

      <section>
        <h3 className="mb-2 font-semibold">{c.facts[locale]}</h3>
        <ul className="list-disc space-y-1.5 pl-5 text-ink-2">
          {v.facts.map((f, i) => (
            <li key={i}>{f[locale]}</li>
          ))}
        </ul>
      </section>

      {(above.length > 0 || below.length > 0) && (
        <section>
          <h3 className="mb-2 font-semibold">{c.rootsHere[locale]}</h3>
          <dl className="grid gap-3 sm:grid-cols-2">
            {above.length > 0 && (
              <div>
                <dt className="mb-1 text-sm text-ink-3">{c.leavesAbove[locale]}</dt>
                <dd className="flex flex-wrap gap-2">
                  {above.map((r) => (
                    <RootChip key={r.id} root={r} locale={locale} onClick={() => onRoot(r.id)} />
                  ))}
                </dd>
              </div>
            )}
            {below.length > 0 && (
              <div>
                <dt className="mb-1 text-sm text-ink-3">{c.leavesBelow[locale]}</dt>
                <dd className="flex flex-wrap gap-2">
                  {below.map((r) => (
                    <RootChip key={r.id} root={r} locale={locale} onClick={() => onRoot(r.id)} />
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </section>
      )}

      {next && discRoot && (
        <p className="rounded-lg bg-raised px-3 py-2 text-sm">
          <span className="font-semibold">
            {c.discBelow[locale]} {vertebraLabel(id, locale)}-{next.id === "sacrum" ? "S1" : vertebraLabel(next.id, locale)}
          </span>
          : {fill(c.discAffects[locale], { root: discRoot })}
        </p>
      )}

      {autonomic.length > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold">{c.autonomic[locale]}</h3>
          {autonomic.map((a, i) => (
            <div key={i} className="rounded-lg border border-line p-3 text-sm">
              <p className="font-medium">{a.system === "sympathetic" ? c.sympathetic[locale] : c.parasympathetic[locale]}</p>
              <p className="text-ink-2">{a.via[locale]}</p>
              <p className="mt-1">{a.targets[locale]}</p>
            </div>
          ))}
          <Callout tone="info">
            {c.wiringCaveat[locale]}{" "}
            <Link className="underline underline-offset-2" href={`${href(locale, "what-works")}#non-msk`}>
              {COPY.nav.evidence[locale]}
            </Link>
          </Callout>
        </section>
      )}
    </article>
  );
}

function RootPanel({ id, locale, onVertebra }: { id: string; locale: Locale; onVertebra: (id: string) => void }) {
  const c = COPY.spine;
  const root = rootById(id);
  if (!root) return <p className="text-ink-2">{c.pick[locale]}</p>;
  const name = (v: string) => (v === "skull" ? c.skull[locale] : v === "sacrum" ? c.sacrumName[locale] : vertebraLabel(v, locale));
  const exits =
    root.region === "sacral" ? c.sacralExit[locale] : fill(c.exitsBetween[locale], { a: name(root.exitAfter), b: name(root.exitBefore) });
  const areas = REGIONS.filter((r) => r.roots.some(([rid, w]) => rid === id && w >= 1));
  const home = root.exitAfter === "skull" ? "C1" : root.region === "sacral" ? "sacrum" : root.exitAfter;

  return (
    <article className="space-y-5 rounded-2xl border border-line bg-surface p-5">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-3">{REGION_INFO[root.region].name[locale]}</p>
        <h2 className="mt-1 text-3xl font-semibold">{fill(c.rootTitle[locale], { root: vertebraLabel(root.id, locale) })}</h2>
        <p className="mt-1 text-ink-2">{exits}</p>
      </header>
      <dl className="grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-ink-3">{c.sensory[locale]}</dt>
          <dd className="mt-0.5">{root.sensory[locale]}</dd>
        </div>
        <div>
          <dt className="text-sm text-ink-3">{c.motor[locale]}</dt>
          <dd className="mt-0.5">{root.motor[locale]}</dd>
        </div>
        <div>
          <dt className="text-sm text-ink-3">{c.reflex[locale]}</dt>
          <dd className="mt-0.5">{root.reflex ? root.reflex[locale] : c.noReflex[locale]}</dd>
        </div>
        {root.typicalDisc && (
          <div>
            <dt className="text-sm text-ink-3">{c.typicalDisc[locale]}</dt>
            <dd className="mt-0.5">{root.typicalDisc[locale]}</dd>
          </div>
        )}
      </dl>
      <RootTerritory rootId={root.id} locale={locale} />
      {root.note && <Callout tone="info">{root.note[locale]}</Callout>}
      {areas.length > 0 && (
        <section>
          <h3 className="mb-2 font-semibold">{c.areas[locale]}</h3>
          <ul className="flex flex-wrap gap-2">
            {areas.map((a) => (
              <li key={a.id} className="rounded-full bg-raised px-3 py-1 text-sm">
                {a.label[locale]}
              </li>
            ))}
          </ul>
        </section>
      )}
      <div className="flex flex-wrap gap-3">
        <Link className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink" href={href(locale, "map")}>
          {c.openMap[locale]}
        </Link>
        <button type="button" onClick={() => onVertebra(home)} className="rounded-full border border-line px-4 py-2 text-sm">
          {fill(c.backToVertebra[locale], {
            v: home === "sacrum" ? c.short.sacral[locale] : vertebraLabel(home, locale)
          })}
        </button>
      </div>
    </article>
  );
}
