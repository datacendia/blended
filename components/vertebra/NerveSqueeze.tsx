"use client";

import { useState } from "react";
import { Choice } from "@/components/diagrams/Choice";
import { SourceList } from "@/components/ui/SourceList";
import { COPY } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { CAUSES, opening, POSITIONS, ROOM_LABEL, type Cause, type NeckPosition } from "@/lib/vertebra";
import { SideView, STATE_STYLE } from "./SideView";

/**
 * Pick what narrows the opening and how the head is held; the root goes from
 * yellow to amber to red as the room runs out. The huesero guide opens it on
 * a herniation with the head up and turned, the movement a forceful twist
 * involves.
 */
export function NerveSqueeze({ locale, startCause = "herniation", startPosition = "neutral" }: { locale: Locale; startCause?: Cause; startPosition?: NeckPosition }) {
  const c = COPY.vertebra;
  const [cause, setCause] = useState<Cause>(startCause);
  const [position, setPosition] = useState<NeckPosition>(startPosition);
  const o = opening(cause, position);
  const causeInfo = CAUSES.find((x) => x.id === cause)!;
  const positionInfo = POSITIONS.find((x) => x.id === position)!;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <div className="min-w-0 space-y-3">
        <Choice label={c.causeLabel[locale]} options={CAUSES.map((x) => ({ id: x.id, name: x.name[locale] }))} value={cause} onChange={setCause} />
        <Choice label={c.positionLabel[locale]} options={POSITIONS.map((x) => ({ id: x.id, name: x.name[locale] }))} value={position} onChange={setPosition} />
        <SideView o={o} bulge={cause === "herniation"} spurs={cause === "narrowing"} label={`${c.sideFigure[locale]}: ${ROOM_LABEL[o.state][locale]}`} locale={locale} />
      </div>

      <article className="min-w-0 space-y-3 rounded-2xl border border-line bg-surface p-5" aria-live="polite">
        <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${STATE_STYLE[o.state]}`}>{ROOM_LABEL[o.state][locale]}</span>
        <h3 className="text-lg font-semibold">{causeInfo.name[locale]}</h3>
        <p className="leading-relaxed text-ink-2">{causeInfo.text[locale]}</p>
        <h3 className="pt-1 font-semibold">{positionInfo.name[locale]}</h3>
        <p className="leading-relaxed text-ink-2">{positionInfo.text[locale]}</p>
        <SourceList ids={[...new Set([...causeInfo.sources, ...positionInfo.sources])]} locale={locale} />
        <p className="border-t border-line pt-3 text-sm text-ink-3">{c.picture[locale]}</p>
      </article>
    </div>
  );
}
