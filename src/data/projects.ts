export interface Project {
  name: string;
  year: number;
  description: string;
  tech: string[];
  github?: string;
  link?: string;
}

export const projects: Project[] = [
  {
    name: "Signalhouse",
    year: 2026,
    description:
      "Engineered a swing-trading orchestration platform scanning over 330 TSX/CDR/ETF symbols every 15 minutes. Built a multi-stage analysis pipeline combining technical indicators, sentiment inputs, and commodity-correlation signals across a web dashboard, iOS alert app, and Discord bot integrations.",
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
    description:
      "Served as Technical Lead for a cross-platform Sikh education app centered on Ik Saakhi Har Roz, featuring Sikh history stories, Nitnem/Gurbani sections, and Gurmat Q&A. Drove major updates including a serverless architecture shift, smaller app size, performance improvements, and refreshed UI.",
    tech: ["iOS", "Android", "Serverless", "Mobile UI", "Education"],
    link: "https://www.sikhsaakhi.com/download",
  },
  {
    name: "Neurodrive",
    year: 2024,
    description:
      "BCI-controlled racing game built in Unity, utilizing Muse 2 EEG signal processing for velocity control and gyroscope data for steering. Features rigid-body physics, multiplayer netcode, and hardware integration.",
    tech: ["Unity", "C#", "EEG/BCI", "Multiplayer Netcode"],
  },
  {
    name: "HiddenFrame",
    year: 2024,
    description:
      "Full-stack steganography tool using C++ for high-performance image processing, Crow for the REST API, and Remix.js for the UI. Managed complete DevOps lifecycle including DNS, SSL, and Caddy reverse proxy.",
    tech: ["C++", "Crow", "Remix.js", "Linux", "Caddy"],
    github: "https://github.com/csci265-team/HiddenFrame",
  },
  {
    name: "Arch Homelab",
    year: 2025,
    description:
      "Hardened Arch Linux server running a fully Dockerized microservices stack for media, DNS, and storage. Secured with UFW ingress rules and Cloudflare Zero Trust tunnels.",
    tech: ["Arch Linux", "Docker", "Cloudflare", "Caddy", "UFW"],
  },
  {
    name: "RPi iPod Emulator",
    year: 2024,
    description:
      "Bluetooth-to-USB bridge emulating the iPod Accessory Protocol on a Raspberry Pi. Custom udev rules and bash automation to auto-detect connections, enabling wireless audio on a legacy car head unit.",
    tech: ["Raspberry Pi", "Bash", "udev", "Bluetooth", "USB"],
  },
  {
    name: "GPT-3 Discord Bot",
    year: 2022,
    description:
      "Context-aware chatbot built with Node.js and discord.js before the ChatGPT release. Custom state management for multi-channel context and a Puppeteer-based web scraper for real-time search injection.",
    tech: ["Node.js", "discord.js", "Puppeteer", "GPT-3"],
  },
];
