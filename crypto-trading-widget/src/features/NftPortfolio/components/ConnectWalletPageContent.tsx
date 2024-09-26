import { useContext } from 'react';
import { WalletCtx, WalletCtxInterface } from '../../../context/WalletContext';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import { Grid, Typography } from '@mui/material';
import { Chain } from 'utils/chains';

export const ConnectWalletPageContent: React.FC = () => {
  const { account, connectWallet, selectChain } = useContext(WalletCtx) as WalletCtxInterface;

  return (
    <Container maxWidth={'xl'} sx={{ marginTop: 2 }}>
      <Card
        sx={{
          height: 618,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            maxWidth: 360,
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
          }}
        >
          <Typography variant={'h5'} textAlign={'center'} marginBottom={2}>
            {!account ? 'Connect Wallet' : 'Wrong Network'}
          </Typography>
          <Typography variant={'body2'} textAlign={'center'} color={'text.secondary'} marginBottom={6}>
            {!account
              ? 'You should connect wallet to see your NFT.'
              : 'Currently we support only Ethereum and Polygon networks.'}
          </Typography>
          {!account ? (
            <Button fullWidth variant="contained" onClick={connectWallet}>
              {'Connect Wallet'}
            </Button>
          ) : (
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <Button variant="contained" fullWidth onClick={() => selectChain(Chain.Ethereum)}>
                  {'Change to Ethereum'}
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <Button variant="contained" fullWidth onClick={() => selectChain(Chain.Polygon)}>
                  {'Change to Polygon'}
                </Button>
              </Grid>
            </Grid>
          )}
        </Box>
      </Card>
    </Container>
  );
};
