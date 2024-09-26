import '@/styles/normalize.css';
import '@/styles/vars.css';
import '@/styles/fonts/fonts.css';
import '@/styles/globals.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import type { AppProps } from 'next/app';
import NextNprogress from 'nextjs-progressbar';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Zendesk from 'react-zendesk';
import ZENDESK_SETTINGS from 'constants/zendesk-settings';

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  const router = useRouter();

  useEffect(() => storePathValues(), [router.asPath]);

  const storePathValues = () => {
    const storage = globalThis?.sessionStorage;
    if (!storage) return;
    const prevPath = storage.getItem('currentPath');
    storage.setItem('prevPath', prevPath);
    storage.setItem('currentPath', globalThis.location.pathname);
  };

  return (
    <>
      <Zendesk defer zendeskKey={process.env.NEXT_PUBLIC_ZENDESK_API_KEY} {...ZENDESK_SETTINGS} />
      <NextNprogress color="var(--green)" startPosition={0.3} stopDelayMs={200} height={4} showOnShallow={true} />
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
