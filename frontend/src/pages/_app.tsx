import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Inter } from "next/font/google";
import { Container, SSRProvider } from "react-bootstrap";
import style from "@/styles/App.module.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Time mark -- share your time</title>
        <meta name="description" content="A full-stack Nextjs app byAllengl" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SSRProvider>
        <div className={inter.className}>
          <NavBar />
          <main>
            <Container className={style.pageContainer}>
              <Component {...pageProps} />
            </Container>
          </main>
          <Footer />
        </div>
      </SSRProvider>
    </>
  );
}
