"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Callout } from "@/components/ui/Callout";
import { SourceList } from "@/components/ui/SourceList";
import { CLINICIANS } from "@/lib/clinicians";
import { COPY, fill } from "@/lib/copy";
import { formatNumber, type Locale } from "@/lib/i18n";
import { href } from "@/lib/nav";
import {
  checkpoints,
  CONDITIONS,
  exampleState,
  formatMoney,
  progress,
  sortedCheckIns,
  value,
  type CheckIn,
  type Currency,
  type Plan,
  type TrackerState
} from "@/lib/outcomes";
import { RED_FLAGS } from "@/lib/redflags";
import { buildExport, clearAll, loadScans, newId, parseImport, saveScans, saveTracker } from "@/lib/storage";
import { useStorageWorks, useToday, useTracker } from "../useStored";
import { ProgressChart } from "./ProgressChart";

const CURRENCIES: Currency[] = ["PEN", "USD", "EUR", "GBP"];

interface Draft {
  date: string;
  sessionsUsed: number;
  limbPain: number;
  axialPain: number;
  activities: number[];
  numbness: CheckIn["numbness"];
  flags: string[];
  note: string;
}

function draftFrom(state: TrackerState, today: string): Draft {
  const last = sortedCheckIns(state).at(-1);
  return {
    date: today,
    sessionsUsed: last?.sessionsUsed ?? 0,
    limbPain: last?.limbPain ?? 5,
    axialPain: last?.axialPain ?? 5,
    activities: [0, 1, 2].map((i) => last?.activities[i] ?? 5),
    numbness: last?.numbness ?? "none",
    flags: [],
    note: ""
  };
}

export function Tracker({ locale }: { locale: Locale }) {
  const c = COPY.tracker;
  const state = useTracker();
  const today = useToday();
  const storageOk = useStorageWorks();
  // The form starts from the last check-in until the person edits it; null
  // means "not edited", so it follows the stored data instead of copying it.
  const [edited, setDraft] = useState<Draft | null>(null);
  const draft = edited ?? draftFrom(state, today);
  const [importError, setImportError] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const update = (next: TrackerState) => {
    saveTracker(next);
  };
  const setPlan = (patch: Partial<Plan>) => update({ ...state, plan: { ...state.plan, ...patch } });

  const p = useMemo(() => progress(state), [state]);
  const v = useMemo(() => value(state, p), [state, p]);
  const points = useMemo(() => checkpoints(state, today), [state, today]);
  const list = sortedCheckIns(state);
  const limb = CONDITIONS.find((x) => x.id === state.plan.condition)?.limb ?? false;
  const money = (n: number) => formatMoney(n, state.plan.currency, locale);
  const num = (n: number | null) => (n === null ? "—" : formatNumber(n, locale, Number.isInteger(n) ? 0 : 1));
  const painName = p.painLabel === "limb" ? c.painLimb[locale] : c.painAxial[locale];

  const addCheckIn = () => {
    const entry: CheckIn = {
      id: newId(),
      date: draft.date || today,
      sessionsUsed: Math.max(0, Math.round(draft.sessionsUsed)),
      limbPain: limb ? draft.limbPain : null,
      axialPain: draft.axialPain,
      activities: state.activityNames.map((name, i) => (name.trim() ? (draft.activities[i] ?? null) : null)),
      numbness: draft.numbness,
      flags: draft.flags,
      ...(draft.note.trim() ? { note: draft.note.trim().slice(0, 500) } : {})
    };
    update({ ...state, checkIns: [...state.checkIns, entry] });
    setDraft(null);
  };

  const download = () => {
    const blob = new Blob([JSON.stringify(buildExport(state, loadScans(), new Date()), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rootatlas-${today || "export"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importFile = async (file: File) => {
    const parsed = parseImport(await file.text());
    if (!parsed) {
      setImportError(true);
      return;
    }
    setImportError(false);
    update(parsed.tracker);
    saveScans(parsed.scans);
    setDraft(null);
  };

  const verdictTone =
    p.verdict === "meaningful" ? "bg-good/15 text-good" : p.verdict === "worse" ? "bg-bad/15 text-bad" : p.verdict === "need-data" ? "bg-raised text-ink-3" : "bg-warn/15 text-warn";

  return (
    <div className="space-y-8">
      {!storageOk && <Callout tone="urgent">{c.storageOff[locale]}</Callout>}

      <div className="no-print flex flex-wrap gap-2">
        <button type="button" onClick={() => {
            update(exampleState(locale));
            setDraft(null);
          }} className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium">
          {c.loadExample[locale]}
        </button>
        <button type="button" onClick={download} className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium">
          {c.export[locale]}
        </button>
        <button type="button" onClick={() => fileInput.current?.click()} className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium">
          {c.import[locale]}
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void importFile(file);
            e.target.value = "";
          }}
        />
        <button type="button" onClick={() => window.print()} className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium">
          {c.print[locale]}
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(c.confirmDelete[locale])) {
              clearAll();
              setDraft(null);
            }
          }}
          className="rounded-full border border-bad/40 px-4 py-2 text-sm font-medium text-bad"
        >
          {c.deleteAll[locale]}
        </button>
        <p className="basis-full text-xs text-ink-3">{c.exampleNote[locale]}</p>
      </div>
      {importError && <Callout tone="act">{c.importFailed[locale]}</Callout>}

      <h2 className="print-only text-2xl font-semibold">{c.summaryTitle[locale]}</h2>

      {points.length > 0 && (
        <section aria-live="polite" className="space-y-3">
          <h2 className="text-xl font-semibold">{c.checkpoints[locale]}</h2>
          {points.map((cp) => (
            <Callout key={cp.id} tone={cp.level} title={cp.title[locale]}>
              {cp.body[locale]}
              {(cp.level === "emergency" || cp.level === "urgent") && (
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

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <section className="space-y-4">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">{c.progressTitle[locale]}</h2>
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${verdictTone}`}>{c.verdict[p.verdict][locale]}</span>
            </div>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <Stat
                label={painName}
                value={`${num(p.painBefore)} → ${num(p.painNow)}`}
                delta={p.painChange === null ? null : -p.painChange}
                good={(p.painChange ?? 0) > 0}
                note={`${fill(c.meaningfulAt[locale], { n: formatNumber(p.mcid.pain, locale, 1) })}${p.painChangePct !== null ? ` · ${p.painChangePct}%` : ""}`}
                locale={locale}
              />
              <Stat
                label={c.functionLabel[locale]}
                value={`${num(p.functionBefore)} → ${num(p.functionNow)}`}
                delta={p.functionChange}
                good={(p.functionChange ?? 0) > 0}
                note={fill(c.meaningfulAt[locale], { n: formatNumber(p.mcid.function, locale, 1) })}
                locale={locale}
              />
            </dl>
            <SourceList ids={p.mcid.sources} locale={locale} />
          </div>

          {list.length > 0 && (
            <ProgressChart
              locale={locale}
              painName={painName}
              painTarget={p.painBefore !== null ? Math.max(0, Math.round((p.painBefore - p.mcid.pain) * 10) / 10) : null}
              points={list.map((ci) => {
                const acts = ci.activities.filter((a): a is number => a !== null);
                return {
                  date: ci.date,
                  sessionsUsed: ci.sessionsUsed,
                  pain: p.painLabel === "limb" ? ci.limbPain : ci.axialPain,
                  fn: acts.length ? Math.round((acts.reduce((s, a) => s + a, 0) / acts.length) * 10) / 10 : null
                };
              })}
            />
          )}

          <div className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="text-lg font-semibold">{c.valueTitle[locale]}</h2>
            {v.costPerSession === null ? (
              <p className="mt-2 text-sm text-ink-3">{c.noPrice[locale]}</p>
            ) : (
              <dl className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-ink-3">{c.perSession[locale]}</dt>
                  <dd className="tnum text-xl font-semibold">{money(v.costPerSession)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-ink-3">{c.spent[locale]}</dt>
                  <dd className="tnum text-xl font-semibold">{money(v.spent ?? 0)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-ink-3">{c.remaining[locale]}</dt>
                  <dd className="tnum text-xl font-semibold">{money(v.remaining ?? 0)}</dd>
                  <dd className="text-xs text-ink-3">{fill(c.sessionsLeft[locale], { n: v.sessionsLeft ?? 0 })}</dd>
                </div>
                <div>
                  <dt className="text-sm text-ink-3">{c.perPoint[locale]}</dt>
                  <dd className="tnum text-xl font-semibold">{v.costPerPainPoint === null ? "—" : money(v.costPerPainPoint)}</dd>
                  {v.costPerPainPoint === null && <dd className="text-xs text-ink-3">{c.perPointNone[locale]}</dd>}
                </div>
              </dl>
            )}
          </div>

          <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
            <table className="w-full text-left text-sm">
              <caption className="px-4 pt-4 text-left font-semibold">{c.history[locale]}</caption>
              <thead className="text-ink-3">
                <tr>
                  <th className="px-4 py-2 font-medium">{c.date[locale]}</th>
                  <th className="px-2 py-2 text-right font-medium">#</th>
                  {limb && <th className="px-2 py-2 text-right font-medium">{c.painLimb[locale]}</th>}
                  <th className="px-2 py-2 text-right font-medium">{c.painAxial[locale]}</th>
                  <th className="px-2 py-2 text-right font-medium">{c.functionShort[locale]}</th>
                  <th className="no-print px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {list.map((ci) => {
                  const acts = ci.activities.filter((a): a is number => a !== null);
                  return (
                    <tr key={ci.id} className="border-t border-line">
                      <td className="tnum px-4 py-2">{ci.date}</td>
                      <td className="tnum px-2 py-2 text-right">{ci.sessionsUsed}</td>
                      {limb && <td className="tnum px-2 py-2 text-right">{num(ci.limbPain)}</td>}
                      <td className="tnum px-2 py-2 text-right">{num(ci.axialPain)}</td>
                      <td className="tnum px-2 py-2 text-right">{acts.length ? num(Math.round((acts.reduce((s, a) => s + a, 0) / acts.length) * 10) / 10) : "—"}</td>
                      <td className="no-print px-4 py-2 text-right">
                        <button
                          type="button"
                          className="text-xs text-ink-3 underline"
                          onClick={() => update({ ...state, checkIns: state.checkIns.filter((x) => x.id !== ci.id) })}
                        >
                          {COPY.common.remove[locale]}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="no-print space-y-4">
          <form className="space-y-4 rounded-2xl border border-line bg-surface p-5" onSubmit={(e) => { e.preventDefault(); addCheckIn(); }}>
            <h2 className="text-lg font-semibold">{c.checkInTitle[locale]}</h2>
            <div className="grid grid-cols-2 gap-3">
              <Field label={c.date[locale]}>
                <input type="date" required value={draft.date || today} onChange={(e) => setDraft({ ...draft, date: e.target.value })} className={INPUT} />
              </Field>
              <Field label={c.sessionsUsed[locale]}>
                <input
                  type="number"
                  min={0}
                  max={500}
                  value={draft.sessionsUsed}
                  onChange={(e) => setDraft({ ...draft, sessionsUsed: Number(e.target.value) || 0 })}
                  className={INPUT}
                />
              </Field>
            </div>
            {limb && <Slider label={c.limbPain[locale]} value={draft.limbPain} onChange={(n) => setDraft({ ...draft, limbPain: n })} />}
            <Slider label={c.axialPain[locale]} value={draft.axialPain} onChange={(n) => setDraft({ ...draft, axialPain: n })} />
            {state.activityNames.map((name, i) =>
              name.trim() ? (
                <Slider
                  key={i}
                  label={name}
                  value={draft.activities[i] ?? 5}
                  onChange={(n) => setDraft({ ...draft, activities: draft.activities.map((a, j) => (j === i ? n : a)) })}
                />
              ) : null
            )}
            <fieldset>
              <legend className="text-sm text-ink-3">{c.numbness[locale]}</legend>
              <div className="mt-1 flex flex-wrap gap-2">
                {(
                  [
                    ["none", c.numbNone],
                    ["sometimes", c.numbSome],
                    ["constant", c.numbConstant]
                  ] as const
                ).map(([id, label]) => (
                  <label key={id} className={`cursor-pointer rounded-full border px-3 py-1 text-sm ${draft.numbness === id ? "border-accent bg-accent text-accent-ink" : "border-line"}`}>
                    <input type="radio" name="numbness" className="sr-only" checked={draft.numbness === id} onChange={() => setDraft({ ...draft, numbness: id })} />
                    {label[locale]}
                  </label>
                ))}
              </div>
            </fieldset>
            <details className="rounded-xl border border-line p-3">
              <summary className="cursor-pointer text-sm font-medium">
                {c.flagsTitle[locale]} {draft.flags.length > 0 && <span className="ml-1 rounded-full bg-bad px-2 text-xs text-white">{draft.flags.length}</span>}
              </summary>
              <ul className="mt-3 space-y-2">
                {RED_FLAGS.filter((f) => f.level !== "soon").map((f) => (
                  <li key={f.id}>
                    <label className="flex gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={draft.flags.includes(f.id)}
                        onChange={(e) =>
                          setDraft({ ...draft, flags: e.target.checked ? [...draft.flags, f.id] : draft.flags.filter((x) => x !== f.id) })
                        }
                      />
                      <span>{f.text[locale]}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </details>
            <Field label={c.note[locale]}>
              <input type="text" maxLength={500} value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} className={INPUT} />
            </Field>
            <button type="submit" className="w-full rounded-full bg-accent px-5 py-2.5 font-medium text-accent-ink">
              {c.add[locale]}
            </button>
          </form>

          <div className="space-y-4 rounded-2xl border border-line bg-surface p-5">
            <h2 className="text-lg font-semibold">{c.planTitle[locale]}</h2>
            <Field label={c.condition[locale]}>
              <select value={state.plan.condition} onChange={(e) => setPlan({ condition: e.target.value as Plan["condition"] })} className={INPUT}>
                {CONDITIONS.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.label[locale]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={c.clinician[locale]}>
              <select value={state.plan.clinician} onChange={(e) => setPlan({ clinician: e.target.value })} className={INPUT}>
                {CLINICIANS.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name[locale]}
                  </option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label={c.sessions[locale]}>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={state.plan.sessionsPurchased ?? ""}
                  onChange={(e) => setPlan({ sessionsPurchased: e.target.value ? Math.max(1, Math.round(Number(e.target.value))) : null })}
                  className={INPUT}
                />
              </Field>
              <Field label={c.price[locale]}>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={state.plan.totalPrice ?? ""}
                  onChange={(e) => setPlan({ totalPrice: e.target.value ? Math.max(0, Number(e.target.value)) : null })}
                  className={INPUT}
                />
              </Field>
              <Field label={c.currency[locale]}>
                <select value={state.plan.currency} onChange={(e) => setPlan({ currency: e.target.value as Currency })} className={INPUT}>
                  {CURRENCIES.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={c.start[locale]}>
                <input type="date" value={state.plan.startDate} onChange={(e) => setPlan({ startDate: e.target.value })} className={INPUT} />
              </Field>
              <Field label={c.since[locale]}>
                <input type="date" value={state.plan.symptomsSince ?? ""} onChange={(e) => setPlan({ symptomsSince: e.target.value || null })} className={INPUT} />
              </Field>
            </div>
            <div>
              <p className="text-sm font-medium">{c.activitiesTitle[locale]}</p>
              <p className="mt-1 text-xs text-ink-3">{c.activitiesHint[locale]}</p>
              <div className="mt-2 space-y-2">
                {[0, 1, 2].map((i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={80}
                    aria-label={fill(c.activity[locale], { n: i + 1 })}
                    placeholder={i === 0 ? c.activityPlaceholder[locale] : fill(c.activity[locale], { n: i + 1 })}
                    value={state.activityNames[i] ?? ""}
                    onChange={(e) => update({ ...state, activityNames: [0, 1, 2].map((j) => (j === i ? e.target.value : state.activityNames[j] ?? "")) })}
                    className={INPUT}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
      <p className="text-sm text-ink-3">{COPY.common.privacy[locale]}</p>
    </div>
  );
}

const INPUT = "mt-1 block w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="text-ink-3">{label}</span>
      {children}
    </label>
  );
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="block text-sm">
      <span className="flex items-baseline justify-between gap-2">
        <span className="text-ink-2">{label}</span>
        <span className="tnum text-lg font-semibold">{value}</span>
      </span>
      <input type="range" min={0} max={10} step={1} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-1 w-full" />
    </label>
  );
}

function Stat({
  label,
  value,
  delta,
  good,
  note,
  locale
}: {
  label: string;
  value: string;
  delta: number | null;
  good: boolean;
  note: string;
  locale: Locale;
}) {
  return (
    <div>
      <dt className="text-sm text-ink-3">{label}</dt>
      <dd className="tnum mt-0.5 text-2xl font-semibold">{value}</dd>
      {delta !== null && (
        <dd className={`tnum text-sm font-medium ${delta === 0 ? "text-ink-3" : good ? "text-good" : "text-bad"}`}>
          {delta > 0 ? "▲" : delta < 0 ? "▼" : "•"} {formatNumber(Math.abs(delta), locale, 1)}
        </dd>
      )}
      <dd className="text-xs text-ink-3">{note}</dd>
    </div>
  );
}
