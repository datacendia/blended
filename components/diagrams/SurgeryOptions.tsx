"use client";

import { useState } from "react";
import { SourceList } from "@/components/ui/SourceList";
import { SideView, STATE_STYLE } from "@/components/vertebra/SideView";
import { SURGERY_COPY, SURGERY_OPTIONS, surgeryOpening, type SurgeryOption } from "@/lib/diagrams/surgery";
import type { Locale } from "@/lib/i18n";
import { opening, ROOM_LABEL } from "@/lib/vertebra";
import { Choice } from "./Choice";

export function SurgeryOptions({ locale }: { locale: Locale }) {
  const c = SURGERY_COPY;
  const [id, setId] = useState<SurgeryOption>("wait");
  const info = SURGERY_OPTIONS.find((x) => x.id === id)!;
  const o = surgeryOpening(id);
  const fromFront = id === "acdf" || id === "disc-replacement";

  return (
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
          <dt className="text-ink-3">{c.keeps[locale]}</dt>
          <dd>{info.keeps[locale]}</dd>
        </dl>
        <p className="border-t border-line pt-3 text-sm text-ink-3">{c.ask[locale]}</p>
        <SourceList ids={info.sources} locale={locale} />
      </article>
    </div>
  );
}
