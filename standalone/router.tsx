"use client";

import { createContext, useContext } from "react";
import { isLocale, type Locale } from "@/lib/i18n";
import { PAGES } from "@/lib/nav";

/**
 * Routing for the single-file build. Paths are the same strings the Next site
 * uses (/es/tracker/), held in memory instead of the address bar, because a
 * single file has nowhere to serve /es/tracker/ from. Hash fragments
 * (#root-C6, #non-msk) still go to location.hash, where the pages read them.
 */
export interface Route {
  locale: Locale;
  slug: string;
}

export const SLUGS = PAGES.map((p) => p.slug);

export function parsePath(path: string): Route | null {
  const m = path.match(/^\/(en|es)\/(?:([a-z-]+)\/?)?$/);
  if (!m || !isLocale(m[1]!)) return null;
  const slug = m[2] ?? "";
  return SLUGS.includes(slug) ? { locale: m[1] as Locale, slug } : null;
}

export function pathFor(route: Route): string {
  return route.slug ? `/${route.locale}/${route.slug}/` : `/${route.locale}/`;
}

/** A bare #es or #en-tracker in the link opens that page; anything else is a page anchor. */
export function routeFromHash(hash: string): Route | null {
  const m = hash.match(/^#(en|es)(?:-([a-z-]+))?$/);
  if (!m) return null;
  return parsePath(m[2] ? `/${m[1]}/${m[2]}/` : `/${m[1]}/`);
}

export interface Router {
  path: string;
  navigate: (href: string) => void;
}

export const RouterContext = createContext<Router>({ path: "/en/", navigate: () => {} });

export function useRouter(): Router {
  return useContext(RouterContext);
}
