import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { WidgetPage } from './pages/Widget';
import { WidgetNftPage } from './pages/WidgetNftPage';
import { OrderListingPage } from 'pages/OrderListingPage';
import { INIT_NFT_WIDGET, TRADING_WIDGET, NOT_FOUND_PAGE, NFT_LISTING } from 'utils/routes';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from 'theme/theme';
import { Provider } from 'react-redux';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import store from 'redux/store';
import { ToasterAlerts } from 'features/Widget/ToasterAlerts';
import { OngoingTransactionsContext } from 'context/OngoingTransactionsContext';
import { WalletContext } from 'context/WalletContext';
import { WalletProvider } from 'providers/WalletProvider';
import { WidgetCustomization } from 'pages/WidgetCustomisation/WidgetCustomisation';

const useLoadFonts = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', 'https://fonts.googleapis.com/css?family=Inter:300,400,500,700');
    document.head.appendChild(link);
  }, []);
};

const queryClient = new QueryClient();

export const ProvidersWrapper = ({ children }: { children: JSX.Element }) => {
  useLoadFonts();
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <WalletProvider>
            <WalletContext>
              <OngoingTransactionsContext>
                <CssBaseline />
                {children}
                <ToasterAlerts />
              </OngoingTransactionsContext>
            </WalletContext>
          </WalletProvider>
          <ReactQueryDevtools initialIsOpen={true} />
        </QueryClientProvider>
      </Provider>
    </ThemeProvider>
  );
};

export const App = () => {
  return (
    <React.StrictMode>
      <ProvidersWrapper>
        <Router>
          <Routes>
            <Route path={'/'} element={<WidgetCustomization />} />
            <Route path={'*'} element={NOT_FOUND_PAGE} />
            <Route path={TRADING_WIDGET} element={<WidgetPage />} />
            <Route path={INIT_NFT_WIDGET} element={<WidgetNftPage />} />
            <Route path={NFT_LISTING} element={<OrderListingPage />} />
          </Routes>
        </Router>
      </ProvidersWrapper>
    </React.StrictMode>
  );
};
