import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { SpineTabs } from "@/components/ui/SpineTabs";
import { NerveSqueeze } from "@/components/vertebra/NerveSqueeze";
import { VertebraUpClose } from "@/components/vertebra/VertebraUpClose";
import { COPY } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { href } from "@/lib/nav";

export function VertebraContent({ locale }: { locale: Locale }) {
  const c = COPY.vertebra;
  return (
    <>
      <PageHeader title={c.title[locale]} lead={c.lead[locale]} />
      <SpineTabs locale={locale} current="vertebra" />
      <VertebraUpClose locale={locale} />

      <section id="trapped" aria-labelledby="trapped-title" className="mt-14 scroll-mt-24">
        <h2 id="trapped-title" className="text-2xl font-semibold tracking-tight">{c.trappedTitle[locale]}</h2>
        <p className="mb-6 mt-2 max-w-3xl text-ink-2">{c.trappedLead[locale]}</p>
        <NerveSqueeze locale={locale} />
      </section>

      <section className="mt-10 rounded-2xl border border-line bg-raised p-6">
        <h2 className="font-semibold">{c.nextTitle[locale]}</h2>
        <p className="mt-2 max-w-3xl text-ink-2">{c.next[locale]}</p>
        <Link href={href(locale, "map")} className="mt-4 inline-block rounded-full bg-accent px-5 py-2.5 font-medium text-accent-ink">
          {COPY.spine.openMap[locale]}
        </Link>
      </section>
    </>
  );
}
