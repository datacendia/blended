"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * The phone menu. A plain <details> stays open after a link is followed,
 * because the header is a layout that survives navigation; closing it when
 * the path changes keeps the next page from opening under a dropdown.
 */
export function MobileMenu({ label, children }: { label: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);
  return (
    <details ref={ref} className="relative lg:hidden">
      <summary className="cursor-pointer list-none rounded-md border border-line px-3 py-1.5 text-sm [&::-webkit-details-marker]:hidden">
        {label}
      </summary>
      {children}
    </details>
  );
}
