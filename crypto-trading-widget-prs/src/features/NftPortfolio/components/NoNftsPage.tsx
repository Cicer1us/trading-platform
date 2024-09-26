import React from 'react';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Typography, styled } from '@mui/material';

const SNoNftCard = styled(Card)({
  height: 618,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const NoNftsPage: React.FC = () => {
  return (
    <Container maxWidth={'xl'}>
      <SNoNftCard>
        <Box width={320}>
          <Typography variant={'h5'} textAlign={'center'} marginBottom={2}>
            {`Don't have any NFT`}
          </Typography>
          <Typography variant={'body2'} textAlign={'center'} color={'text.secondary'} marginBottom={6}>
            {`Sorry, you don't have any NFT's now. You can add new NFT's`}
          </Typography>
        </Box>
      </SNoNftCard>
    </Container>
  );
};
