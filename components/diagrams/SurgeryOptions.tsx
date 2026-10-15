"use client";

import { useState } from "react";
import { SourceList } from "@/components/ui/SourceList";
import { SideView, STATE_STYLE } from "@/components/vertebra/SideView";
import { AXIAL, COMPARE_ROWS, SURGERY_COPY, SURGERY_OPTIONS, surgeryOpening, type AxialId, type SurgeryOption } from "@/lib/diagrams/surgery";
import type { Locale } from "@/lib/i18n";
import { opening, ROOM_LABEL } from "@/lib/vertebra";
import { Choice } from "./Choice";

const MUSCLE = "rgb(var(--muscle) / 0.35)";
const BONE = "rgb(var(--bone))";
const EDGE = "rgb(var(--ink-3) / 0.7)";

/**
 * The neck in cross-section at the level of the trapped root's disc, front at
 * the top and the person's right on the viewer's left, as scans show it. The
 * chosen operation draws its route in and what it changes: the disc swapped
 * for a spacer or an artificial disc from the front, or a bite taken out of
 * the facet joint from the back.
 */
function AxialView({ option, picked, onPick, locale }: { option: SurgeryOption; picked: AxialId; onPick: (id: AxialId) => void; locale: Locale }) {
  const c = SURGERY_COPY;
  const info = SURGERY_OPTIONS.find((x) => x.id === option)!;
  const fromFront = info.route === "front";
  const fromBack = info.route === "back";
  const trapped = option === "wait";

  return (
    <svg viewBox="0 0 300 250" className="mx-auto block h-auto w-full max-w-[460px]" role="img" aria-label={`${c.aboveFigure[locale]}: ${info.name[locale]}`}>
      <defs>
        <pattern id="cage-hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="4" height="4" fill="rgb(var(--ink-3) / 0.25)" />
          <rect width="1.4" height="4" fill="rgb(var(--ink-2))" />
        </pattern>
        <marker id="route-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10Z" fill="rgb(var(--accent))" />
        </marker>
      </defs>
      {/* Skin outline of the neck */}
      <path d="M150 14C200 14 254 40 264 96C272 144 250 196 210 222C190 234 170 240 150 240C130 240 110 234 90 222C50 196 28 144 36 96C46 40 100 14 150 14Z" fill="rgb(var(--ink-3) / 0.08)" stroke={EDGE} strokeWidth={1} />

      {/* Front of the neck */}
      <path d="M118 30Q150 20 182 30L182 37Q150 27 118 37Z" fill={MUSCLE} />
      <rect x={138} y={37} width={24} height={6} rx={3} fill="rgb(var(--cat-5) / 0.45)" />
      <ellipse cx={126} cy={58} rx={10} ry={15} fill="rgb(var(--cat-5) / 0.45)" />
      <ellipse cx={174} cy={58} rx={10} ry={15} fill="rgb(var(--cat-5) / 0.45)" />
      <circle cx={150} cy={52} r={14} fill="rgb(var(--surface))" stroke={EDGE} strokeWidth={0.8} />
      <path d="M140 62A14 14 0 1 1 160 62" fill="none" stroke={BONE} strokeWidth={3} strokeLinecap="round" />
      <ellipse cx={156} cy={82} rx={13} ry={8} fill={MUSCLE} stroke={EDGE} strokeWidth={0.6} />
      <path d="M150 82H162" stroke={EDGE} strokeWidth={0.8} />
      <g fill="rgb(var(--nerve))">
        <circle cx={138} cy={74} r={2.4} />
        <circle cx={169} cy={72} r={2.4} />
      </g>
      {/* The big side muscles and the carotid sheaths */}
      <g fill={MUSCLE}>
        <ellipse cx={66} cy={74} rx={22} ry={11} transform="rotate(35 66 74)" />
        <ellipse cx={234} cy={74} rx={22} ry={11} transform="rotate(-35 234 74)" />
      </g>
      {[0, 1].map((side) => (
        <g key={side} transform={side ? "translate(300 0) scale(-1 1)" : undefined}>
          <ellipse cx={91} cy={98} rx={20} ry={15} fill="none" stroke={EDGE} strokeWidth={0.7} strokeDasharray="2 2" />
          <circle cx={100} cy={92} r={7} fill="rgb(var(--bad) / 0.7)" />
          <circle cx={82} cy={98} r={8.5} fill="rgb(var(--parasymp) / 0.55)" />
          <circle cx={93} cy={106} r={2.5} fill="rgb(var(--nerve))" />
        </g>
      ))}
      {/* Longus colli on the front of the spine */}
      <g fill={MUSCLE}>
        <ellipse cx={130} cy={105} rx={10} ry={5} />
        <ellipse cx={170} cy={105} rx={10} ry={5} />
      </g>

      {/* The vertebra at the disc level: transverse processes with the vertebral arteries */}
      <g fill={BONE} stroke={EDGE} strokeWidth={0.8}>
        <rect x={84} y={114} width={28} height={20} rx={8} />
        <rect x={188} y={114} width={28} height={20} rx={8} />
      </g>
      <g fill="rgb(var(--bad) / 0.8)">
        <circle cx={98} cy={124} r={5} />
        <circle cx={202} cy={124} r={5} />
      </g>
      {/* The disc, or what replaced it */}
      {fromFront ? (
        option === "acdf" ? (
          <g>
            <ellipse cx={150} cy={124} rx={32} ry={17} fill="rgb(var(--ink-3) / 0.12)" stroke={EDGE} strokeWidth={0.8} strokeDasharray="3 2" />
            <rect x={132} y={113} width={36} height={22} rx={3} fill="url(#cage-hatch)" stroke="rgb(var(--ink-2))" strokeWidth={1} />
          </g>
        ) : (
          <g>
            <ellipse cx={150} cy={124} rx={32} ry={17} fill="rgb(var(--ink-3) / 0.12)" stroke={EDGE} strokeWidth={0.8} strokeDasharray="3 2" />
            <ellipse cx={150} cy={124} rx={26} ry={13} fill="rgb(var(--ink-3) / 0.3)" stroke="rgb(var(--ink-2))" strokeWidth={1} />
            <ellipse cx={150} cy={124} rx={11} ry={6} fill="rgb(var(--surface))" stroke="rgb(var(--ink-2))" strokeWidth={1} />
          </g>
        )
      ) : (
        <g>
          <ellipse cx={150} cy={124} rx={32} ry={17} fill="rgb(var(--disc) / 0.45)" stroke={EDGE} strokeWidth={0.8} />
          <ellipse cx={150} cy={124} rx={14} ry={8} fill="rgb(var(--disc) / 0.85)" />
          <ellipse cx={125} cy={138} rx={10} ry={7} fill="rgb(var(--disc) / 0.9)" stroke={EDGE} strokeWidth={0.6} />
        </g>
      )}

      {/* The arch behind the cord: pedicles, laminae and the spinous process */}
      <path
        d="M118 138C110 150 108 168 116 182C124 194 138 198 146 214L154 214C162 198 176 194 184 182C192 168 190 150 182 138L172 142C176 156 174 172 164 182C158 188 142 188 136 182C126 172 124 156 128 142Z"
        fill={BONE}
        stroke={EDGE}
        strokeWidth={0.8}
      />
      <ellipse cx={150} cy={160} rx={15} ry={10} fill="rgb(var(--nerve) / 0.3)" stroke="rgb(var(--nerve))" strokeWidth={1} />
      {/* Facet joints; a foraminotomy takes a bite from the person's right one */}
      <g fill={BONE} stroke={EDGE} strokeWidth={0.8}>
        <ellipse cx={106} cy={174} rx={11} ry={8} />
        <ellipse cx={194} cy={174} rx={11} ry={8} />
      </g>
      <g stroke={EDGE} strokeWidth={0.8}>
        <path d="M96 172Q106 168 116 174" fill="none" />
        <path d="M184 174Q194 168 204 172" fill="none" />
      </g>
      {fromBack && <path d="M100 166Q110 162 116 168L114 178Q106 176 100 166Z" fill="rgb(var(--surface))" stroke="rgb(var(--ink-2))" strokeWidth={1} strokeDasharray="2 1.5" />}
      {/* Nerve roots leaving through their openings; the person's right one is the trapped one */}
      <path d="M137 156C126 150 114 146 96 142" fill="none" stroke={trapped ? "rgb(var(--bad))" : "rgb(var(--nerve))"} strokeWidth={trapped ? 3 : 4} strokeLinecap="round" />
      <path d="M163 156C174 150 186 146 204 142" fill="none" stroke="rgb(var(--nerve))" strokeWidth={4} strokeLinecap="round" />

      {/* Back of the neck muscles */}
      <g fill={MUSCLE}>
        <ellipse cx={112} cy={212} rx={30} ry={13} />
        <ellipse cx={188} cy={212} rx={30} ry={13} />
      </g>

      {/* The route in */}
      {fromFront && <path d="M96 22C104 48 112 72 118 94C122 104 126 110 132 112" fill="none" stroke="rgb(var(--accent))" strokeWidth={2.5} strokeDasharray="5 3" markerEnd="url(#route-head)" />}
      {fromBack && <path d="M108 238C108 222 108 204 108 186" fill="none" stroke="rgb(var(--accent))" strokeWidth={2.5} strokeDasharray="5 3" markerEnd="url(#route-head)" />}

      {/* Numbered parts */}
      {AXIAL.map((x) => {
        const on = x.id === picked;
        return (
          <g key={x.id} onClick={() => onPick(x.id)} className="cursor-pointer">
            <title>{`${x.n}. ${x.name[locale]}`}</title>
            <circle cx={x.at[0]} cy={x.at[1]} r={6} fill={on ? "rgb(var(--ink))" : "rgb(var(--surface) / 0.94)"} stroke="rgb(var(--ink-3))" strokeWidth={0.6} />
            <text x={x.at[0]} y={x.at[1] + 2.3} textAnchor="middle" fontSize={6.5} fontWeight={700} fill={on ? "rgb(var(--surface))" : "rgb(var(--ink))"}>
              {x.n}
            </text>
          </g>
        );
      })}
      <g fontSize={8} fill="rgb(var(--ink-3))" letterSpacing="0.06em" textAnchor="middle" pointerEvents="none">
        <text x={150} y={9}>{c.front[locale].toUpperCase()}</text>
        <text x={150} y={249}>{c.back[locale].toUpperCase()}</text>
        <text x={14} y={124} transform="rotate(-90 14 124)">
          {c.personRight[locale]}
        </text>
      </g>
    </svg>
  );
}

export function SurgeryOptions({ locale }: { locale: Locale }) {
  const c = SURGERY_COPY;
  const [id, setId] = useState<SurgeryOption>("wait");
  const [part, setPart] = useState<AxialId>("root");
  const info = SURGERY_OPTIONS.find((x) => x.id === id)!;
  const o = surgeryOpening(id);
  const fromFront = info.route === "front";
  const p = AXIAL.find((x) => x.id === part)!;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
        <div className="min-w-0 space-y-3">
          <Choice label={c.option[locale]} value={id} onChange={setId} options={SURGERY_OPTIONS.map((x) => ({ id: x.id, name: x.name[locale] }))} />
          <SideView
            o={o}
            bulge={!fromFront}
            implant={id === "acdf" ? "cage" : id === "disc-replacement" ? "disc" : undefined}
            plate={id === "acdf"}
            removedFrom={id === "foraminotomy" ? opening("herniation", "neutral").back : undefined}
            label={`${c.figure[locale]}: ${info.name[locale]}`}
            locale={locale}
          />
        </div>
        <article className="min-w-0 space-y-3 rounded-2xl border border-line bg-surface p-5" aria-live="polite">
          <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${STATE_STYLE[o.state]}`}>{ROOM_LABEL[o.state][locale]}</span>
          <h4 className="text-lg font-semibold">{info.name[locale]}</h4>
          <p className="leading-relaxed text-ink-2">{info.what[locale]}</p>
          <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-sm">
            <dt className="text-ink-3">{c.approach[locale]}</dt>
            <dd>{info.approach[locale]}</dd>
            <dt className="text-ink-3">{c.removed[locale]}</dt>
            <dd>{info.removed[locale]}</dd>
            <dt className="text-ink-3">{c.implant[locale]}</dt>
            <dd>{info.implant[locale]}</dd>
            <dt className="text-ink-3">{c.keeps[locale]}</dt>
            <dd>{info.keeps[locale]}</dd>
          </dl>
          <p className="border-t border-line pt-3 text-sm text-ink-3">{c.ask[locale]}</p>
          <SourceList ids={info.sources} locale={locale} />
        </article>
      </div>

      <section aria-labelledby="surgery-above" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
        <figure className="m-0 min-w-0 rounded-2xl border border-line bg-surface p-3">
          <h4 id="surgery-above" className="mb-2 px-1 text-sm font-semibold">
            {c.above[locale]}
          </h4>
          <AxialView option={id} picked={part} onPick={setPart} locale={locale} />
          <figcaption className="mt-2 px-1 text-xs text-ink-3">{c.tapPart[locale]}</figcaption>
        </figure>
        <div className="min-w-0 space-y-3">
          <article className="space-y-2 rounded-2xl border border-line bg-surface p-4" aria-live="polite">
            <div className="flex items-start gap-3">
              <span className="tnum flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-bg">{p.n}</span>
              <h5 className="font-semibold">{p.name[locale]}</h5>
            </div>
            <p className="text-sm leading-relaxed text-ink-2">{p.note[locale]}</p>
            <SourceList ids={p.sources} locale={locale} />
          </article>
          <ol className="grid gap-x-3 gap-y-0.5 rounded-2xl border border-line bg-surface p-3 sm:grid-cols-2" aria-label={c.tapPart[locale]}>
            {AXIAL.map((x) => (
              <li key={x.id}>
                <button
                  type="button"
                  aria-pressed={x.id === part}
                  onClick={() => setPart(x.id)}
                  className={`flex w-full items-baseline gap-2 rounded-md px-1.5 py-0.5 text-left text-sm ${x.id === part ? "bg-ink text-bg" : "hover:bg-raised"}`}
                >
                  <span className="tnum w-5 shrink-0 text-right text-xs font-bold">{x.n}</span>
                  <span>{x.name[locale]}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="surgery-compare" className="min-w-0">
        <h4 id="surgery-compare" className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-3">
          {c.compare[locale]}
        </h4>
        <div className="relative overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full min-w-[620px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="w-28 p-2" />
                {SURGERY_OPTIONS.map((x) => (
                  <th key={x.id} scope="col" className={`p-2 align-bottom text-xs font-semibold ${x.id === id ? "bg-raised" : ""}`}>
                    {x.name[locale]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((r) => (
                <tr key={r} className="border-b border-line last:border-0">
                  <th scope="row" className="p-2 text-xs font-medium text-ink-2">
                    {r === "approach" ? c.approach[locale] : r === "removed" ? c.removed[locale] : r === "implant" ? c.implant[locale] : c.keeps[locale]}
                  </th>
                  {SURGERY_OPTIONS.map((x) => (
                    <td key={x.id} className={`p-2 text-xs ${x.id === id ? "bg-raised" : ""}`}>
                      {x[r][locale]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
