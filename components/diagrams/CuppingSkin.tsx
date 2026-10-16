"use client";

import { useState } from "react";
import { SourceList } from "@/components/ui/SourceList";
import { fill } from "@/lib/copy";
import {
  bruising,
  CUP_SITES,
  CUPPING_COPY,
  CUPPING_SOURCES,
  DAYS_MAX,
  MARK_LEVELS,
  MARK_NAME,
  MARK_TEXT,
  markLevel,
  markStrength,
  MINUTES,
  type CupSiteId,
  type MarkLevel,
  type Suction
} from "@/lib/diagrams/cupping";
import type { Locale } from "@/lib/i18n";
import { Choice } from "./Choice";
import { HALO } from "./shapes";

/* ---------- The slice through the skin under one cup ---------- */

/** The cup spans x=140..340; layers are flat outside it and lift inside it. */
const CUP = { from: 140, to: 340 } as const;
const W = 380;
const H = 230;
/** 0 outside the cup, rising smoothly to 1 across its middle. */
function liftAt(x: number): number {
  const edge = 46;
  const t = x < CUP.from || x > CUP.to ? 0 : Math.min(x - CUP.from, CUP.to - x) / edge;
  const u = Math.max(0, Math.min(1, t));
  return u * u * (3 - 2 * u);
}
/** The top of a layer that sits at y0 on flat skin and rises by `lift` under the cup. */
function surface(y0: number, lift: number): string {
  const pts: string[] = [];
  for (let x = 0; x <= W; x += 5) pts.push(`${x} ${(y0 - lift * liftAt(x)).toFixed(1)}`);
  return `M${pts.join("L")}`;
}
const below = (y0: number, lift: number) => `${surface(y0, lift)}V${H}H0Z`;
/** How much each layer rises, as a share of the skin's lift: the skin most, the muscle not at all. */
const LAYERS = [
  { key: "epidermis", y: 108, share: 1, fill: "rgb(var(--bone))" },
  { key: "dermis", y: 112, share: 1, fill: "rgb(var(--muscle) / 0.14)" },
  { key: "fat", y: 134, share: 0.6, fill: "rgb(var(--lumbar) / 0.4)" },
  { key: "fascia", y: 158, share: 0.2, fill: "rgb(var(--ink-3) / 0.35)" },
  { key: "muscle", y: 165, share: 0.1, fill: "rgb(var(--muscle) / 0.38)" }
] as const;
const LIFT: Record<Suction, number> = { light: 14, medium: 24, strong: 34 };
/** Vessel positions in the inner skin, fixed so the picture doesn't jump about. */
const VESSELS = [154, 172, 190, 208, 226, 244, 262, 280, 298, 316].map((x, i) => ({ x, dy: (i % 3) * 6 }));

/* ---------- The back, for the marks ---------- */

const TORSO = "M134 0C134 22 130 34 120 40C100 48 72 50 56 58C44 64 40 78 40 94L48 200C50 230 56 262 62 300H238C244 262 250 230 252 200L260 94C260 78 256 64 244 58C228 50 200 48 180 40C170 34 166 22 166 0Z";
const BLADE = "M186 58C200 59 214 60 226 62L240 80C228 100 216 118 204 136C192 116 184 98 186 58Z";
const MIRROR = "translate(300 0) scale(-1 1)";

/** A mark's colour at a given strength (1 just off, 0 faded). */
function markFill(level: MarkLevel, strength: number): string {
  if (level === "none" || strength <= 0) return "transparent";
  if (level === "pink") return `rgb(var(--bad) / ${(0.25 * strength).toFixed(3)})`;
  if (level === "red") return `rgb(var(--bad) / ${(0.55 * strength).toFixed(3)})`;
  return `rgb(var(--bruise) / ${(0.75 * strength).toFixed(3)})`;
}

export function CuppingSkin({ locale }: { locale: Locale }) {
  const c = CUPPING_COPY;
  const [suction, setSuction] = useState<Suction>("medium");
  const [minutes, setMinutes] = useState(5);
  const [wet, setWet] = useState(false);
  const [days, setDays] = useState(0);
  const [cups, setCups] = useState<ReadonlySet<CupSiteId>>(new Set(["upper-back", "blades", "mid-back"]));
  const [focus, setFocus] = useState<CupSiteId>("upper-back");
  const b = bruising(suction, minutes);
  const level = markLevel(b);
  const strength = markStrength(level, days);
  const broken = Math.round(b * VESSELS.length);
  const lift = LIFT[suction];
  const focused = CUP_SITES.find((s) => s.id === focus)!;

  const toggle = (id: CupSiteId) => {
    setFocus(id);
    setCups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <div className="min-w-0 space-y-3">
        <Choice label={c.suction[locale]} value={suction} onChange={setSuction} options={(["light", "medium", "strong"] as const).map((id) => ({ id, name: c.suctions[id][locale] }))} />
        <label className="tnum block text-sm font-medium">
          {fill(c.minutes[locale], { n: minutes })}
          <input type="range" min={MINUTES.min} max={MINUTES.max} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className="mt-1 block w-full accent-accent" />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="h-4 w-4 accent-accent" checked={wet} onChange={(e) => setWet(e.target.checked)} />
          {c.wet[locale]}
        </label>
        <figure className="m-0 rounded-2xl border border-line bg-surface p-3">
          <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={`${c.figure[locale]}: ${MARK_TEXT[level][locale]}`}>
            <defs>
              <clipPath id="cup-dermis">
                <path d={below(LAYERS[1].y, lift)} />
              </clipPath>
            </defs>
            {LAYERS.map((l, i) => (
              <g key={l.key}>
                <path d={below(l.y, lift * l.share)} fill={l.fill} stroke={l.key === "epidermis" ? "rgb(var(--ink-3))" : "rgb(var(--ink-3) / 0.25)"} strokeWidth={l.key === "epidermis" ? 1 : 0.6} />
                {/* The mark: blood that has leaked into the inner skin under the cup, kept inside that layer */}
                {i === 1 && level !== "none" && <ellipse cx={240} cy={112 - lift * 0.7} rx={88} ry={14 + lift / 3} fill={markFill(level, 1)} clipPath="url(#cup-dermis)" />}
              </g>
            ))}
            {VESSELS.map((v, i) => {
              const y = 120 + v.dy - lift * liftAt(v.x);
              const isBroken = i >= (VESSELS.length - broken) / 2 && i < (VESSELS.length + broken) / 2;
              return isBroken ? (
                <g key={v.x} fill="rgb(var(--bad))">
                  <circle cx={v.x} cy={y} r={2} />
                  <circle cx={v.x + 4} cy={y - 3} r={1.3} />
                  <circle cx={v.x - 3} cy={y + 3} r={1.3} />
                </g>
              ) : (
                <ellipse key={v.x} cx={v.x} cy={y} rx={6} ry={2.2} fill="none" stroke="rgb(var(--bad))" strokeWidth={1.3} />
              );
            })}
            {/* Vessels outside the cup stay whole */}
            {[78, 104, 126].map((x, i) => (
              <ellipse key={x} cx={x} cy={120 + (i % 2) * 6} rx={6} ry={2.2} fill="none" stroke="rgb(var(--bad) / 0.7)" strokeWidth={1.2} />
            ))}

            {wet && (
              <g stroke="rgb(var(--bad))" strokeWidth={1.6}>
                {[208, 228, 252, 272].map((x) => (
                  <path key={x} d={`M${x} ${108 - lift + 2}v8`} />
                ))}
                <ellipse cx={240} cy={108 - lift - 6} rx={34} ry={5} fill="rgb(var(--bad) / 0.6)" stroke="none" />
              </g>
            )}

            {/* The cup */}
            <path
              d={`M${CUP.from - 4} 108V${58 - lift}Q${CUP.from - 4} ${40 - lift} ${CUP.from + 16} ${40 - lift}H${CUP.to - 16}Q${CUP.to + 4} ${40 - lift} ${CUP.to + 4} ${58 - lift}V108`}
              fill="rgb(var(--parasymp) / 0.08)"
              stroke="rgb(var(--ink-2))"
              strokeWidth={2}
            />
            <text x={CUP.to - 6} y={56 - lift} textAnchor="end" fontSize={9} {...HALO} fill="rgb(var(--ink-3))">
              {c.cup[locale]}
            </text>
            {broken > 0 && (
              <g>
                <path d={`M240 ${86 - lift}V${112 - lift}`} stroke="rgb(var(--ink-3))" strokeWidth={0.6} />
                <text x={240} y={82 - lift} textAnchor="middle" fontSize={9} {...HALO}>
                  {level === "purple" ? c.bruise[locale] : c.petechiae[locale]}
                </text>
              </g>
            )}

            {/* Layer names on the flat skin beside the cup */}
            <g fontSize={8.5} {...HALO} fill="rgb(var(--ink-2))">
              <text x={4} y={104}>{c.epidermis[locale]}</text>
              <text x={4} y={126}>{c.dermis[locale]}</text>
              <text x={4} y={150}>{c.fat[locale]}</text>
              <text x={4} y={164}>{c.fascia[locale]}</text>
              <text x={4} y={200}>{c.muscle[locale]}</text>
            </g>
          </svg>
        </figure>
        <div className="rounded-2xl border border-line bg-surface p-4 text-sm" aria-live="polite">
          <p className="leading-relaxed">{MARK_TEXT[level][locale]}</p>
          <p className="mt-2 text-ink-2">{c.toxins[locale]}</p>
          {wet && <p className="mt-2 rounded-xl border-l-4 border-warn bg-warn/5 p-3">{c.wetNote[locale]}</p>}
        </div>
      </div>

      <div className="min-w-0 space-y-4">
        <section className="space-y-3 rounded-2xl border border-line bg-surface p-4" aria-labelledby="cup-after">
          <h4 id="cup-after" className="font-semibold">
            {c.after[locale]}
          </h4>
          <label className="tnum block text-sm font-medium">
            {days === 0 ? c.justOff[locale] : fill(c.days[locale], { n: days })}
            <input type="range" min={0} max={DAYS_MAX} value={days} onChange={(e) => setDays(Number(e.target.value))} className="mt-1 block w-full accent-accent" />
          </label>
          <svg viewBox="0 0 300 300" className="mx-auto block h-auto w-full max-w-[360px]" role="img" aria-label={`${c.back[locale]}: ${MARK_NAME[strength > 0 ? level : "none"][locale]}`}>
            <path d={TORSO} fill="rgb(var(--muscle) / 0.1)" stroke="rgb(var(--ink-3) / 0.4)" strokeWidth={0.8} />
            <g fill="none" stroke="rgb(var(--ink-3) / 0.45)" strokeWidth={0.8} strokeDasharray="2 2">
              <path d={BLADE} />
              <path d={BLADE} transform={MIRROR} />
            </g>
            {Array.from({ length: 21 }, (_, i) => (
              <rect key={i} x={147.5} y={46 + i * 12} width={5} height={5} rx={1.2} fill="rgb(var(--ink-3) / 0.4)" />
            ))}
            {CUP_SITES.map((s) =>
              [s.at[0], 300 - s.at[0]].map((x) => {
                const on = cups.has(s.id);
                return (
                  <g key={`${s.id}-${x}`} onClick={() => toggle(s.id)} className="cursor-pointer">
                    <title>{s.name[locale]}</title>
                    <circle cx={x} cy={s.at[1]} r={16} fill="transparent" />
                    {on ? (
                      <>
                        <circle cx={x} cy={s.at[1]} r={13} fill={markFill(level, strength)} />
                        {days === 0 && <circle cx={x} cy={s.at[1]} r={13} fill="none" stroke="rgb(var(--ink-3) / 0.6)" strokeWidth={1} />}
                      </>
                    ) : (
                      <g stroke="rgb(var(--ink-3) / 0.7)" strokeWidth={0.8} fill="none">
                        <circle cx={x} cy={s.at[1]} r={13} strokeDasharray="3 2" />
                        <path d={`M${x - 4} ${s.at[1]}h8M${x} ${s.at[1] - 4}v8`} />
                      </g>
                    )}
                    {s.id === focus && <circle cx={x} cy={s.at[1]} r={16} fill="none" stroke="rgb(var(--accent))" strokeWidth={1.5} />}
                  </g>
                );
              })
            )}
          </svg>
          <p className="text-xs text-ink-3">{c.sitesHint[locale]}</p>
          <ul className="flex flex-wrap gap-2" aria-label={c.back[locale]}>
            {CUP_SITES.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  aria-pressed={cups.has(s.id)}
                  onClick={() => toggle(s.id)}
                  className={`rounded-full border px-3 py-1 text-sm ${cups.has(s.id) ? "border-accent bg-accent text-white" : "border-line bg-surface hover:border-accent"}`}
                >
                  {s.name[locale]}
                </button>
              </li>
            ))}
          </ul>
          <p className="rounded-xl bg-raised p-3 text-sm">
            <span className="font-semibold">{focused.name[locale]}.</span> {c.under[locale]}: {focused.under[locale]}
          </p>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-3">{c.scale[locale]}</p>
            <ol className="grid grid-cols-4 gap-1.5">
              {MARK_LEVELS.map((m) => (
                <li key={m} aria-current={m === level ? "true" : undefined} className={`rounded-lg border p-1.5 text-center text-xs ${m === level ? "border-ink font-semibold" : "border-line text-ink-2"}`}>
                  <span className="mx-auto mb-1 block h-6 w-6 rounded-full border border-line" style={{ background: m === "none" ? "rgb(var(--muscle) / 0.1)" : markFill(m, 1) }} aria-hidden="true" />
                  {MARK_NAME[m][locale]}
                </li>
              ))}
            </ol>
            <p className="mt-2 text-xs text-ink-3">{c.fadeNote[locale]}</p>
          </div>
        </section>
        <p className="rounded-xl bg-raised p-3 text-sm">{c.evidence[locale]}</p>
        <SourceList ids={CUPPING_SOURCES} locale={locale} />
      </div>
    </div>
  );
}
