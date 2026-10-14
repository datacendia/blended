"use client";

import { useState } from "react";
import { COPY, fill } from "@/lib/copy";
import type { L, Locale } from "@/lib/i18n";

/**
 * A checklist to hold a visit up against. Kept in memory only: what someone's
 * clinician did or didn't do is theirs, and nothing here needs to outlive
 * the page.
 */
export function FirstVisitCheck({ items, locale }: { items: L[]; locale: Locale }) {
  const c = COPY.guide;
  const [ticked, setTicked] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setTicked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div>
      <p className="text-sm text-ink-3">{c.checkHint[locale]}</p>
      <ul className="mt-3 space-y-2">
        {items.map((item, i) => (
          <li key={i}>
            <label className="flex cursor-pointer gap-3 rounded-xl border border-line bg-surface p-3 hover:border-accent">
              <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-accent" checked={ticked.has(i)} onChange={() => toggle(i)} />
              <span>{item[locale]}</span>
            </label>
          </li>
        ))}
      </ul>
      {ticked.size > 0 && (
        <p className="mt-3 text-sm" aria-live="polite">
          <span className="tnum font-semibold">{fill(c.checkScore[locale], { n: ticked.size, total: items.length })}</span>
          <span className="text-ink-2"> · {ticked.size === items.length ? c.checkAll[locale] : c.checkMissing[locale]}</span>
        </p>
      )}
    </div>
  );
}
