import { useConnectWallet } from 'src/hooks/useConnectWallet';
import { Box, Typography } from '@mui/material';
import { DefaultButton } from '../../buttons/DefaultButton';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { CONNECTIONS } from 'src/connection/utils';
import { StyledConnectWalletButton, StyledIconWrapper, StyledCheckIconWrapper } from './styled';

export const ConnectWalletModal: React.FC = () => {
  const { mutate, reset, isError } = useConnectWallet();

  return (
    <Box p={10}>
      {!isError ? (
        <>
          <Typography variant='h5' textAlign={'center'} mb={8}>
            {'Connect Wallet'}
          </Typography>
          <Box display={'flex'} flexDirection={'column'} gap={6}>
            {CONNECTIONS.map(connection => (
              <StyledConnectWalletButton key={connection.type} onClick={() => mutate(connection)}>
                <StyledIconWrapper>
                  <AccountBalanceWalletIcon /> {/* TODO: add different icon to each connector */}
                </StyledIconWrapper>
                {connection.type}
              </StyledConnectWalletButton>
            ))}
          </Box>
        </>
      ) : (
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
          <StyledCheckIconWrapper>
            <ErrorOutlineIcon />
          </StyledCheckIconWrapper>
          <Typography variant='h5' mb={4}>
            {'Error connecting'}
          </Typography>
          <Typography variant='body1' textAlign={'center'} mb={10} color={'text.secondary'}>
            {'The connection attempt failed. Please click try again and follow the steps to connect in your wallet.'}
          </Typography>
          <DefaultButton onClick={() => reset()}>{'Try again'}</DefaultButton>
        </Box>
      )}
    </Box>
  );
};
