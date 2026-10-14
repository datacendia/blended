"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Callout } from "@/components/ui/Callout";
import { SourceList } from "@/components/ui/SourceList";
import { COPY, fill } from "@/lib/copy";
import { formatNumber, type Locale } from "@/lib/i18n";
import { href } from "@/lib/nav";
import {
  averagingChecks,
  compareScans,
  FRONTAL_SEGMENTS,
  headWeightRatio,
  LATERAL_SEGMENTS,
  noiseFloor,
  pairChecks,
  SAMPLE_SCAN,
  SEGMENT_LABEL,
  SEGMENT_MEANING,
  signedSideMean,
  viewTotal,
  type Agreement,
  type Reading,
  type Scan
} from "@/lib/posture";
import { newId, saveScans } from "@/lib/storage";
import { useScans, useToday } from "../useStored";

const BLANK_READING: Reading = { t: null, a: null };

function blankScan(today: string): Scan {
  const lateral = { head: BLANK_READING, shoulder: BLANK_READING, hip: BLANK_READING, knee: BLANK_READING };
  const frontal = { head: BLANK_READING, shoulder: BLANK_READING, ribcage: BLANK_READING, hip: BLANK_READING };
  return { id: newId(), date: today, right: lateral, left: lateral, anterior: frontal, posterior: frontal, printedAverage: {}, effectiveHeadKg: null, baselineHeadKg: null };
}

type ViewKey = "right" | "left" | "anterior" | "posterior";

const BADGE: Record<Agreement, string> = {
  good: "bg-good/15 text-good",
  fair: "bg-warn/15 text-warn",
  poor: "bg-bad/15 text-bad"
};

export function ReportDecoder({ locale }: { locale: Locale }) {
  const c = COPY.report;
  const [scan, setScan] = useState<Scan>(SAMPLE_SCAN);
  const saved = useScans();
  const today = useToday();

  const isSample = scan.id === SAMPLE_SCAN.id;
  const pairs = useMemo(() => pairChecks(scan), [scan]);
  const noise = useMemo(() => noiseFloor(scan), [scan]);
  const averaging = useMemo(() => averagingChecks(scan), [scan]);
  const ratio = headWeightRatio(scan);
  const rightTotal = viewTotal(scan.right);
  const leftTotal = viewTotal(scan.left);
  const totalsPct =
    Math.max(rightTotal.t, leftTotal.t) > 0
      ? Math.round((Math.abs(rightTotal.t - leftTotal.t) / Math.max(rightTotal.t, leftTotal.t)) * 100)
      : null;

  const n = (v: number, digits = 2) => formatNumber(v, locale, digits);
  const lateralWord = (v: number) => (v >= 0 ? c.forward[locale] : c.backward[locale]);
  const frontalWord = (v: number) => (v >= 0 ? c.toRight[locale] : c.toLeft[locale]);
  const describe = (v: number, pair: "lateral" | "frontal") =>
    `${n(Math.abs(v))} cm ${pair === "lateral" ? lateralWord(v) : frontalWord(v)}`;

  const setReading = (view: ViewKey, segment: string, field: "t" | "a", value: number | null) =>
    setScan((prev) => ({
      ...prev,
      id: prev.id === SAMPLE_SCAN.id ? newId() : prev.id,
      [view]: { ...prev[view], [segment]: { ...(prev[view] as Record<string, Reading>)[segment], [field]: value } }
    }));

  const persist = (next: Scan[]) => saveScans(next);

  const ordered = [...saved].sort((a, b) => a.date.localeCompare(b.date));
  const comparison = ordered.length >= 2 ? compareScans(ordered[0]!, ordered[ordered.length - 1]!) : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setScan(SAMPLE_SCAN)}
          className={`rounded-full px-4 py-2 text-sm font-medium ${isSample ? "bg-accent text-accent-ink" : "border border-line bg-surface"}`}
        >
          {c.loadSample[locale]}
        </button>
        <button type="button" onClick={() => setScan(blankScan(today || new Date().toISOString().slice(0, 10)))} className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium">
          {c.blank[locale]}
        </button>
        {isSample && <p className="basis-full text-sm text-ink-3">{c.sampleNote[locale]}</p>}
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <h2 className="text-xl font-semibold">{c.numbersTitle[locale]}</h2>
          <label className="block text-sm">
            <span className="text-ink-3">{c.date[locale]}</span>
            <input
              type="date"
              value={scan.date}
              onChange={(e) => setScan((p) => ({ ...p, date: e.target.value }))}
              className="mt-1 block rounded-lg border border-line bg-surface px-3 py-2"
            />
          </label>
          {(
            [
              ["right", c.rightView, "lateral"],
              ["left", c.leftView, "lateral"],
              ["anterior", c.anteriorView, "frontal"],
              ["posterior", c.posteriorView, "frontal"]
            ] as const
          ).map(([view, title, kind]) => (
            <fieldset key={view} className="rounded-xl border border-line bg-surface p-4">
              <legend className="px-1 font-semibold">{title[locale]}</legend>
              <div className="mb-1 hidden grid-cols-2 gap-3 text-xs text-ink-3 sm:grid">
                <span>{c.translation[locale]}</span>
                <span>{c.angulation[locale]}</span>
              </div>
              <div className="space-y-3">
                {(kind === "lateral" ? LATERAL_SEGMENTS : FRONTAL_SEGMENTS).map((segment) => {
                  const r = (scan[view] as Record<string, Reading>)[segment] ?? BLANK_READING;
                  return (
                    <div key={segment}>
                      <span className="text-sm font-medium">{SEGMENT_LABEL[segment][locale]}</span>
                      <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                        <SignedInput
                          prefix={c.translation[locale]}
                          label={`${SEGMENT_LABEL[segment][locale]} — ${c.translation[locale]}`}
                          directionLabel={c.direction[locale]}
                          value={r.t}
                          positive={kind === "lateral" ? c.forward[locale] : c.toRight[locale]}
                          negative={kind === "lateral" ? c.backward[locale] : c.toLeft[locale]}
                          onChange={(v) => setReading(view, segment, "t", v)}
                        />
                        <SignedInput
                          prefix={c.angulation[locale]}
                          label={`${SEGMENT_LABEL[segment][locale]} — ${c.angulation[locale]}`}
                          directionLabel={c.direction[locale]}
                          value={r.a}
                          positive={kind === "lateral" ? c.flexed[locale] : c.toRight[locale]}
                          negative={kind === "lateral" ? c.extended[locale] : c.toLeft[locale]}
                          onChange={(v) => setReading(view, segment, "a", v)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </fieldset>
          ))}
          <fieldset className="rounded-xl border border-line bg-surface p-4">
            <legend className="px-1 font-semibold">{c.printedAverage[locale]}</legend>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {LATERAL_SEGMENTS.map((segment) => (
                <label key={segment} className="text-sm">
                  <span className="text-ink-3">{SEGMENT_LABEL[segment][locale]} (cm)</span>
                  <NumberBox
                    value={scan.printedAverage?.[segment]?.t ?? null}
                    onChange={(v) =>
                      setScan((p) => ({
                        ...p,
                        printedAverage: { ...p.printedAverage, [segment]: { t: v, a: p.printedAverage?.[segment]?.a ?? null } }
                      }))
                    }
                  />
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="rounded-xl border border-line bg-surface p-4">
            <legend className="px-1 font-semibold">{c.headWeight[locale]}</legend>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm">
                <span className="text-ink-3">{c.effectiveKg[locale]}</span>
                <NumberBox value={scan.effectiveHeadKg ?? null} onChange={(v) => setScan((p) => ({ ...p, effectiveHeadKg: v }))} />
              </label>
              <label className="text-sm">
                <span className="text-ink-3">{c.baselineKg[locale]}</span>
                <NumberBox value={scan.baselineHeadKg ?? null} onChange={(v) => setScan((p) => ({ ...p, baselineHeadKg: v }))} />
              </label>
            </div>
          </fieldset>
          <button
            type="button"
            onClick={() => persist([...saved.filter((s) => s.id !== scan.id), { ...scan, id: isSample ? newId() : scan.id }])}
            className="rounded-full bg-accent px-5 py-2.5 font-medium text-accent-ink"
          >
            {c.saveScan[locale]}
          </button>
        </form>

        <div className="order-first space-y-6 lg:order-none" aria-live="polite">
          <h2 className="text-xl font-semibold">{c.findings[locale]}</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-surface p-5">
              <p className="text-sm text-ink-3">{c.noise[locale]}</p>
              <p className="tnum mt-1 text-4xl font-semibold">{noise === null ? "—" : `±${n(noise, 1)} cm`}</p>
              <p className="mt-2 text-sm text-ink-2">{c.noiseBody[locale]}</p>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-5">
              <p className="text-sm text-ink-3">{c.totals[locale]}</p>
              <p className="tnum mt-1 text-2xl font-semibold">
                {n(rightTotal.t, 1)} cm <span className="text-ink-3">vs</span> {n(leftTotal.t, 1)} cm
              </p>
              {totalsPct !== null && <p className="mt-2 text-sm text-ink-2">{fill(c.totalsBody[locale], { pct: totalsPct })}</p>}
            </div>
          </div>

          <section>
            <h3 className="mb-2 font-semibold">{c.pairsTitle[locale]}</h3>
            <div className="overflow-x-auto rounded-xl border border-line bg-surface">
              <table className="w-full text-left text-sm">
                <tbody>
                  {(["lateral", "frontal"] as const).map((pair) => (
                    <PairRows key={pair} pair={pair} rows={pairs.filter((p) => p.pair === pair)} locale={locale} describe={describe} n={n} />
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="mb-2 font-semibold">{c.averagingTitle[locale]}</h3>
            {averaging.some((a) => a.hidesOppositeDirections) ? (
              <div className="space-y-2">
                {averaging
                  .filter((a) => a.hidesOppositeDirections)
                  .map((a) => (
                    <Callout key={a.segment} tone="act">
                      {fill(c.averagingIssue[locale], {
                        segment: SEGMENT_LABEL[a.segment][locale],
                        r: describe(scan.right[a.segment].t ?? 0, "lateral"),
                        l: describe(scan.left[a.segment].t ?? 0, "lateral"),
                        printed: n(a.printed),
                        signed: describe(a.signedMean, "lateral")
                      })}
                    </Callout>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-ink-2">{averaging.length ? c.averagingOk[locale] : "—"}</p>
            )}
          </section>

          {ratio !== null && scan.effectiveHeadKg && scan.baselineHeadKg && (
            <section className="rounded-2xl border border-line bg-surface p-5">
              <h3 className="font-semibold">{c.headTitle[locale]}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">
                {fill(c.headBody[locale], { eff: n(scan.effectiveHeadKg, 1), base: n(scan.baselineHeadKg, 1), ratio: n(ratio, 1) })}
              </p>
              <SourceList ids={["hansraj2014"]} locale={locale} />
            </section>
          )}

          <section>
            <h3 className="mb-2 font-semibold">{c.meaningTitle[locale]}</h3>
            <ul className="space-y-3">
              {LATERAL_SEGMENTS.map((segment) => {
                const mean = signedSideMean(scan, segment);
                return (
                  <li key={segment} className="rounded-xl border border-line bg-surface p-4 text-sm">
                    <p className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-semibold">{SEGMENT_LABEL[segment][locale]}</span>
                      {mean !== null && (
                        <span className="tnum text-ink-2">
                          {c.sideAverage[locale]}: <strong>{describe(mean, "lateral")}</strong>
                        </span>
                      )}
                    </p>
                    <p className="mt-1 leading-relaxed text-ink-2">{SEGMENT_MEANING[segment][locale]}</p>
                  </li>
                );
              })}
            </ul>
            <SourceList ids={["mahmoud2019"]} locale={locale} />
          </section>

          <Callout tone="info" title={c.questionsTitle[locale]}>
            <ul className="list-disc space-y-1 pl-5">
              {c.questions.map((q, i) => (
                <li key={i}>{q[locale]}</li>
              ))}
            </ul>
          </Callout>

          <p className="text-sm leading-relaxed text-ink-2">
            {c.limits[locale]}{" "}
            <Link className="font-medium text-accent underline underline-offset-2" href={href(locale, "tracker")}>
              {COPY.nav.tracker[locale]} →
            </Link>
          </p>

          <section className="rounded-2xl border border-line bg-surface p-5">
            <h3 className="font-semibold">{c.saved[locale]}</h3>
            {ordered.length === 0 ? (
              <p className="mt-2 text-sm text-ink-3">{c.needTwo[locale]}</p>
            ) : (
              <ul className="mt-2 space-y-1 text-sm">
                {ordered.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-2">
                    <button type="button" className="tnum underline underline-offset-2" onClick={() => setScan(s)}>
                      {s.date}
                    </button>
                    <button type="button" className="text-ink-3" onClick={() => persist(saved.filter((x) => x.id !== s.id))}>
                      {COPY.common.remove[locale]}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {comparison ? (
              <div className="mt-4">
                <h4 className="font-medium">{c.compareTitle[locale]}</h4>
                <ul className="mt-2 space-y-2 text-sm">
                  {comparison.changes.map((ch) => (
                    <li key={ch.segment} className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2">
                      <span className="font-medium">{SEGMENT_LABEL[ch.segment][locale]}</span>
                      <span className="tnum text-ink-2">
                        {describe(ch.before, "lateral")} → {describe(ch.after, "lateral")}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${ch.beyondNoise ? "bg-good/15 text-good" : "bg-raised text-ink-3"}`}>
                        {ch.beyondNoise ? c.beyond[locale] : c.within[locale]} ({ch.improvement >= 0 ? "+" : ""}
                        {n(ch.improvement)} cm)
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              ordered.length === 1 && <p className="mt-3 text-sm text-ink-3">{c.needTwo[locale]}</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function PairRows({
  pair,
  rows,
  locale,
  describe,
  n
}: {
  pair: "lateral" | "frontal";
  rows: ReturnType<typeof pairChecks>;
  locale: Locale;
  describe: (v: number, pair: "lateral" | "frontal") => string;
  n: (v: number, digits?: number) => string;
}) {
  const c = COPY.report;
  if (rows.length === 0) return null;
  return (
    <>
      <tr className="bg-raised text-xs text-ink-2">
        <th scope="col" className="px-3 py-2 text-left font-semibold">
          {pair === "lateral" ? c.pairLateral[locale] : c.pairFrontal[locale]}
        </th>
        <th scope="col" className="px-3 py-2 text-left font-medium">
          {pair === "lateral" ? c.rightView[locale] : c.anteriorView[locale]}
        </th>
        <th scope="col" className="px-3 py-2 text-left font-medium">
          {pair === "lateral" ? c.leftView[locale] : c.posteriorView[locale]}
        </th>
        <th scope="col" className="px-3 py-2 text-right font-medium">{c.gap[locale]}</th>
      </tr>
      {rows.map((row) => (
        <tr key={`${pair}-${row.segment}`} className="align-top">
          <td className="px-3 py-1.5 font-medium">{SEGMENT_LABEL[row.segment as keyof typeof SEGMENT_LABEL][locale]}</td>
          <td className="tnum px-3 py-1.5 text-ink-2">{describe(row.first, pair)}</td>
          <td className="tnum px-3 py-1.5 text-ink-2">{describe(row.second, pair)}</td>
          <td className="px-3 py-1.5 text-right">
            <span className="tnum block font-medium">{n(row.gap)} cm</span>
            <span className={`mt-0.5 inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${BADGE[row.agreement]}`}>
              {row.directionsDisagree ? c.opposite[locale] : c.agreement[row.agreement][locale]}
            </span>
          </td>
        </tr>
      ))}
    </>
  );
}

function NumberBox({ value, onChange, label }: { value: number | null; onChange: (v: number | null) => void; label?: string }) {
  return (
    <input
      type="number"
      inputMode="decimal"
      step="0.01"
      aria-label={label}
      value={value ?? ""}
      onChange={(e) => {
        // An empty box is "not on the report", not zero — the two mean different things.
        const raw = e.target.value;
        onChange(raw === "" || Number.isNaN(Number(raw)) ? null : Number(raw));
      }}
      className="tnum mt-1 block w-full rounded-lg border border-line bg-surface px-3 py-2"
    />
  );
}

function SignedInput({
  prefix,
  label,
  directionLabel,
  value,
  positive,
  negative,
  onChange
}: {
  prefix: string;
  label: string;
  directionLabel: string;
  value: number | null;
  positive: string;
  negative: string;
  onChange: (v: number | null) => void;
}) {
  const sign = value !== null && value < 0 ? -1 : 1;
  const magnitude = value === null ? null : Math.abs(value);
  return (
    <div className="flex min-w-0 items-center gap-1">
      <span className="w-24 shrink-0 text-xs text-ink-3 sm:hidden" aria-hidden="true">
        {prefix}
      </span>
      <input
        type="number"
        inputMode="decimal"
        step="0.01"
        min="0"
        aria-label={label}
        value={magnitude ?? ""}
        onChange={(e) => {
          const raw = e.target.value;
          onChange(raw === "" || Number.isNaN(Number(raw)) ? null : sign * Math.abs(Number(raw)));
        }}
        className="tnum w-[4.25rem] shrink-0 rounded-lg border border-line bg-surface px-2 py-1.5 text-sm"
      />
      <select
        aria-label={`${label} — ${directionLabel}`}
        value={sign > 0 ? "pos" : "neg"}
        onChange={(e) => onChange(magnitude === null ? null : (e.target.value === "pos" ? 1 : -1) * magnitude)}
        className="min-w-0 flex-1 rounded-lg border border-line bg-surface px-1.5 py-1.5 text-sm"
      >
        <option value="pos">{positive}</option>
        <option value="neg">{negative}</option>
      </select>
    </div>
  );
}
