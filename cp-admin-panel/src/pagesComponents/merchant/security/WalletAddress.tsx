import { Box, Typography } from '@mui/material';
import { useContext } from 'react';
import { PrimaryButton } from 'src/@core/components/buttons/PrimaryButton';
import { AuthContext } from 'src/providers/AuthProvider';
import { StyledSecurityContentWrapper, StyledUrlTextField } from './styled';
import { useModalState } from 'src/store/modal/hooks/useModalState';
import { ModalType } from 'src/store/modal/types';

export const WalletAddress: React.FC = () => {
  const { openModal } = useModalState();
  const { user } = useContext(AuthContext);

  return (
    <StyledSecurityContentWrapper>
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} mb={7}>
        <Typography variant='h5'>{'Wallet address'}</Typography>

        <Box display={'flex'} gap={2} flexGrow={1} justifyContent={'flex-end'}>
          <PrimaryButton fullWidth onClick={() => openModal({ modalType: ModalType.MERCHANT_WALLET_ADDRESS })}>
            {'Set wallet address'}
          </PrimaryButton>
        </Box>
      </Box>

      <Box display={'flex'} flexDirection={'column'} gap={4}>
        {user?.walletAddress ? (
          <>
            <StyledUrlTextField value={user?.walletAddress} variant='outlined' autoComplete='on' fullWidth disabled />
          </>
        ) : (
          <Typography variant='body1'>{'Please set wallet address'}</Typography>
        )}
      </Box>
    </StyledSecurityContentWrapper>
  );
};
