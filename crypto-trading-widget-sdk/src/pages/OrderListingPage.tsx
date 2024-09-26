import React, { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme/theme';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import store from '../redux/store';
import { WalletContext } from '../context/WalletContext';
import { OrdersListing } from '../features/OrdersListing';
import { Chain } from '../utils/chains';
import { createPaletteOverrides, WidgetType } from 'redux/customisationSlice';
import { WalletProvider } from 'providers/WalletProvider';

const queryClient = new QueryClient();

const defaultListingWallet = '0x08E194787b65f86AA3C2990F7F009E9603Bbff25';

export const OrderListingPage: React.FC = () => {
  useEffect(() => {
    window.CryptoTradingWidget.initNftWidget('widget', {
      paletteOverrides: createPaletteOverrides(),
      widgetType: WidgetType.NFT,
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <WalletProvider>
            <WalletContext>
              <>
                <CssBaseline />
                <div id="widget" />
                <OrdersListing
                  account={(process.env.REACT_APP_LISTING_WALLET ?? defaultListingWallet).toLowerCase()}
                  chain={Chain.Polygon}
                />
              </>
            </WalletContext>
          </WalletProvider>
        </Provider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};
