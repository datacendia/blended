import Link from "next/link";
import { COPY } from "@/lib/copy";
import { href } from "@/lib/nav";
import { localeFrom, type LocaleParams } from "@/lib/params";

export default async function HomePage({ params }: LocaleParams) {
  const locale = await localeFrom(params);
  const c = COPY.home;
  const tools = [
    { slug: "spine", title: COPY.nav.spine, body: c.toolSpine, swatch: "bg-cervical" },
    { slug: "map", title: COPY.nav.map, body: c.toolMap, swatch: "bg-thoracic" },
    { slug: "report", title: COPY.nav.report, body: c.toolReport, swatch: "bg-lumbar" },
    { slug: "tracker", title: COPY.nav.tracker, body: c.toolTracker, swatch: "bg-sacral" },
    { slug: "warning-signs", title: COPY.nav.flags, body: c.toolFlags, swatch: "bg-bad" },
    { slug: "what-works", title: COPY.nav.evidence, body: c.toolEvidence, swatch: "bg-accent" },
    { slug: "who-to-see", title: COPY.nav.clinicians, body: c.toolClinicians, swatch: "bg-coccyx" }
  ];

  return (
    <div className="space-y-14">
      <section className="grid items-center gap-10 pt-4 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">{c.eyebrow[locale]}</p>
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">{c.title[locale]}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">{c.lead[locale]}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={href(locale, "map")} className="rounded-full bg-accent px-5 py-2.5 font-medium text-accent-ink">
              {c.ctaMap[locale]}
            </Link>
            <Link href={href(locale, "tracker")} className="rounded-full border border-line bg-surface px-5 py-2.5 font-medium">
              {c.ctaTracker[locale]}
            </Link>
          </div>
        </div>
        <aside className="rounded-2xl border border-line bg-surface p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-ink-3">{c.storyTitle[locale]}</p>
          <p className="mt-3 leading-relaxed text-ink-2">{c.story[locale]}</p>
          <ol className="mt-4 space-y-3">
            {[c.q1, c.q2, c.q3].map((q, i) => (
              <li key={i} className="flex gap-3">
                <span className="tnum flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-raised text-sm font-semibold text-accent">
                  {i + 1}
                </span>
                <span className="font-medium">{q[locale]}</span>
              </li>
            ))}
          </ol>
        </aside>
      </section>

      <section aria-labelledby="tools">
        <h2 id="tools" className="mb-4 text-xl font-semibold">{c.toolsTitle[locale]}</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <li key={t.slug}>
              <Link
                href={href(locale, t.slug)}
                className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition hover:border-accent"
              >
                <span className={`mb-3 h-1.5 w-10 rounded-full ${t.swatch}`} aria-hidden="true" />
                <span className="font-semibold group-hover:text-accent">{t.title[locale]}</span>
                <span className="mt-2 text-sm leading-relaxed text-ink-2">{t.body[locale]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-line bg-raised p-6">
        <h2 className="font-semibold">{c.privacyTitle[locale]}</h2>
        <p className="mt-2 max-w-3xl text-ink-2">{c.privacyBody[locale]}</p>
      </section>
    </div>
  );
}
