import { useContext } from 'react';
import Link from 'next/link';
import { Box, Checkbox, Typography, FormControlLabel } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import themeConfig from 'src/configs/themeConfig';
import { MERCHANT_FORGOT_PASSWORD, MERCHANT_REGISTER } from 'src/common/locationPath';
import { PasswordInput } from 'src/pagesComponents/merchant/auth/PasswordInput';
import { EmailInput } from 'src/pagesComponents/merchant/auth/EmailInput';
import { StyledAuthTitle, StyledAuthButton, StyledAuthInputsWrapper } from 'src/pagesComponents/merchant/auth/styled';
import { yupLoginSchema } from 'src/common/yupSchemas';
import { AuthContext } from 'src/providers/AuthProvider';
import { LoginParams } from 'src/common/types';
import { loginUser } from 'src/api/merchant/auth';
import { TwoFactorAuthFormContainer } from 'src/@core/components/modal/SetupTwoFactorAuthModal/two-factor-auth-form-container';
import toast from 'react-hot-toast';
import { useMutateOtpAuthValidate } from 'src/hooks/useOtpAuth';
import { useMutation } from '@tanstack/react-query';
import { LoginContent } from './types';
import { SChangeContentTypography } from './styled';

export const LoginContainer = ({
  setLoginContent,
  redirectToHomePage
}: {
  setLoginContent: (params: LoginContent) => void;
  redirectToHomePage: () => void;
}) => {
  const authContext = useContext(AuthContext);

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: { password: '', email: '', rememberMe: true },
    mode: 'onChange',
    resolver: yupResolver(yupLoginSchema)
  });

  const { mutateAsync: mutateLoginUserAsync } = useMutation({
    mutationFn: loginUser
  });

  const submitLoginData = async (params: LoginParams) => {
    try {
      const loginResponse = await mutateLoginUserAsync(params);
      authContext.login(loginResponse.accessToken);
      if (!loginResponse.requiresOtp) {
        redirectToHomePage();
      } else {
        setLoginContent('VERIFY_OTP');
      }
    } catch (err: any) {
      setError('email', { message: err?.response?.data?.message ?? 'Something went wrong' });
    }
  };

  return (
    <>
      <Box mb={6} textAlign={'center'}>
        <StyledAuthTitle variant='h5'>{`Welcome to ${themeConfig.templateName}!`}</StyledAuthTitle>
        <Typography variant='body2'>{'Please sign-in to your account and start the adventure'}</Typography>
      </Box>
      <Box component={'form'} noValidate autoComplete='on' onSubmit={handleSubmit(submitLoginData)}>
        <StyledAuthInputsWrapper>
          <EmailInput control={control} errors={errors} />
          <PasswordInput control={control} errors={errors} name='password' />
        </StyledAuthInputsWrapper>
        <Box mb={4} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <Controller
            name='rememberMe'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <FormControlLabel
                checked={value}
                value={value}
                onChange={onChange}
                control={<Checkbox />}
                label={'Remember Me'}
              />
            )}
          />
          <Typography variant='body2' component={'a'} href={MERCHANT_FORGOT_PASSWORD} color={'primary.main'}>
            {'Forgot password?'}
          </Typography>
        </Box>
        <StyledAuthButton
          fullWidth
          size='large'
          type='submit'
          variant='contained'
          disabled={Boolean(Object.keys(errors).length)}
        >
          {'Log in'}
        </StyledAuthButton>
        <Box display={'flex'} alignItems={'center'} flexWrap={'wrap'} justifyContent={'center'} gap={2}>
          <Typography color={'text.secondary'}>{' New on our platform?'}</Typography>
          <Typography href={MERCHANT_REGISTER} component={Link} color={'primary.main'}>
            {'Create an account'}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export const VerifyOTPContainer = ({
  redirectToHomePage,
  setLoginContent
}: {
  redirectToHomePage: () => void;
  setLoginContent: (params: LoginContent) => void;
}) => {
  const authContext = useContext(AuthContext);

  const { mutateAsync: validateOtpAsync } = useMutateOtpAuthValidate();

  const submitTwoFactorAuthCode = async ({ twoFactorCode }: { twoFactorCode: string }) => {
    try {
      const response = await validateOtpAsync({ token: twoFactorCode });
      authContext.login(response.accessToken);
      redirectToHomePage();
    } catch (error) {
      toast.error('Incorrect two factor authentication code. Please try again.');
    }
  };

  return (
    <>
      <Box mb={6} textAlign={'center'}>
        <StyledAuthTitle variant='h5'>{'Two-factor authentication'}</StyledAuthTitle>
        <Typography variant='body2'>
          {'Open your two-factor authenticator app or browser extension to view your authentication code'}
        </Typography>
      </Box>
      <TwoFactorAuthFormContainer submitTwoFactorAuthCode={submitTwoFactorAuthCode} buttonName='verify' />

      <Box display={'flex'} alignItems={'center'} flexWrap={'wrap'} justifyContent={'center'} gap={2} mt={4}>
        <Typography color={'text.secondary'} textAlign={'center'}>
          {'Have a problem?  Use recovery code or being account recovery'}
        </Typography>
      </Box>

      <Box display={'flex'} alignItems={'center'} flexWrap={'wrap'} justifyContent={'center'} gap={2} mt={2}>
        <Typography color={'text.secondary'}>{'Back to login'}</Typography>
        <SChangeContentTypography onClick={() => setLoginContent('LOGIN')} color={'primary.main'}>
          {'Login'}
        </SChangeContentTypography>
      </Box>
    </>
  );
};
