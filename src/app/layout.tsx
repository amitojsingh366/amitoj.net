import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";

const jetBrainsMono = localFont({
  src: "../../public/fonts/jetbrains-mono-latin.woff2",
  weight: "300 800",
  style: "normal",
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Amitoj Singh",
  description: "Amitoj's Portfolio",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Amitoj Singh",
    description: "Amitoj's Portfolio",
    images: ["https://avatars.githubusercontent.com/u/35400192?v=4"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jetBrainsMono.variable}>
      <body className={jetBrainsMono.className}>{children}</body>
    </html>
  );
}
