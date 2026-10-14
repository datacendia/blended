/** A labelled row of pill buttons, one pressed: the control every diagram uses for "pick one". */
export function Choice<T extends string>({ label, options, value, onChange }: { label: string; options: { id: T; name: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div role="group" aria-label={label}>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            aria-pressed={opt.id === value}
            onClick={() => onChange(opt.id)}
            className={`rounded-full border px-3 py-1 text-sm ${opt.id === value ? "border-accent bg-accent font-medium text-accent-ink" : "border-line bg-surface hover:border-accent"}`}
          >
            {opt.name}
          </button>
        ))}
      </div>
    </div>
  );
}
