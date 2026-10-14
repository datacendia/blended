"use client";

import { createContext, useContext } from "react";
import { isLocale, type Locale } from "@/lib/i18n";
import { guidePage } from "@/lib/guides";
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
  /** A page under the slug: only the guides (/es/who-to-see/physio/, /es/who-to-see/acupuncture/) have one. */
  id?: string;
}

export const SLUGS = PAGES.map((p) => p.slug);

export function parsePath(path: string): Route | null {
  const m = path.match(/^\/(en|es)\/(?:([a-z-]+)(?:\/([a-z-]+))?\/?)?$/);
  if (!m || !isLocale(m[1]!)) return null;
  const locale = m[1] as Locale;
  const slug = m[2] ?? "";
  if (!SLUGS.includes(slug)) return null;
  if (m[3] === undefined) return { locale, slug };
  return slug === "who-to-see" && guidePage(m[3]) ? { locale, slug, id: m[3] } : null;
}

export function pathFor(route: Route): string {
  if (!route.slug) return `/${route.locale}/`;
  return route.id ? `/${route.locale}/${route.slug}/${route.id}/` : `/${route.locale}/${route.slug}/`;
}

/** A bare #es, #en-tracker or #es-who-to-see/physio in the link opens that page; anything else is a page anchor. */
export function routeFromHash(hash: string): Route | null {
  const m = hash.match(/^#(en|es)(?:-([a-z-]+(?:\/[a-z-]+)?))?$/);
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
