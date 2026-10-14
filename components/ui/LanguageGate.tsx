"use client";

import { useEffect } from "react";

export function LanguageGate() {
  useEffect(() => {
    const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
    const spanish = languages.some((l) => l?.toLowerCase().startsWith("es"));
    window.location.replace(spanish ? "/es/" : "/en/");
  }, []);
  return null;
}
