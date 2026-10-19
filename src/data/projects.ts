export interface Project {
  name: string;
  displayLines: string[];
  subtitle: string[];
  year: number;
  period?: string;
  bullets: string[];
  tech: string[];
  github?: string;
  link?: string;
}

export const projects: Project[] = [
  {
    name: "Trojan Badge",
    displayLines: ["HackTheNorth", "2026"],
    subtitle: ["Trojan Badge", "University of Waterloo"],
    year: 2026,
    bullets: [
      "Built a physical multiplayer zombie-tag game on event badges with C/C++ firmware for ESP32-C3 microcontrollers using ESP-IDF and FreeRTOS.",
      "Used ESP-NOW for sub-second proximity detection, human/zombie tagging, and synchronized round countdowns without relying on local Wi-Fi.",
      "Integrated Sentry firmware logging and streamed live match telemetry to a web dashboard through Cloudflare Workers, Durable Objects, and WebSockets.",
      "Completed Solana's scavenger hunt, winning a Solana Seeker phone after deploying a devnet program and an x402 payment endpoint.",
    ],
    tech: [
      "ESP32-C3",
      "C/C++",
      "ESP-IDF",
      "FreeRTOS",
      "ESP-NOW",
      "Sentry",
      "Cloudflare Workers",
      "Durable Objects",
      "WebSockets",
      "React",
    ],
    link: "https://github.com/amitojsingh366/htn2026",
  },
  {
    name: "A's Watches",
    displayLines: ["A's", "Watches"],
    subtitle: [
      "Bespoke automatic watch store",
      "Parts configurator · payments · shipping",
    ],
    year: 2026,
    bullets: [
      "Built a watch parts configurator with 10K+ combinations so customers could choose every part and reduce back-and-forth with the owner.",
      "Shipped the full store solo with Next.js, Cloudflare, Stripe payments, Auth0, an admin panel, and shipping tracking.",
      "Composited layered product images server-side with Photon and added per-page SEO, reaching 98 on PageSpeed Insights.",
      "Self-hosted Rybbit for analytics and telemetry, iterating with the client as requirements changed.",
    ],
    tech: [
      "Next.js",
      "Tailwind",
      "Cloudflare",
      "Stripe",
      "Auth0",
      "Photon",
      "Rybbit",
      "SEO",
    ],
    link: "https://aswatches.net",
  },
  {
    name: "Signalhouse",
    displayLines: ["Signal", "House"],
    subtitle: [
      "Swing-trading orchestration",
      "Web dashboard · iOS app · Discord bots",
    ],
    year: 2026,
    bullets: [
      "Engineered a swing-trading orchestration platform scanning over 330 TSX/CDR/ETF symbols every 15 minutes.",
      "Built a multi-stage analysis pipeline combining technical indicators, sentiment inputs, and commodity-correlation signals.",
      "Delivered a connected ecosystem spanning a web dashboard, iOS alert app, and Discord bot integrations.",
      "Integrated OpenRouter API vision and OCR to sync portfolio holdings from images.",
    ],
    tech: [
      "Next.js 14",
      "FastAPI",
      "SwiftUI",
      "PostgreSQL",
      "TA-Lib",
      "OpenRouter API",
      "Discord.js",
      "Docker",
    ],
    github: "https://github.com/amitojsingh366/signalhouse",
  },
  {
    name: "AI Scheduling System",
    displayLines: ["AI", "Scheduler"],
    subtitle: [
      "Automated booking for a local pet groomer",
      "Smart calendar · conversational SMS agent",
    ],
    year: 2026,
    bullets: [
      "Deployed an automated scheduling platform for a local pet groomer, saving 2-3 hours daily.",
      "Built a responsive Next.js and Tailwind smart calendar dashboard for streamlined availability management.",
      "Integrated Twilio with the Claude API to create a conversational AI agent that handles client bookings via SMS.",
    ],
    tech: ["Next.js", "Tailwind", "Cloudflare Workers", "Twilio", "Claude API"],
  },
  {
    name: "Saakhi",
    displayLines: ["Saakhi"],
    subtitle: ["Technical lead", "Sikh education app · Ik Saakhi Har Roz"],
    year: 2020,
    period: "2020 — Present",
    bullets: [
      "Rebuilt an end-to-end mobile product in Java/Kotlin and SwiftUI, averaging 97% size reduction (80MB to ~2MB).",
      "Architected serverless Cloudflare Workers backend with D1 and R2, reducing load times by 80%.",
      "Managed app releases and targeted marketing strategies to successfully scale to 100K+ combined users.",
      "Extensively utilized Android connectivity APIs (NetworkCallback, WifiManager, BluetoothAdapter) for network state broadcasting and seamless external audio playback.",
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
    displayLines: ["Neuro", "Drive"],
    subtitle: ["BCI-controlled racing game", "Muse 2 EEG · Unity"],
    year: 2024,
    bullets: [
      "Built a BCI-controlled racing game in Unity using Muse 2 EEG signals for velocity control.",
      "Implemented gyroscope head-tilt steering and rigid-body physics using quaternion rotation and velocity math.",
      "Built multiplayer netcode on Unity Transport, handling lobby creation and abstracting IP and port-forwarding logic.",
    ],
    tech: ["Unity", "C#", "EEG/BCI", "Unity Transport", "Multiplayer Netcode"],
  },
  {
    name: "HiddenFrame",
    displayLines: ["Hidden", "Frame"],
    subtitle: ["Full-stack steganography tool", "C++ pipeline · Remix frontend"],
    year: 2024,
    bullets: [
      "Developed a full-stack steganography tool with C++ image processing, Crow API services, and a Remix.js frontend.",
      "Deployed on AWS EC2 with Ubuntu, configured security groups and IAM roles, and managed the DevOps cycle through CI/CD.",
      "Managed end-to-end DevOps operations including DNS, SSL, and Caddy reverse proxy configuration.",
    ],
    tech: ["C++", "Crow", "Remix.js", "SQLite", "Linux", "Caddy", "AWS EC2", "CI/CD"],
    github: "https://github.com/csci265-team/HiddenFrame",
  },
  {
    name: "Multi-Cloud Kubernetes Homelab",
    displayLines: ["K8s", "Homelab"],
    subtitle: ["Four-node multi-cloud cluster", "OCI · on-prem · Tailscale mesh"],
    year: 2025,
    bullets: [
      "Operate a 4-node k3s cluster spanning two OCI regions and an on-premise server, networked entirely over a Tailscale WireGuard mesh.",
      "Configured hybrid nodes across a local x86-64 server and three cloud OCI Ampere ARM instances.",
      "Implemented virtual IP load balancing using Kube-vip, MetalLB, and Traefik Ingress for redundancy.",
    ],
    tech: [
      "k3s",
      "OCI",
      "Docker",
      "PostgreSQL",
      "Tailscale",
      "Traefik",
      "Kube-vip",
      "MetalLB",
    ],
  },
  {
    name: "RPi iPod Emulator",
    displayLines: ["RPi iPod", "Emulator"],
    subtitle: ["Bluetooth-to-USB bridge", "iPod Accessory Protocol"],
    year: 2024,
    bullets: [
      "Engineered a Bluetooth-to-USB bridge on Raspberry Pi to emulate the iPod Accessory Protocol.",
      "Wrote Embedded C++, custom udev rules, and Bash automation to enable wireless audio on a legacy car head unit.",
    ],
    tech: ["Raspberry Pi", "Embedded C++", "Bash", "udev", "Bluetooth", "USB"],
  },
  {
    name: "GPT-3 Discord Bot",
    displayLines: ["GPT-3", "Bot"],
    subtitle: ["Context-aware Discord chatbot", "Shipped before ChatGPT launched"],
    year: 2022,
    bullets: [
      "Built a context-aware chatbot with Node.js and discord.js before the ChatGPT web release.",
      "Implemented multi-channel state management and a Puppeteer-based scraper for real-time search injection.",
    ],
    tech: ["Node.js", "discord.js", "Puppeteer", "GPT-3"],
  },
];
