import Link from "next/link";
import { OrganWiring } from "@/components/organs/OrganWiring";
import { Callout } from "@/components/ui/Callout";
import { PageHeader } from "@/components/ui/PageHeader";
import { SourceList } from "@/components/ui/SourceList";
import { SpineTabs } from "@/components/ui/SpineTabs";
import { COPY } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { href } from "@/lib/nav";
import { POSTER_CHECKS, POSTER_VERDICT, type PosterVerdict } from "@/lib/organs";

const VERDICT_STYLE: Record<PosterVerdict, string> = {
  partly: "bg-warn/15 text-warn",
  false: "bg-bad/10 text-bad",
  unsupported: "bg-bad/10 text-bad"
};

export function OrgansContent({ locale }: { locale: Locale }) {
  const c = COPY.organs;
  return (
    <>
      <PageHeader title={c.title[locale]} lead={c.lead[locale]} />
      <SpineTabs locale={locale} current="organs" />
      <OrganWiring locale={locale} />

      <section aria-labelledby="poster" className="mt-14">
        <h2 id="poster" className="text-2xl font-semibold tracking-tight">{c.posterTitle[locale]}</h2>
        <p className="mt-2 max-w-3xl text-ink-2">{c.posterLead[locale]}</p>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {POSTER_CHECKS.map((check) => (
            <li key={check.claim.en} className="rounded-2xl border border-line bg-surface p-5">
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${VERDICT_STYLE[check.verdict]}`}>
                {POSTER_VERDICT[check.verdict][locale]}
              </span>
              <p className="mt-3 text-lg font-semibold">“{check.claim[locale]}”</p>
              <p className="mt-2 leading-relaxed text-ink-2">{check.why[locale]}</p>
              <SourceList ids={check.sources} locale={locale} />
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Callout tone="info" title={c.neckTitle[locale]}>
          {c.neck[locale]}
        </Callout>
        <Callout tone="note">
          <p>{COPY.spine.wiringCaveat[locale]}</p>
          <Link className="mt-2 inline-block text-accent underline underline-offset-2" href={`${href(locale, "what-works")}#non-msk`}>
            {c.seeEvidence[locale]}
          </Link>
        </Callout>
      </div>
    </>
  );
}
