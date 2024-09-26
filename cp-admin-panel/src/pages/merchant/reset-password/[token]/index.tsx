import { yupResolver } from '@hookform/resolvers/yup';
import { Typography, Box, styled } from '@mui/material';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AuthLayout } from 'src/@core/layouts/AuthLayout';
import { resetPassword } from 'src/api/merchant/auth';
import { MERCHANT_LOGIN } from 'src/common/locationPath';
import { yupResetPasswordSchema } from 'src/common/yupSchemas';
import { PasswordInput } from 'src/pagesComponents/merchant/auth/PasswordInput';
import { StyledAuthButton, StyledAuthInputsWrapper } from 'src/pagesComponents/merchant/auth/styled';
import { assert } from 'ts-essentials';

const StyledTypography = styled(Typography, {
  name: 'StyledTypography'
})(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: '0.18px',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
}));

const ResetPassword = () => {
  const router = useRouter();

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onChange',
    resolver: yupResolver(yupResetPasswordSchema)
  });

  const onSubmit = async ({ password }: { password: string }) => {
    assert(router.query.token, 'token is undefined');
    try {
      await resetPassword(password, router.query.token as string);
      toast.success('Password has been reset');
      router.push(MERCHANT_LOGIN);
    } catch (err: any) {
      setError('password', { message: err?.response?.data?.message ?? 'Something went wrong' });
    }
  };

  return (
    <>
      <Box mb={6}>
        <StyledTypography variant='h5'>{'Change password'}</StyledTypography>
        <Typography variant='body2'>
          {'Enter new password and confirm it. Then you will be able to login with your new password'}
        </Typography>
      </Box>
      <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
        <StyledAuthInputsWrapper mb={6}>
          <PasswordInput control={control} errors={errors} name='password' />
          <PasswordInput control={control} errors={errors} name='confirmPassword' />
        </StyledAuthInputsWrapper>

        <StyledAuthButton
          fullWidth
          size='large'
          type='submit'
          variant='contained'
          disabled={Boolean(Object.keys(errors).length) || !router.query.token}
        >
          {'Change password'}
        </StyledAuthButton>
      </form>
    </>
  );
};

ResetPassword.guestGuard = true;
ResetPassword.getLayout = (page: ReactNode) => <AuthLayout>{page}</AuthLayout>;

export default ResetPassword;
