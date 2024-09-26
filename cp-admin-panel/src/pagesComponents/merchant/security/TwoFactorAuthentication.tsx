import { Box, Button, Typography } from '@mui/material';
import { StyledSecurityContentWrapper } from './styled';
import { useModalState } from 'src/store/modal/hooks/useModalState';
import { ModalType } from 'src/store/modal/types';
import { AuthContext } from 'src/providers/AuthProvider';
import { useCallback, useContext } from 'react';
import { useMutateOtpAuthDisable } from 'src/hooks/useOtpAuth';
import { toast } from 'react-hot-toast';
import { getUser } from 'src/api/merchant/auth';
import { getAccessToken } from 'src/common/auth';

export const TwoFactorAuthentication: React.FC = () => {
  const { setUser, user } = useContext(AuthContext);
  const { openModal } = useModalState();
  const { mutateAsync: disableOtpAsync } = useMutateOtpAuthDisable();

  const disableTwoFactorHandler = useCallback(async () => {
    try {
      await disableOtpAsync();

      //setting updated user globally with twoFactorAuthEnabled set to false
      const storedAccessToken = getAccessToken()!;

      const user = await getUser(storedAccessToken);
      setUser(user);

      toast.success('Two factor authentication was disabled!');
    } catch (error) {
      toast.error('There was an error disabling two factor authentication.');
    }
  }, [setUser, disableOtpAsync]);

  return (
    <StyledSecurityContentWrapper>
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} mb={6}>
        <Typography variant='h5'>{'Two-steps verification'}</Typography>
      </Box>

      <Typography variant='body2' mb={4}>
        {'Two factor authentication is not enabled yet.'}
      </Typography>
      <Typography variant='body2' mb={6}>
        {
          'Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to log in.'
        }
      </Typography>

      {user && !user.twoFactorAuthEnabled ? (
        <Button variant='contained' onClick={() => openModal({ modalType: ModalType.SETUP_TWO_FACTOR_AUTH })}>
          {'Enable two-factor authentication'}
        </Button>
      ) : (
        <Button onClick={disableTwoFactorHandler}>{'Disable two-factor authentication'}</Button>
      )}
    </StyledSecurityContentWrapper>
  );
};
