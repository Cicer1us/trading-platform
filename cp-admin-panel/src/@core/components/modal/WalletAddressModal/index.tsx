import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Typography, FormHelperText } from '@mui/material';
import { useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { updateWalletAddress } from 'src/api/merchant/security';
import { yupWalletAddressSchema } from 'src/common/yupSchemas';
import { AuthContext } from 'src/providers/AuthProvider';
import { useModalState } from 'src/store/modal/hooks/useModalState';
import { PrimaryButton } from '../../buttons/PrimaryButton';
import { StyledModalContentWrapper } from '../styled';
import { StyledAddEndpointModalForm, StyledAddEndpointModalTextField } from './styled';

export const WalletAddressModal: React.FC = () => {
  const { setUser } = useContext(AuthContext);
  const { closeModal } = useModalState();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: { walletAddress: '' },
    mode: 'onChange',
    resolver: yupResolver(yupWalletAddressSchema)
  });

  const onSubmit = async ({ walletAddress }: { walletAddress: string }) => {
    try {
      const updatedUser = await updateWalletAddress(walletAddress);
      toast.success('Wallet address updated');
      setUser(updatedUser);
    } catch (error) {
      toast.error('Error while updating wallet address');
    } finally {
      closeModal();
    }
  };

  return (
    <StyledModalContentWrapper>
      <Typography variant='h5'>{'New Wallet Address'}</Typography>
      <StyledAddEndpointModalForm onSubmit={handleSubmit(onSubmit)}>
        <Box width={'100%'}>
          <Controller
            name='walletAddress'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <StyledAddEndpointModalTextField fullWidth value={value} onChange={onChange} placeholder='0x...' />
            )}
          />
          {errors.walletAddress && <FormHelperText>{errors.walletAddress.message}</FormHelperText>}
        </Box>
        <PrimaryButton type='submit' variant='contained' disabled={Boolean(errors.walletAddress)}>
          {'Save'}
        </PrimaryButton>
      </StyledAddEndpointModalForm>
    </StyledModalContentWrapper>
  );
};
