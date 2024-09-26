import React from 'react';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { NFT_PORTFOLIO_ROUTE } from '../../../../constants';
import { SRedirectionBoxPaper } from './styled';

export const ListingRedirectionBox: React.FC = () => {
  return (
    <SRedirectionBoxPaper>
      <Typography variant="h3" mb={3}>
        {'NFT Portfolio.'}
      </Typography>
      <Typography mb={6}>{'Open the app to see your NFTs and create an NFT listing.'}</Typography>
      <Button component={'a'} variant="contained" href={NFT_PORTFOLIO_ROUTE}>
        {'Go to portfolio'}
      </Button>
    </SRedirectionBoxPaper>
  );
};
