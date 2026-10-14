export function PageHeader({ title, lead, eyebrow }: { title: string; lead?: string; eyebrow?: string }) {
  return (
    <header className="mb-8 max-w-3xl">
      {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>}
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      {lead && <p className="mt-3 text-lg leading-relaxed text-ink-2">{lead}</p>}
    </header>
  );
}
