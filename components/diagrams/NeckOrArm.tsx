"use client";

import Link from "next/link";
import { useState } from "react";
import { TerritoryFigure } from "@/components/map/TerritoryFigure";
import { SourceList } from "@/components/ui/SourceList";
import { MIMIC_COPY, MIMICS, type MimicId } from "@/lib/diagrams/mimics";
import type { Locale } from "@/lib/i18n";
import { href } from "@/lib/nav";

export function NeckOrArm({ locale }: { locale: Locale }) {
  const c = MIMIC_COPY;
  const [id, setId] = useState<MimicId>("c6");
  const m = MIMICS.find((x) => x.id === id)!;
  const groups = [
    { kind: "root" as const, label: c.roots },
    { kind: "peripheral" as const, label: c.peripheral }
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="min-w-0 space-y-3">
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
      </div>
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
    </div>
  );
}
