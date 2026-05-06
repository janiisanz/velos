// _app.js: archivo principal de la tienda headless.
import Head from 'next/head';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import Layout from '../components/Layout';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap'
});

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </Head>
      <div className={inter.variable}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </div>
    </>
  );
}
