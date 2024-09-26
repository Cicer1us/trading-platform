import { ReactNode, ReactElement, useEffect, useContext } from 'react';

import { useRouter } from 'next/router';

import { MERCHANT_LOGIN } from 'src/common/locationPath';
import { getAccessToken } from 'src/common/auth';
import { AuthContext } from 'src/providers/AuthProvider';

interface AuthGuardProps {
  children: ReactNode;
  fallback: ReactElement | null;
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props;
  const { loading, user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    if (!user && !getAccessToken()) {
      router.replace({ pathname: MERCHANT_LOGIN, query: { returnUrl: router.asPath } });
    }
  }, [router, user]);

  if (loading || !user) return fallback;

  return <>{children}</>;
};

export default AuthGuard;
