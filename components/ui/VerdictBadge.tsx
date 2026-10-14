import { VERDICT_LABEL, type Verdict } from "@/lib/evidence";
import type { Locale } from "@/lib/i18n";

export const VERDICT_STYLE: Record<Verdict, string> = {
  supported: "bg-good/15 text-good",
  "may-help": "bg-accent/10 text-accent",
  unclear: "bg-raised text-ink-2",
  "not-supported": "bg-bad/10 text-bad"
};

export function VerdictBadge({ verdict, locale, size = "sm" }: { verdict: Verdict; locale: Locale; size?: "sm" | "md" }) {
  const pad = size === "md" ? "px-3 py-1 text-sm" : "px-2.5 py-0.5 text-xs";
  return <span className={`shrink-0 rounded-full font-semibold ${pad} ${VERDICT_STYLE[verdict]}`}>{VERDICT_LABEL[verdict][locale]}</span>;
}
