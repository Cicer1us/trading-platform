import React, { useEffect } from 'react';
import { MetaTags } from 'components/MetaTags/MetaTags';
import { Layout } from 'layouts/Layout';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';

const Customisation: React.FC = () => {
  const theme = useTheme();

  useEffect(() => {
    document.body.style.backgroundColor = theme.palette.background.default;
    const script = document.createElement('script');

    script.src =
      process.env.NEXT_PUBLIC_CRYPTO_TRADING_WIDGET_URL ??
      'https://unpkg.com/@bitoftrade/crypto-trading-widget-sdk/build/index.js';
    script.onload = () => {
      const crLib = window.CryptoTradingWidget;
      crLib.widgetCustomisationPanel('crypto-widget');
    };

    document.head.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <MetaTags
        title="AllPay Customization"
        description="Design your widget today! Adjust the widget to your brand colors, choose what networks to work with."
        image={`https://bitoftrade.com/images/newImages/logo.png`}
        url={`https://allpay.bitoftrade.com/customisation`}
      />
      <Layout>
        <div id={'crypto-widget'} style={{ minHeight: 1500, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress size={80} sx={{ marginTop: '25vh' }} />
        </div>
      </Layout>
    </>
  );
};

export default Customisation;
