import { PageHeader } from "@/components/ui/PageHeader";
import { SourceList } from "@/components/ui/SourceList";
import { COPY } from "@/lib/copy";
import { TREATMENTS, VERDICT_LABEL, type Verdict } from "@/lib/evidence";
import type { Locale } from "@/lib/i18n";

const BADGE: Record<Verdict, string> = {
  supported: "bg-good/15 text-good",
  "may-help": "bg-accent/10 text-accent",
  unclear: "bg-raised text-ink-2",
  "not-supported": "bg-bad/10 text-bad"
};

const ORDER: Verdict[] = ["supported", "may-help", "unclear", "not-supported"];

export function WhatWorksContent({ locale }: { locale: Locale }) {
  const c = COPY.evidence;
  return (
    <>
      <PageHeader title={c.title[locale]} lead={c.lead[locale]} />
      <p className="-mt-4 mb-8 flex flex-wrap gap-2 text-sm">
        {ORDER.map((v) => (
          <span key={v} className={`rounded-full px-3 py-1 font-semibold ${BADGE[v]}`}>
            {VERDICT_LABEL[v][locale]}
          </span>
        ))}
      </p>
      <ul className="grid gap-4 md:grid-cols-2">
        {[...TREATMENTS]
          .sort((a, b) => ORDER.indexOf(a.verdict) - ORDER.indexOf(b.verdict))
          .map((t) => (
            <li key={t.id} id={t.id} className="scroll-mt-24 rounded-2xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="text-lg font-semibold">{t.name[locale]}</h2>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${BADGE[t.verdict]}`}>
                  {VERDICT_LABEL[t.verdict][locale]}
                </span>
              </div>
              <p className="mt-2 leading-relaxed text-ink-2">{t.summary[locale]}</p>
              <p className="mt-3 text-sm">
                <span className="font-semibold">{c.harms[locale]}: </span>
                <span className="text-ink-2">{t.harms[locale]}</span>
              </p>
              <SourceList ids={t.sources} locale={locale} />
            </li>
          ))}
      </ul>
      <p className="mt-8 text-sm text-ink-3">{COPY.common.reviewed[locale]}</p>
    </>
  );
}
