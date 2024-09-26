import '@/styles/normalize.css';
import '@/styles/vars.css';
import '@/styles/fonts/fonts.css';
import '@/styles/globals.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import initializeGTM from '../analytics/initializeGTM';
import NextNprogress from 'nextjs-progressbar';
import CustomToastContainer from '@/components/CustomToastContainer/CustomToastContainer';
import AppProvider from 'providers/AppProvider';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import WalletProvider from 'providers/WalletProvider';
import Zendesk from 'react-zendesk';
import ZENDESK_SETTINGS from 'constants/zendesk-settings';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  const router = useRouter();

  useEffect(() => initializeGTM(router.pathname), []);
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
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <WalletProvider>
            <Zendesk defer zendeskKey={process.env.NEXT_PUBLIC_ZENDESK_API_KEY} {...ZENDESK_SETTINGS} />
            <AppProvider props={pageProps}>
              <NextNprogress
                color="var(--green)"
                startPosition={0.3}
                stopDelayMs={200}
                height={4}
                showOnShallow={true}
              />
              <Component {...pageProps} />
              <ReactQueryDevtools />
            </AppProvider>
            <CustomToastContainer />
          </WalletProvider>
        </Provider>
      </QueryClientProvider>
    </>
  );
};

export default MyApp;
