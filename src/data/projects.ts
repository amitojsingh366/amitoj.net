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
      "Implemented rigid-body physics, multiplayer netcode, and hardware integration with gyroscope steering.",
    ],
    tech: ["Unity", "C#", "EEG/BCI", "Multiplayer Netcode"],
  },
  {
    name: "HiddenFrame",
    displayLines: ["Hidden", "Frame"],
    subtitle: ["Full-stack steganography tool", "C++ pipeline · Remix frontend"],
    year: 2024,
    bullets: [
      "Developed a full-stack steganography tool with C++ image processing, Crow API services, and a Remix.js frontend.",
      "Managed end-to-end DevOps operations including DNS, SSL, and Caddy reverse proxy configuration.",
    ],
    tech: ["C++", "Crow", "Remix.js", "Linux", "Caddy"],
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
      "Wrote custom udev rules and Bash automation to enable wireless audio on a legacy car head unit.",
    ],
    tech: ["Raspberry Pi", "Bash", "udev", "Bluetooth", "USB"],
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
