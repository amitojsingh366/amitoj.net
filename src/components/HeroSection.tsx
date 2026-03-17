"use client";

import { GradientColor, GradientText } from "./GradientText";
import { IconLink } from "./IconLink";
import { socialLinks } from "@/data/links";

export function HeroSection() {
  return (
    <section
      id="home"
      className="h-screen flex flex-col items-center justify-center relative scroll-snap-align-start"
      style={{ scrollSnapAlign: "start" }}
    >
      <GradientText
        size="text-5xl md:text-7xl"
        fontWeight="font-bold"
        colors={GradientColor["violet-cyan"]}
        style={{
          textShadow: "0px 0px 50px rgba(139, 92, 246, 0.4)",
        }}
      >
        Amitoj Singh
      </GradientText>

      <div className="flex flex-row mt-20 space-x-10 md:space-x-16 h-10">
        {socialLinks.map((link) => (
          <IconLink
            key={link.name}
            Icon={link.icon}
            link={link.url}
            title={link.description}
          />
        ))}
      </div>

      <a
        href="#projects"
        className="absolute bottom-10 animate-bounce-down text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        aria-label="Scroll to projects"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </a>
    </section>
  );
}
