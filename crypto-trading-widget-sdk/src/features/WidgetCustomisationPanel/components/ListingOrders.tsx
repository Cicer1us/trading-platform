import React from 'react';
import { Box, Link, Typography } from '@mui/material';
import { NFT_PORTFOLIO_ROUTE } from '../../../constants';

export const ListingOrders: React.FC = () => {
  return (
    <>
      <Box>
        <Typography marginBottom={1}>{'Complete 2 steps to set up the widget:'}</Typography>
        <Typography>
          1. To manage your NFT listings and get listing ID, <Link href={NFT_PORTFOLIO_ROUTE}>go to the app</Link>.
          <br />
          2. Copy listing ID from orders table in the app. Replace orderHash with listing ID.
        </Typography>
      </Box>
    </>
  );
};
