import React, { useEffect } from 'react';
import { Box, Button, Typography, styled } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { CONNECTIONS } from 'utils/connections';
import { useConnectWallet } from 'hooks/useConnectWallet';
import { isWalletConnectDenied, isCoinbaseWalletDenied } from 'utils/common';
import { WalletIcon } from './Icons/WalletIcon';

const StyledConnectWalletButton = styled(Button, {
  name: 'StyledConnectWalletButton',
})(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  gap: theme.spacing(4),
  width: '100%',
  height: 80,
  padding: theme.spacing(5),
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.secondary.main,
  fontSize: 14,
  textTransform: 'none',
}));

const StyledCheckIconWrapper = styled(Box, {
  name: 'StyledCheckIconWrapper',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 60,
  height: 60,
  marginBottom: theme.spacing(6),
  borderRadius: '50%',
  color: theme.palette.error.main,
  backgroundColor: theme.palette.error.light,
}));

export const ConnectWalletScreen: React.FC = (): JSX.Element => {
  const { mutate, reset, isError, error } = useConnectWallet();

  useEffect(() => {
    if (isWalletConnectDenied(error) || isCoinbaseWalletDenied(error)) reset();
  }, [error]);

  const isNotDeniedByUser = !isWalletConnectDenied(error) && !isCoinbaseWalletDenied(error);

  return (
    <>
      {!isError ? (
        <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} flexGrow={1} gap={2.5}>
          <Typography variant={'h5'} textAlign={'center'}>
            {'Connect wallet'}
          </Typography>
          <Box display={'flex'} flexDirection={'column'} gap={1.5}>
            {Object.values(CONNECTIONS)
              .filter(connection => connection.shouldDisplay())
              .map(connection => (
                <StyledConnectWalletButton
                  variant={'contained'}
                  key={connection.type}
                  onClick={() => mutate(connection)}
                >
                  {connection.type}
                  <WalletIcon connectionType={connection.type} />
                </StyledConnectWalletButton>
              ))}
          </Box>
        </Box>
      ) : (
        <>
          {isNotDeniedByUser && (
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} flexGrow={1}>
              <StyledCheckIconWrapper>
                <ErrorOutlineIcon />
              </StyledCheckIconWrapper>
              <Typography variant="h5" mb={4}>
                {'Error connecting'}
              </Typography>
              <Typography variant="body1" textAlign={'center'} mb={10} color={'text.secondary'}>
                {`The connection attempt failed. Please click try again and follow the steps to connect in your wallet.`}
              </Typography>
              <Button onClick={() => reset()}>{'Try again'}</Button>
            </Box>
          )}
        </>
      )}
    </>
  );
};
