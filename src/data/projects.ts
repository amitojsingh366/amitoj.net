export interface Project {
  name: string;
  year: number;
  bullets: string[];
  tech: string[];
  github?: string;
  link?: string;
}

export const projects: Project[] = [
  {
    name: "Signalhouse",
    year: 2026,
    bullets: [
      "Engineered a swing-trading orchestration platform scanning over 330 TSX/CDR/ETF symbols every 15 minutes.",
      "Built a multi-stage analysis pipeline combining technical indicators, sentiment inputs, and commodity-correlation signals.",
      "Delivered a connected ecosystem spanning a web dashboard, iOS alert app, and Discord bot integrations.",
    ],
    tech: [
      "Next.js 14",
      "FastAPI",
      "SwiftUI",
      "PostgreSQL",
      "TA-Lib",
      "Discord.js",
      "Docker",
    ],
    github: "https://github.com/amitojsingh366/signalhouse",
  },
  {
    name: "Saakhi",
    year: 2022,
    bullets: [
      "Served as Technical Lead for a cross-platform Sikh education app centered on Ik Saakhi Har Roz.",
      "Shipped content modules for Sikh history stories, Nitnem/Gurbani sections, and Gurmat Q&A.",
      "Built and maintained a full Cloudflare stack using Workers, D1, and R2, alongside major app updates for smaller size, performance improvements, and a refreshed UI.",
    ],
    tech: [
      "iOS",
      "Android",
      "Cloudflare Workers",
      "Cloudflare D1",
      "Cloudflare R2",
      "Mobile UI",
      "Education",
    ],
    link: "https://www.sikhsaakhi.com/download",
  },
  {
    name: "Neurodrive",
    year: 2024,
    bullets: [
      "Built a BCI-controlled racing game in Unity using Muse 2 EEG signals for velocity control.",
      "Implemented rigid-body physics, multiplayer netcode, and hardware integration with gyroscope steering.",
    ],
    tech: ["Unity", "C#", "EEG/BCI", "Multiplayer Netcode"],
  },
  {
    name: "HiddenFrame",
    year: 2024,
    bullets: [
      "Developed a full-stack steganography tool with C++ image processing, Crow API services, and a Remix.js frontend.",
      "Managed end-to-end DevOps operations including DNS, SSL, and Caddy reverse proxy configuration.",
    ],
    tech: ["C++", "Crow", "Remix.js", "Linux", "Caddy"],
    github: "https://github.com/csci265-team/HiddenFrame",
  },
  {
    name: "Arch Homelab",
    year: 2025,
    bullets: [
      "Architected and maintained a hardened Arch Linux server running a fully Dockerized stack for media, DNS, and storage.",
      "Secured remote access with UFW ingress controls and Cloudflare Zero Trust tunnels.",
    ],
    tech: ["Arch Linux", "Docker", "Cloudflare", "Caddy", "UFW"],
  },
  {
    name: "RPi iPod Emulator",
    year: 2024,
    bullets: [
      "Engineered a Bluetooth-to-USB bridge on Raspberry Pi to emulate the iPod Accessory Protocol.",
      "Wrote custom udev rules and Bash automation to enable wireless audio on a legacy car head unit.",
    ],
    tech: ["Raspberry Pi", "Bash", "udev", "Bluetooth", "USB"],
  },
  {
    name: "GPT-3 Discord Bot",
    year: 2022,
    bullets: [
      "Built a context-aware chatbot with Node.js and discord.js before the ChatGPT web release.",
      "Implemented multi-channel state management and a Puppeteer-based scraper for real-time search injection.",
    ],
    tech: ["Node.js", "discord.js", "Puppeteer", "GPT-3"],
  },
];
