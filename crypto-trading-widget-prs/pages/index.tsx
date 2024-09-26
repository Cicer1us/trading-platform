import React from 'react';
import Typography from '@mui/material/Typography';
import theme from 'theme/theme';
import { Layout } from 'layouts/Layout';
import { MetaTags } from 'components/MetaTags/MetaTags';
import { CustomGrid } from 'features/homepage/CustomGrid';
import { Examples } from 'features/homepage/Examples';
import { MOBILE_BREAKPOINT_KEY } from '../src/constants';
import Box from '@mui/material/Box';

const LandingPage = () => {
  return (
    <>
      <MetaTags
        title="AllPay Widget"
        description="Welcome to the bitoftrade Widget. It can be embedded into any webpage, enabling your users to link their wallets, make cryptocurrency payments, trade fungible tokens, and purchase NFT all without ever leaving the hosting website."
        image={`https://bitoftrade.com/images/newImages/logo.png`}
        url={`https://allpay.bitoftrade.com/`}
      />
      <Layout>
        <Box>
          <Typography
            variant="h1"
            sx={{
              padding: 0,
              marginBottom: 3,
              [theme.breakpoints.down('md')]: {
                fontSize: '48px',
              },
              [theme.breakpoints.down(MOBILE_BREAKPOINT_KEY)]: {
                marginBottom: 1,
                fontSize: '32px',
              },
            }}
          >
            {'AllPay Widget'}
          </Typography>
          <CustomGrid />
        </Box>

        <Box
          sx={{
            backgroundImage: 'url(/images/gradients/backGradient.svg)',
            backgroundPosition: 'right',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '60%',
            [theme.breakpoints.down(MOBILE_BREAKPOINT_KEY)]: {
              backgroundSize: 'contain',
            },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              paddingTop: '100px',
              fontWeight: '700',
              [theme.breakpoints.down('md')]: {
                fontSize: '48px',
              },
              [theme.breakpoints.down(MOBILE_BREAKPOINT_KEY)]: {
                fontSize: '32px',
              },
            }}
          >
            {'Who can use our widget?'}
          </Typography>
          <Examples />
        </Box>
      </Layout>
    </>
  );
};

export default LandingPage;
