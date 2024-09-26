import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Typography, FormHelperText } from '@mui/material';
import { useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { updateSubscriptionsUrls } from 'src/api/merchant/security';
import { yupAddSubscriptionUrlSchema } from 'src/common/yupSchemas';
import { AuthContext } from 'src/providers/AuthProvider';
import { useModalState } from 'src/store/modal/hooks/useModalState';
import { PrimaryButton } from '../../buttons/PrimaryButton';
import { StyledModalContentWrapper } from '../styled';
import { StyledAddEndpointModalForm, StyledAddEndpointModalTextField } from './styled';

export const AddEndpointModal: React.FC = () => {
  const { user, setUser } = useContext(AuthContext);
  const { closeModal } = useModalState();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: { subscriptionUrl: '' },
    mode: 'onChange',
    resolver: yupResolver(yupAddSubscriptionUrlSchema)
  });

  const onSubmit = async ({ subscriptionUrl }: { subscriptionUrl: string }) => {
    const newSubscriptionUrls = user?.subscriptionUrls.concat(subscriptionUrl) ?? [];

    try {
      const updatedUser = await updateSubscriptionsUrls(newSubscriptionUrls);
      setUser(updatedUser);
      toast.success('Webhook url updated');
    } catch (error) {
      toast.error('Error while updating webhook url');
    } finally {
      closeModal();
    }
  };

  return (
    <StyledModalContentWrapper>
      <Typography variant='h5'>{'New Webhook subscription'}</Typography>
      <StyledAddEndpointModalForm onSubmit={handleSubmit(onSubmit)}>
        <Box width={'100%'}>
          <Controller
            name='subscriptionUrl'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <StyledAddEndpointModalTextField
                fullWidth
                value={value}
                onChange={onChange}
                placeholder='Endpoint (https://...)'
              />
            )}
          />
          {errors.subscriptionUrl && <FormHelperText>{errors.subscriptionUrl.message}</FormHelperText>}
        </Box>
        <PrimaryButton type='submit' variant='contained' disabled={Boolean(errors.subscriptionUrl)}>
          {'Save'}
        </PrimaryButton>
      </StyledAddEndpointModalForm>
    </StyledModalContentWrapper>
  );
};
