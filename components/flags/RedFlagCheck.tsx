"use client";

import { useState } from "react";
import { Callout } from "@/components/ui/Callout";
import { COPY } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { RED_FLAGS, triage, TRIAGE_ACTION, type FlagLevel } from "@/lib/redflags";

const LEVELS: FlagLevel[] = ["emergency", "urgent", "soon"];
const TONE = { emergency: "emergency", urgent: "urgent", soon: "info" } as const;
const DOT: Record<FlagLevel, string> = { emergency: "bg-bad", urgent: "bg-warn", soon: "bg-ink-3" };

export function RedFlagCheck({ locale }: { locale: Locale }) {
  const c = COPY.flags;
  const [ticked, setTicked] = useState<string[]>([]);
  const level = triage(ticked);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <div className="space-y-8">
        {LEVELS.map((lvl) => (
          <section key={lvl}>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <span className={`h-2.5 w-2.5 rounded-full ${DOT[lvl]}`} aria-hidden="true" />
              {c.levels[lvl][locale]}
            </h2>
            <ul className="space-y-2">
              {RED_FLAGS.filter((f) => f.level === lvl).map((f) => {
                const on = ticked.includes(f.id);
                return (
                  <li key={f.id}>
                    <label className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${on ? "border-accent bg-accent/5" : "border-line bg-surface"}`}>
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 shrink-0"
                        checked={on}
                        onChange={(e) => setTicked((prev) => (e.target.checked ? [...prev, f.id] : prev.filter((x) => x !== f.id)))}
                      />
                      <span>
                        <span className="block font-medium">{f.text[locale]}</span>
                        <span className="mt-1 block text-sm text-ink-2">
                          <span className="font-medium">{c.why[locale]}:</span> {f.why[locale]}
                        </span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
      <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start" aria-live="assertive">
        {level ? (
          <Callout tone={TONE[level]} title={TRIAGE_ACTION[level].title[locale]}>
            {TRIAGE_ACTION[level].body[locale]}
          </Callout>
        ) : (
          <Callout tone="note">{c.none[locale]}</Callout>
        )}
        <Callout tone="info">{c.beforeManipulation[locale]}</Callout>
      </aside>
    </div>
  );
}
