import React, { useEffect, useState } from 'react';
import { MetaTags } from 'components/MetaTags/MetaTags';
import { Layout } from 'layouts/Layout';
import { useRouter } from 'next/router';
import { isString } from 'next/dist/build/webpack/plugins/jsconfig-paths-plugin';
import { OrdersListing } from '../../../src/features/OrdersListing';
import { Chain, chainConfigs } from '../../../src/utils/chains';
import { CircularProgress, Typography } from '@mui/material';
import { NFTOrderFromAPI } from '@paraswap/sdk';
import Box from '@mui/material/Box';

export interface WidgetNftProps {
  order: NFTOrderFromAPI;
  chain: Chain;
}

declare global {
  interface Window {
    CryptoTradingWidget: {
      widgetCustomisationPanel: (elementId: string) => void;
      initNftWidget: (elementId: string) => void;
      openOrder: (orderHash: string, chain: number) => void;
    };
  }
}

const ListingForAddress: React.FC = () => {
  const router = useRouter();
  const { address } = router.query;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const script = document.createElement('script');

    script.src =
      process.env.NEXT_PUBLIC_CRYPTO_TRADING_WIDGET_URL ??
      'https://unpkg.com/@bitoftrade/crypto-trading-widget-sdk/build/index.js';
    document.head.appendChild(script);
    script.onload = () => {
      setIsLoading(false);
      window.CryptoTradingWidget.initNftWidget('crypto-widget');
    };
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleNftModalOpen = (props: WidgetNftProps) => {
    if (!isLoading && window.CryptoTradingWidget) {
      window.CryptoTradingWidget.openOrder(props.order.orderHash, chainConfigs[props.chain].chainIdDecimal);
    }
  };

  return (
    <>
      <MetaTags title="NFTs listing" description="" image="" url="" />
      <Layout>
        <div id={'crypto-widget'}></div>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress size={50} sx={{ marginTop: '15vh' }} />
          </Box>
        )}

        {address && !isLoading ? (
          <>
            <Typography marginBottom={2} sx={{ wordWrap: 'break-word' }}>
              Nfts listing for <strong>{address}</strong>
            </Typography>
            <OrdersListing
              account={isString(address) ? address.toLowerCase() : ''}
              chain={Chain.Polygon}
              handleNftModalOpen={handleNftModalOpen}
            />
          </>
        ) : (
          <></>
        )}
      </Layout>
    </>
  );
};

export default ListingForAddress;
