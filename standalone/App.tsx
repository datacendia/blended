"use client";

import { useCallback, useEffect, useState, type ComponentType } from "react";
import { AboutContent } from "@/components/pages/About";
import { GuideContent } from "@/components/pages/Guide";
import { HomeContent } from "@/components/pages/Home";
import { MapContent } from "@/components/pages/Map";
import { OrgansContent } from "@/components/pages/Organs";
import { ReportContent } from "@/components/pages/Report";
import { SpineContent } from "@/components/pages/Spine";
import { TrackerContent } from "@/components/pages/Tracker";
import { VertebraContent } from "@/components/pages/Vertebra";
import { WarningSignsContent } from "@/components/pages/WarningSigns";
import { WhatWorksContent } from "@/components/pages/WhatWorks";
import { WhoToSeeContent } from "@/components/pages/WhoToSee";
import { SiteShell } from "@/components/ui/SiteShell";
import { CLINICIANS } from "@/lib/clinicians";
import { BRAND, COPY } from "@/lib/copy";
import type { L, Locale } from "@/lib/i18n";
import { parsePath, pathFor, routeFromHash, RouterContext, type Route } from "./router";

/** Every page of the Next site, keyed by its slug. The build fails if one is missing. */
export const PAGE_CONTENT: Record<string, { Content: ComponentType<{ locale: Locale }>; title: L }> = {
  "": { Content: HomeContent, title: COPY.meta.title },
  spine: { Content: SpineContent, title: COPY.spine.title },
  vertebra: { Content: VertebraContent, title: COPY.vertebra.title },
  organs: { Content: OrgansContent, title: COPY.organs.title },
  map: { Content: MapContent, title: COPY.map.title },
  report: { Content: ReportContent, title: COPY.report.title },
  tracker: { Content: TrackerContent, title: COPY.tracker.title },
  "warning-signs": { Content: WarningSignsContent, title: COPY.flags.title },
  "who-to-see": { Content: WhoToSeeContent, title: COPY.clinicians.title },
  "what-works": { Content: WhatWorksContent, title: COPY.evidence.title },
  about: { Content: AboutContent, title: COPY.about.title }
};

function initialRoute(): Route {
  const fromHash = routeFromHash(window.location.hash);
  if (fromHash) return fromHash;
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  return { locale: languages.some((l) => l?.toLowerCase().startsWith("es")) ? "es" : "en", slug: "" };
}

function setHash(hash: string | null) {
  try {
    const base = window.location.pathname + window.location.search;
    window.history.replaceState(null, "", hash ? `${base}#${hash}` : base);
  } catch {
    // Some embedded frames refuse history changes; anchors then just don't scroll.
  }
}

export function App() {
  const [path, setPath] = useState(() => pathFor(initialRoute()));
  const route = parsePath(path) ?? { locale: "en" as const, slug: "" };
  const guideName = route.id ? CLINICIANS.find((c) => c.id === route.id)?.name : undefined;
  const page = PAGE_CONTENT[route.slug] ?? PAGE_CONTENT[""]!;
  const title = guideName ?? page.title;

  const navigate = useCallback((href: string) => {
    const [target = "", hash = ""] = href.split("#");
    if (!target) {
      setHash(hash || null);
      document.getElementById(hash)?.scrollIntoView();
      return;
    }
    const next = parsePath(target);
    if (!next) return;
    setHash(hash || null);
    setPath(pathFor(next));
  }, []);

  useEffect(() => {
    document.documentElement.lang = route.locale;
    document.title = route.slug ? `${title[route.locale]} · ${BRAND}` : title[route.locale];
    const anchor = window.location.hash.slice(1);
    const target = anchor ? document.getElementById(anchor) : null;
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [path, route.locale, route.slug, title]);

  const { Content } = page;
  return (
    <RouterContext.Provider value={{ path, navigate }}>
      <div className="flex min-h-screen flex-col font-sans antialiased">
        <SiteShell locale={route.locale}>
          {route.id ? <GuideContent key={path} locale={route.locale} id={route.id} /> : <Content key={path} locale={route.locale} />}
        </SiteShell>
      </div>
    </RouterContext.Provider>
  );
}
