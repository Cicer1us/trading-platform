import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../src/theme/theme';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToasterAlerts } from 'components/ToasterAlerts';
import { CustomGlobalStyles } from 'theme/global-styles';
import store from 'redux/store';
import { Provider } from 'react-redux';
import { WalletContext } from 'context/WalletContext';

const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter:300,400,500,700&display=swap%22" />
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <WalletContext>
              {CustomGlobalStyles}
              <CssBaseline />
              <Component {...pageProps} />
              <ReactQueryDevtools initialIsOpen={true} />
              <ToasterAlerts />
            </WalletContext>
          </Provider>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
};

export default MyApp;
