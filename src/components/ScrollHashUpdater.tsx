"use client";

import { useEffect } from "react";

const SECTION_IDS = ["home", "projects", "experience"];

export function ScrollHashUpdater() {
  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      Boolean
    ) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const hash = id === "home" ? "" : `#${id}`;
            if (window.location.hash !== hash) {
              history.replaceState(null, "", hash || window.location.pathname);
            }
          }
        }
      },
      { threshold: 0.4 }
    );

    for (const section of sections) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
