/** Three stacked vertebrae with a root leaving between them. */
export function Logo({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect x="9" y="3" width="13" height="7" rx="2.5" fill="rgb(var(--cervical))" />
      <rect x="8" y="12.5" width="15" height="7.5" rx="2.5" fill="rgb(var(--thoracic))" />
      <rect x="7.5" y="22.5" width="16" height="7" rx="2.5" fill="rgb(var(--lumbar))" />
      <path d="M8 11.2 C 4 11.4, 3 14, 1.5 16" stroke="rgb(var(--accent))" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="8.2" cy="11.2" r="1.6" fill="rgb(var(--accent))" />
    </svg>
  );
}
