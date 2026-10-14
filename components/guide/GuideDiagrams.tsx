import type { ReactNode } from "react";
import { Balance } from "@/components/diagrams/Balance";
import { CarePathway } from "@/components/diagrams/CarePathway";
import { CuppingSkin } from "@/components/diagrams/CuppingSkin";
import { Dilution } from "@/components/diagrams/Dilution";
import { FootMap } from "@/components/diagrams/FootMap";
import { HeadLever } from "@/components/diagrams/HeadLever";
import { MobilisationGrades } from "@/components/diagrams/MobilisationGrades";
import { NeckLoad } from "@/components/diagrams/NeckLoad";
import { NeckMuscles } from "@/components/diagrams/NeckMuscles";
import { NeckOrArm } from "@/components/diagrams/NeckOrArm";
import { NeedleDepth } from "@/components/diagrams/NeedleDepth";
import { NerveGlide } from "@/components/diagrams/NerveGlide";
import { SurgeryOptions } from "@/components/diagrams/SurgeryOptions";
import { RedFlagCheck } from "@/components/flags/RedFlagCheck";
import { NerveSqueeze } from "@/components/vertebra/NerveSqueeze";
import { COPY } from "@/lib/copy";
import { DIAGRAM_INFO, GUIDE_DIAGRAMS, type DiagramId } from "@/lib/diagrams/registry";
import type { Locale } from "@/lib/i18n";

/** Every DiagramId has a branch, or this stops compiling. */
function render(id: DiagramId, locale: Locale, guide: string): ReactNode {
  switch (id) {
    case "care-pathway":
      return <CarePathway locale={locale} current={guide} />;
    case "red-flags":
      return <RedFlagCheck locale={locale} />;
    case "neck-or-arm":
      return <NeckOrArm locale={locale} />;
    case "nerve-glide":
      return <NerveGlide locale={locale} />;
    case "mobilisation-grades":
      return <MobilisationGrades locale={locale} />;
    case "surgery-options":
      return <SurgeryOptions locale={locale} />;
    case "neck-muscles":
      return <NeckMuscles locale={locale} />;
    case "balance":
      return <Balance locale={locale} />;
    case "neck-load-yoga":
      return <NeckLoad locale={locale} set="yoga" />;
    case "neck-load-pilates":
      return <NeckLoad locale={locale} set="pilates" />;
    case "head-lever":
      return <HeadLever locale={locale} />;
    case "needle-depth":
      return <NeedleDepth locale={locale} />;
    case "cupping-skin":
      return <CuppingSkin locale={locale} />;
    case "twist-and-root":
      return <NerveSqueeze locale={locale} startCause="herniation" startPosition="up-turn" />;
    case "foot-map":
      return <FootMap locale={locale} />;
    case "dilution":
      return <Dilution locale={locale} />;
  }
}

/** The guide's interactive diagrams, each in its own titled panel, before the written guide. */
export function GuideDiagrams({ id, locale }: { id: string; locale: Locale }) {
  return (
    <>
      {(GUIDE_DIAGRAMS[id] ?? []).map((d) => (
        <section key={d} id={`diagram-${d}`} aria-labelledby={`diagram-${d}-title`} className="mb-12 scroll-mt-24 rounded-3xl border border-accent/30 bg-surface/60 p-4 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{COPY.guide.diagramEyebrow[locale]}</p>
          <h2 id={`diagram-${d}-title`} className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
            {DIAGRAM_INFO[d].title[locale]}
          </h2>
          <p className="mb-5 mt-1 max-w-3xl text-ink-2">{DIAGRAM_INFO[d].intro[locale]}</p>
          {render(d, locale, id)}
        </section>
      ))}
    </>
  );
}
