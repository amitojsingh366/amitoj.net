"use client";

import { useEffect, useState } from "react";
import { GradientColor, GradientText } from "./GradientText";
import { IconLink } from "./IconLink";
import { socialLinks } from "@/data/links";

export function HeroSection() {
  const [showArrow, setShowArrow] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowArrow(window.scrollY < window.innerHeight * 0.5);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="home"
      className="h-screen flex flex-col items-center justify-center relative"
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
        className={`animate-bounce-down text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all duration-300
          fixed bottom-6 left-1/2 -translate-x-1/2 z-50
          md:absolute md:bottom-10 md:left-1/2 md:z-auto
          ${showArrow ? "opacity-100" : "opacity-0 pointer-events-none"}`}
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
