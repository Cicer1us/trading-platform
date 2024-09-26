import { Box, Typography } from '@mui/material';
import { useContext } from 'react';
import { PrimaryButton } from 'src/@core/components/buttons/PrimaryButton';
import { SecondaryButton } from 'src/@core/components/buttons/SecondaryButton';
import { AuthContext } from 'src/providers/AuthProvider';
import { useModalState } from 'src/store/modal/hooks/useModalState';
import { ModalType } from 'src/store/modal/types';
import { StyledSecurityContentWrapper, StyledUrlTextField } from './styled';
import { TextFieldStartAdornment } from './TextFieldStartAdornment';

export const Subscription: React.FC = () => {
  const { openModal } = useModalState();
  const { user } = useContext(AuthContext);

  return (
    <StyledSecurityContentWrapper>
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} mb={7}>
        <Typography variant='h5'>{'Webhook subscriptions'}</Typography>

        <Box display={'flex'} gap={2} flexGrow={1} justifyContent={'flex-end'}>
          <SecondaryButton fullWidth onClick={() => openModal({ modalType: ModalType.MERCHANT_SHARED_SECRET })}>
            {'Show shared secret'}
          </SecondaryButton>

          <PrimaryButton fullWidth onClick={() => openModal({ modalType: ModalType.MERCHANT_ADD_ENDPOINT })}>
            {'Add an endpoint'}
          </PrimaryButton>
        </Box>
      </Box>

      <Box display={'flex'} flexDirection={'column'} gap={4}>
        {user?.subscriptionUrls.length ? (
          <>
            {user?.subscriptionUrls.map(subscription => (
              <StyledUrlTextField
                key={subscription}
                value={subscription}
                variant='outlined'
                autoComplete='on'
                fullWidth
                InputProps={{ startAdornment: <TextFieldStartAdornment /> }}
                disabled
              />
            ))}
          </>
        ) : (
          <Typography variant='body1'>{'No endpoints, please add'}</Typography>
        )}
      </Box>
    </StyledSecurityContentWrapper>
  );
};
