export interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
  link?: string;
  github?: string;
}

export const experiences: Experience[] = [
  {
    role: "Web Developer",
    company: "Vancouver Island University",
    location: "Nanaimo, BC",
    period: "Feb 2026 – Present",
    bullets: [
      "Manage CMS repositories and build external-facing web pages for the Political Studies department.",
      "Evaluate hosting options and coordinate DNS configuration with university IT.",
      "Write custom CSS/JS enhancements to improve usability and maintain accessibility standards.",
    ],
  },
  {
    role: "Software Engineer (Contract)",
    company: "KeepKey Ltd.",
    location: "Remote (USA)",
    period: "Feb 2022 \u2013 Feb 2023",
    link: "https://keepkey.com/",
    github: "https://github.com/keepkey/keepkey-desktop",
    bullets: [
      "Contributed 110K+ LOC across Electron + React & TypeScript for a crypto hardware-wallet desktop app.",
      "Implemented the REST bridge for signing/broadcasting and device management; added TOTP auth and onboarding flows.",
      "Set up signed auto-updates, cross-platform packaging, and release pipelines with structured logs/telemetry.",
      "Integrated blockchain workflows using Web3 libraries for robust transaction reliability.",
    ],
  },
  {
    role: "Open-Source Collaborator",
    company: "DogeHouse",
    location: "Remote",
    period: "Mar 2021 \u2013 May 2021",
    github: "https://github.com/benawad/dogehouse",
    bullets: [
      "Contributed 120K+ LOC across React, Electron, and Elixir codebases for a real-time social audio platform.",
      "Delivered front-end features, fixed bugs, and optimized WebSocket data flow with a distributed team.",
      "Triaged issues and merged pull requests, standardizing patterns and maintaining code quality.",
    ],
  },
  {
    role: "ABE Digital Support",
    company: "Vancouver Island University",
    location: "Nanaimo, BC",
    period: "Aug 2024 \u2013 Apr 2025",
    link: "https://wordpress.viu.ca/acplearnonline/",
    bullets: [
      "Provided technical support to Adult Basic Education students across diverse tech-related tasks.",
      "Built and maintained the ABE student support website using WordPress with custom CSS.",
      "Created student handouts in Markdown and produced instructional videos using DaVinci Resolve.",
    ],
  },
  {
    role: "Operations and IT Coordinator",
    company: "TEDxYouth@NMS Bahrain",
    location: "Bahrain",
    period: "Jan 2022 \u2013 Jun 2022",
    bullets: [
      "Led digital operations for event execution, web development, and technical infrastructure.",
      "Increased event attendance by 30% through targeted online campaigns and automated registration workflows.",
      "Designed promotional material and managed digital assets for event coordination.",
    ],
  },
  {
    role: "IT Coordinator / Web Developer",
    company: "New Millennium Model United Nations",
    location: "Bahrain",
    period: "Sep 2021 \u2013 Jan 2022",
    bullets: [
      "Oversaw IT systems and web platform redesign, enhancing accessibility and visual appeal.",
      "Integrated Microsoft Teams and collaborative tools to streamline internal communication.",
      "Provided technical support and training for faculty and delegates.",
    ],
  },
];
