"use client";

import { useMediaQuery } from "./useMediaQuery";

/** True when the person has asked their system for less motion. Animations then stand still. */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)", true);
}
