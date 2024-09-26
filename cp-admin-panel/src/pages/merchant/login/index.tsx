import { ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import { MERCHANT } from 'src/common/locationPath';
import { AuthLayout } from 'src/@core/layouts/AuthLayout';
import { LoginContent } from 'src/@core/components/login/types';
import { LoginContainer, VerifyOTPContainer } from 'src/@core/components/login/login-content';

const Login = () => {
  const [content, setContent] = useState<LoginContent>('LOGIN');
  const router = useRouter();
  const redirectToHomePage = () => {
    const redirectURL = router.query.returnUrl ?? MERCHANT;
    router.replace(redirectURL as string);
  };

  return (
    <>
      {content === 'LOGIN' && <LoginContainer setLoginContent={setContent} redirectToHomePage={redirectToHomePage} />}
      {content === 'VERIFY_OTP' && (
        <VerifyOTPContainer setLoginContent={setContent} redirectToHomePage={redirectToHomePage} />
      )}
    </>
  );
};

Login.getLayout = (page: ReactNode) => <AuthLayout>{page}</AuthLayout>;
Login.guestGuard = true;

export default Login;
