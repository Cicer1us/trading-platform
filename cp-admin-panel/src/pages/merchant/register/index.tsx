import { ReactNode, useState } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { MERCHANT_LOGIN } from 'src/common/locationPath';
import { AuthLayout } from 'src/@core/layouts/AuthLayout';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { yupRegisterSchema } from 'src/common/yupSchemas';
import { EmailInput } from 'src/pagesComponents/merchant/auth/EmailInput';
import { PasswordInput } from 'src/pagesComponents/merchant/auth/PasswordInput';
import { StyledAuthButton, StyledAuthTitle, StyledAuthInputsWrapper } from 'src/pagesComponents/merchant/auth/styled';
import { PrivacyPolicyCheckbox } from 'src/pagesComponents/merchant/auth/PrivacyPolicyCheckbox';
import { registerUser } from 'src/api/merchant/auth';
import { RegisterParams } from 'src/common/types';
import { Card, styled } from '@mui/material';
import Icon from 'src/@core/components/icon';

enum RegisterScreen {
  DEFAULT = 'DEFAULT',
  SUCCESS = 'SUCCESS'
}

const StyledLink = styled(Link, {
  name: 'StyledLink'
})(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: theme.palette.primary.main
}));

const StyledCard = styled(Card, {
  name: 'StyledCard'
})({
  padding: '48px 24px'
});

const Register = () => {
  const [screen, setScreen] = useState<RegisterScreen>(RegisterScreen.DEFAULT);

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: { email: '', password: '', confirmPassword: '', privacyPolicy: false },
    mode: 'onChange',
    resolver: yupResolver(yupRegisterSchema)
  });

  const onSubmit = async (registerParams: RegisterParams) => {
    const { email, password } = registerParams;
    try {
      await registerUser({ email, password });
      setScreen(RegisterScreen.SUCCESS);
    } catch (err: any) {
      setError('email', { message: err?.response?.data?.message ?? 'Something went wrong' });
    }
  };

  return (
    <>
      {screen === RegisterScreen.DEFAULT && (
        <>
          <Box mb={6} textAlign={'center'}>
            <StyledAuthTitle variant='h5'>{'Adventure starts here'}</StyledAuthTitle>
            <Typography variant='body2'>{'Make your app management easy and fun!'}</Typography>
          </Box>
          <form noValidate autoComplete='on' onSubmit={handleSubmit(onSubmit)}>
            <StyledAuthInputsWrapper>
              <EmailInput control={control} errors={errors} />
              <PasswordInput control={control} errors={errors} name='password' />
              <PasswordInput control={control} errors={errors} name='confirmPassword' />
            </StyledAuthInputsWrapper>

            <PrivacyPolicyCheckbox control={control} errors={errors} />

            <StyledAuthButton
              fullWidth
              size='large'
              type='submit'
              variant='contained'
              disabled={Boolean(Object.keys(errors).length)}
            >
              {'Sign up'}
            </StyledAuthButton>
            <Box display={'flex'} alignItems={'center'} flexWrap={'wrap'} justifyContent={'center'} gap={2}>
              <Typography color={'text.secondary'}>{'Already have an account?'}</Typography>
              <Typography href={MERCHANT_LOGIN} component={Link} color={'primary.main'}>
                {'Sign in instead'}
              </Typography>
            </Box>
          </form>
        </>
      )}
      {screen === RegisterScreen.SUCCESS && (
        <StyledCard>
          <Typography variant={'h5'} mb={2}>
            {'Verify your email ✉️'}
          </Typography>
          <Typography variant={'body2'} mb={8}>
            {`Account activation link has been sent to your email address:
             ${control._formValues.email || '...'}. Please follow the link inside to continue.`}
          </Typography>
          <StyledLink href={MERCHANT_LOGIN}>
            <Icon icon='mdi:chevron-left' fontSize='2rem' />
            {'Back to login'}
          </StyledLink>
        </StyledCard>
      )}
    </>
  );
};

Register.getLayout = (page: ReactNode) => <AuthLayout>{page}</AuthLayout>;
Register.guestGuard = true;

export default Register;
