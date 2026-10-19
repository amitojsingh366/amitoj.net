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
    role: "Software Engineering Intern",
    company: "Human Computer Lab",
    location: "Toronto, ON",
    period: "Sept 2026 – Present",
    bullets: [
      "Built an MCAP telemetry pipeline recording ~4,500 data points per second per robot for replay and debugging, backed by 3,400+ backend tests.",
      "Raised per-robot upload throughput 8×, from 256 KiB/s to 2 MiB/s, with server-side rate control and signed, hash-verified uploads.",
      "Established company security policy, device management, security keys, firewalls, Tailscale VPN access, and SPF, DKIM, and DMARC email authentication.",
      "Optimized Jetson Orin Nano drivers and Linux to reclaim memory for on-board models and keep the robot runtime responsive.",
      "Engineered a MuJoCo reinforcement-learning simulation for LeLamp, exposing deterministic episodes through a REST/MCP API with 200+ tests.",
      // "Cut hiring-tool idle requests from 370/min to zero and evaluation-run bandwidth by 90%+ through caching and removing unnecessary requests; integrated Slack webhooks into the hiring pipeline.",
      // "Forked Rerun into a web playback tool for the mechanical team and hardened the Blender-to-robot animation pipeline for an internal demo.",
      // "Shipped 3+ internal tools in the first two weeks, working daily across mechanical, electrical, animation, product, and brand teams as requirements evolved.",
    ],
  },
  {
    role: "AI Content and Communications Specialist",
    company: "Vancouver Island University",
    location: "Nanaimo, BC",
    period: "June 2026 – Sept 2026",
    bullets: [
      "Architected a centralized AI Content Hub website giving students, faculty, and staff AI literacy resources and workflows.",
      "Co-developed university-wide generative AI policy and ethics frameworks with the VIU President's working group.",
      "Evaluated data privacy and security implications of emerging AI tools to shape institutional guidance.",
    ],
  },
  {
    role: "Web Developer",
    company: "Vancouver Island University — Political Studies",
    location: "Nanaimo, BC",
    period: "Feb 2026 – June 2026",
    bullets: [
      "Evaluated and selected optimal web hosting solutions, coordinating with university IT to configure DNS records.",
      "Managed CMS repositories and developed custom CSS/JS to enhance site design and functionality.",
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
    role: "Core Maintainer",
    company: "DogeHouse",
    location: "Remote",
    period: "Mar 2021 \u2013 May 2021",
    github: "https://github.com/benawad/dogehouse",
    bullets: [
      "Core Maintainer & #2 All-Time Contributor for a distributed real-time social platform with 9,000+ GitHub Stars.",
      "Optimized WebSocket data flow for 3,500+ peak concurrent voice users, integrating core audio streaming features.",
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
