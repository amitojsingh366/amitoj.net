import "../styles/globals.css";
import Head from 'next/head';
import { AppProps } from "next/app";
import ReactModal from 'react-modal';
import { ColorMode, useColorMode } from "../hooks/useColorMode";
import { useEffect } from "react";

export default function MyApp({ Component, pageProps }: AppProps) {
  const colorMode = useColorMode().mode;

  useEffect(() => {
    if (!document) return;
    ReactModal.setAppElement("#__next");
    colorMode === ColorMode.dark ?
      document.documentElement.classList.add(ColorMode.dark) :
      document.documentElement.classList.remove(ColorMode.dark)
  }, [colorMode])

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <title>Amitoj Singh</title>
        <link rel="manifest" href="/manifest.json" />
        <link
          href="/favicon.ico"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link rel="apple-touch-icon" href="/apple-icon.png"></link>
        <meta name="theme-color" content="#111827" />
      </Head>
      <Component {...pageProps} />
    </>);
}
