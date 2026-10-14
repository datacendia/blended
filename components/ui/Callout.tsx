import type { ReactNode } from "react";

export type Tone = "emergency" | "urgent" | "act" | "info" | "good" | "note";

const TONES: Record<Tone, string> = {
  emergency: "border-bad bg-bad/10",
  urgent: "border-warn bg-warn/10",
  act: "border-warn bg-warn/5",
  info: "border-line bg-raised",
  good: "border-good bg-good/10",
  note: "border-line bg-surface"
};

export function Callout({ tone, title, children }: { tone: Tone; title?: string; children?: ReactNode }) {
  const role = tone === "emergency" || tone === "urgent" ? "alert" : undefined;
  return (
    <div role={role} className={`rounded-xl border-l-4 p-4 ${TONES[tone]}`}>
      {title && <p className="font-semibold">{title}</p>}
      {children && <div className={`text-sm leading-relaxed text-ink-2 ${title ? "mt-1" : ""}`}>{children}</div>}
    </div>
  );
}
