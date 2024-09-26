import { Box, Typography, Button } from '@mui/material';
import { useContext } from 'react';
import toast from 'react-hot-toast';
import { rotateSharedSecret } from 'src/api/merchant/security';
import { AuthContext } from 'src/providers/AuthProvider';
import { CopyContentButton } from '../../buttons/CopyContentButton';
import { StyledModalContentWrapper } from '../styled';
import { StyledSharedSecretModalForm, StyledSharedSecretModalTextField } from './styled';

export const SharedSecretModal: React.FC = () => {
  const { user, setUser } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const updatedUser = await rotateSharedSecret();
      setUser(updatedUser);
      toast.success('Shared secret rotated');
    } catch (error) {
      toast.error('Error while rotating shared secret');
    }
  };

  return (
    <StyledModalContentWrapper>
      <>
        <Typography variant='h5'>{'Webhook shared secret'}</Typography>
        <Typography variant='body2'>{'Please, copy this share secret'}</Typography>
        <StyledSharedSecretModalForm onSubmit={handleSubmit}>
          <Box display={'flex'} gap={2} alignItems={'center'}>
            <StyledSharedSecretModalTextField fullWidth value={user?.subscriptionSecret ?? ''} disabled />
            <CopyContentButton content={user?.subscriptionSecret} />
          </Box>
          <Button variant='contained' type={'submit'}>
            {'rotate shared secret'}
          </Button>
        </StyledSharedSecretModalForm>
      </>
    </StyledModalContentWrapper>
  );
};
