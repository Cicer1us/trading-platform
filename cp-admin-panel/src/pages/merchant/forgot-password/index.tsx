import { yupResolver } from '@hookform/resolvers/yup';
import { Typography, Link, Box, styled } from '@mui/material';
import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Icon from 'src/@core/components/icon';
import { AuthLayout } from 'src/@core/layouts/AuthLayout';
import { forgotPassword } from 'src/api/merchant/auth';
import { MERCHANT_LOGIN } from 'src/common/locationPath';
import { yupForgotPasswordSchema } from 'src/common/yupSchemas';
import { EmailInput } from 'src/pagesComponents/merchant/auth/EmailInput';
import { StyledAuthButton } from 'src/pagesComponents/merchant/auth/styled';

const StyledTypography = styled(Typography, {
  name: 'StyledTypography'
})(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: '0.18px',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
}));

const StyledLink = styled(Link, {
  name: 'StyledLink'
})(({ theme }) => ({
  display: 'flex',
  '& svg': { mr: 1.5 },
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main
}));

const ForgotPassword = () => {
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: { email: '' },
    mode: 'onChange',
    resolver: yupResolver(yupForgotPasswordSchema)
  });

  const onSubmit = async ({ email }: { email: string }) => {
    try {
      await forgotPassword(email);
      toast.success('Please check your email');
      // TODO: add success screen when we have a design
      // setScreen(ForgotPassword.SUCCESS);
    } catch (err: any) {
      setError('email', { message: err?.response?.data?.message ?? 'Something went wrong' });
    }
  };

  return (
    <>
      <Box mb={6}>
        <StyledTypography variant='h5'>{'Forgot Password? 🔒'}</StyledTypography>
        <Typography variant='body2'>
          {`Enter your email and we'll send you instructions to reset your password`}
        </Typography>
      </Box>
      <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
        <Box mb={4}>
          <EmailInput control={control} errors={errors} />
        </Box>

        <StyledAuthButton
          fullWidth
          size='large'
          type='submit'
          variant='contained'
          disabled={Boolean(Object.keys(errors).length)}
        >
          {'Send reset link'}
        </StyledAuthButton>

        <Typography display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <StyledLink href={MERCHANT_LOGIN}>
            <Icon icon='mdi:chevron-left' fontSize='2rem' />
            {'Back to login'}
          </StyledLink>
        </Typography>
      </form>
    </>
  );
};

ForgotPassword.guestGuard = true;
ForgotPassword.getLayout = (page: ReactNode) => <AuthLayout>{page}</AuthLayout>;

export default ForgotPassword;
