import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Montserrat } from "next/font/google";
import { ColorMode } from "@/modules/theme";
import { ThemeProvider } from "@/modules/ThemeProvider";
import { Header } from "@/components/Header";
import "@/styles/globals.css";

const montserrat = Montserrat({ subsets: ["latin"] });

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme")?.value;
  const theme =
    themeCookie === ColorMode.light ? ColorMode.light : ColorMode.dark;

  return (
    <html
      lang="en"
      className={theme === ColorMode.dark ? "dark" : ""}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var c=document.cookie.match(/(?:^|; )theme=([^;]*)/);var t=c?decodeURIComponent(c[1]):null;if(!t){t=localStorage.getItem('@app/colorMode')}if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${montserrat.className} bg-white dark:bg-gray-900 transition-colors duration-500`}
      >
        <ThemeProvider initialTheme={theme}>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
