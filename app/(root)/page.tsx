import Link from "next/link";
import { LanguageGate } from "@/components/ui/LanguageGate";
import { BRAND, COPY } from "@/lib/copy";

/**
 * "/" has no language of its own. With JavaScript, LanguageGate sends a
 * Spanish browser to /es/ and everyone else to /en/; without it, these two
 * links are the page.
 */
export default function RootPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-4 text-center">
      <LanguageGate />
      <p className="text-2xl font-semibold">{BRAND}</p>
      <p className="text-ink-2">
        {COPY.common.tagline.en}
        <br />
        {COPY.common.tagline.es}
      </p>
      <div className="flex gap-3">
        <Link className="rounded-full bg-accent px-5 py-2 font-medium text-accent-ink" href="/en/">
          English
        </Link>
        <Link className="rounded-full bg-accent px-5 py-2 font-medium text-accent-ink" href="/es/">
          Español
        </Link>
      </div>
    </main>
  );
}
