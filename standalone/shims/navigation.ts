"use client";

import { useRouter } from "../router";

/** The only next/navigation API the components use. */
export function usePathname(): string {
  return useRouter().path;
}
