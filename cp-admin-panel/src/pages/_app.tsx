import { ReactNode, useMemo } from 'react';
import Head from 'next/head';

import { Router } from 'next/router';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';

import NProgress from 'nprogress';
import { Toaster } from 'react-hot-toast';
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast';
import Spinner from 'src/@core/components/spinner';

import { CacheProvider } from '@emotion/react';
import type { EmotionCache } from '@emotion/cache';
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache';

import themeConfig from 'src/configs/themeConfig';

import UserLayout from 'src/layouts/UserLayout';
import ThemeComponent from 'src/@core/theme/ThemeComponent';
import AuthGuard from 'src/@core/components/auth/AuthGuard';
import GuestGuard from 'src/@core/components/auth/GuestGuard';

import { AuthProvider } from 'src/providers/AuthProvider';
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from 'src/store';

import 'react-perfect-scrollbar/dist/css/styles.css';
import 'src/iconify-bundle/icons-bundle-react'; // TODO: check if it is used and remove if not
import '../../styles/globals.css';
import { ModalContainer } from 'src/@core/components/modal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

type ExtendedAppProps = AppProps & {
  Component: NextPage;
  emotionCache: EmotionCache;
};

type GuardProps = {
  authGuard: boolean;
  guestGuard: boolean;
  children: ReactNode;
};

const clientSideEmotionCache = createEmotionCache();

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start();
  });
  Router.events.on('routeChangeError', () => {
    NProgress.done();
  });
  Router.events.on('routeChangeComplete', () => {
    NProgress.done();
  });
}

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>;
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>;
  }

  return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>;
};

const App = (props: ExtendedAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const contentHeightFixed = Component.contentHeightFixed ?? false;
  const getLayout =
    Component.getLayout ?? (page => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>);
  const setConfig = Component.setConfig ?? undefined;
  const authGuard = Component.authGuard ?? true;
  const guestGuard = Component.guestGuard ?? false;

  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CacheProvider value={emotionCache}>
          <Head>
            <title>{`${themeConfig.templateName} - Payment`}</title>
            <meta name='description' content={`${themeConfig.templateName} - Some description.`} />
            <meta name='keywords' content='Crypto Payment' />
            <meta name='viewport' content='initial-scale=1, width=device-width' />
          </Head>

          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
                <SettingsConsumer>
                  {({ settings }) => (
                    <ThemeComponent settings={settings}>
                      <Guard authGuard={authGuard} guestGuard={guestGuard}>
                        {getLayout(<Component {...pageProps} />)}
                        <ModalContainer />
                      </Guard>
                      <ReactHotToast>
                        <Toaster position={settings.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
                      </ReactHotToast>
                    </ThemeComponent>
                  )}
                </SettingsConsumer>
              </SettingsProvider>
            </AuthProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </CacheProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
