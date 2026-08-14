export interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
  link?: string;
  instagram?: string;
  github?: string;
}

export const experiences: Experience[] = [
  {
    role: "Web Developer",
    company: "Vancouver Island University",
    location: "Nanaimo, BC",
    period: "Feb 2026 – Present",
    bullets: [
      "Evaluated and selected optimal web hosting solutions, coordinating with university IT to configure DNS records.",
      "Manage CMS repositories and develop custom CSS/JS to enhance site design and functionality.",
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
      "Engineered desktop wallet infrastructure for 100K+ hardware users via Electron, React, TypeScript and Rust.",
      "Secured multi-chain transactions across 11+ blockchains by implementing a REST bridge for cryptographic signing.",
      "Engineered an end-to-end device TOTP generator allowing 100K+ users to utilize KeepKey as an authenticator.",
      "Streamlined releases across 3 desktop OS platforms by configuring signed auto-updates and release telemetry.",
    ],
  },
  {
    role: "Open-Source Collaborator",
    company: "DogeHouse",
    location: "Remote",
    period: "Mar 2021 \u2013 May 2021",
    github: "https://github.com/benawad/dogehouse",
    bullets: [
      "Core Maintainer & #2 All-Time Contributor for a distributed real-time social platform with 3,500+ GitHub Stars.",
      "Optimized WebSocket data flow and integrated core audio streaming features in collaboration with a distributed team.",
      "Triaged issues and merged pull requests to standardize patterns and maintain code quality.",
    ],
  },
  {
    role: "ABE Digital Support",
    company: "Vancouver Island University",
    location: "Nanaimo, BC",
    period: "Aug 2024 \u2013 Apr 2025",
    link: "https://wordpress.viu.ca/acplearnonline/",
    bullets: [
      "Provide technical support to students and maintain support websites using WordPress and custom CSS.",
      "Create instructional handouts in Markdown and produce video guides using DaVinci Resolve.",
      "Provided technical support to adult/elderly learners, translating technical jargon into plain, understandable instructions via email.",
    ],
  },
  {
    role: "Operations and IT Coordinator",
    company: "TEDxYouth@NMS Bahrain",
    location: "Bahrain",
    period: "Jan 2022 \u2013 Jun 2022",
    instagram: "https://www.instagram.com/tedxyouthnmsbh/",
    bullets: [
      "Led core event and digital operations, overseeing technical infrastructure, web development, and logistics.",
      "Spearheaded speaker recruitment and sponsorship acquisition, securing key partnerships for event funding.",
      "Increased event attendance by 30% through targeted online campaigns and registration automation.",
      "Designed online promotional material and managed digital assets for smooth event coordination.",
    ],
  },
  {
    role: "IT Coordinator / Web Developer",
    company: "New Millennium Model United Nations",
    location: "Bahrain",
    period: "Sep 2021 \u2013 Jan 2022",
    instagram: "https://www.instagram.com/nmmun202122/",
    bullets: [
      "Oversaw IT systems and web platform redesign, enhancing accessibility and visual appeal.",
      "Integrated Microsoft Teams and collaborative tools to streamline internal communication.",
      "Provided technical support and training for faculty and delegates.",
    ],
  },
];
