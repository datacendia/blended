import { PageHeader } from "@/components/ui/PageHeader";
import { COPY } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { SOURCES } from "@/lib/sources";

export function AboutContent({ locale }: { locale: Locale }) {
  const c = COPY.about;
  const sections = [
    [c.whatTitle, c.what],
    [c.notTitle, c.not],
    [c.privacyTitle, c.privacy],
    [c.evidenceTitle, c.evidence]
  ] as const;
  return (
    <>
      <PageHeader title={c.title[locale]} lead={COPY.common.tagline[locale]} />
      <div className="max-w-3xl space-y-8">
        {sections.map(([title, body]) => (
          <section key={title.en}>
            <h2 className="text-xl font-semibold">{title[locale]}</h2>
            <p className="mt-2 leading-relaxed text-ink-2">{body[locale]}</p>
          </section>
        ))}
        <p className="rounded-xl bg-raised p-4 text-sm">{COPY.common.reviewed[locale]}</p>
        <section>
          <h2 className="text-xl font-semibold">{c.allSources[locale]}</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-ink-2">
            {SOURCES.map((s) => (
              <li key={s.id} id={s.id}>
                {s.citation}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  );
}
