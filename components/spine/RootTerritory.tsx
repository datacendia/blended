import { TerritoryFigure } from "@/components/map/TerritoryFigure";
import { COPY } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { REGIONS } from "@/lib/regions";

/**
 * Where a nerve root reaches, drawn on the same body the map uses. Picking C7
 * on the spine lights the middle finger; picking S1 lights the outer foot and
 * heel. It is the spine and the body map joined up, which is the question a
 * patient actually has: "if it's that root, where would I feel it?"
 */
export function RootTerritory({ rootId, locale }: { rootId: string; locale: Locale }) {
  const c = COPY.spine;
  const weights = Object.fromEntries(REGIONS.map((r) => [r.id, r.roots.find(([id]) => id === rootId)?.[1] ?? 0]));
  if (!Object.values(weights).some((w) => w > 0)) return null;
  return (
    <section aria-labelledby="territory-title">
      <h3 id="territory-title" className="mb-2 font-semibold">
        {c.territory[locale]}
      </h3>
      <TerritoryFigure weights={weights} idPrefix="root" locale={locale} legend={{ full: c.usualArea, partial: c.sharedArea, referred: c.referredArea }} />
    </section>
  );
}
