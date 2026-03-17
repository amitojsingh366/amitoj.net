import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ThemeProvider } from "@/modules/ThemeProvider";
import { Header } from "@/components/Header";
import "@/styles/globals.css";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Amitoj Singh",
  description: "Amitoj Singh - Software Developer",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Amitoj Singh",
    description: "Amitoj Singh - Software Developer",
    images: ["https://avatars.githubusercontent.com/u/35400192?v=4"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var m=localStorage.getItem('@app/colorMode');if(m!=='light')document.documentElement.classList.add('dark')})()`,
          }}
        />
      </head>
      <body
        className={`${montserrat.className} bg-white dark:bg-gray-900 transition-colors duration-500`}
      >
        <ThemeProvider>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
