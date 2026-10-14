import { COPY } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { sourceById, type SourceId } from "@/lib/sources";

export function SourceList({ ids, locale }: { ids: readonly SourceId[]; locale: Locale }) {
  if (ids.length === 0) return null;
  return (
    <details className="mt-3 text-xs text-ink-3">
      <summary className="cursor-pointer select-none">
        {COPY.common.sources[locale]} ({ids.length})
      </summary>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {ids.map((id) => (
          <li key={id}>{sourceById(id).citation}</li>
        ))}
      </ul>
    </details>
  );
}
