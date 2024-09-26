import { ReactNode, ReactElement, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { MERCHANT } from 'src/common/locationPath';
import { getAccessToken } from 'src/common/auth';
import { AuthContext } from 'src/providers/AuthProvider';

interface GuestGuardProps {
  children: ReactNode;
  fallback: ReactElement | null;
}

const GuestGuard = (props: GuestGuardProps) => {
  const { children, fallback } = props;
  const { loading, user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    if (getAccessToken()) router.replace(MERCHANT);
  }, [router]);

  if (loading || (!loading && user !== null)) return fallback;

  return <>{children}</>;
};

export default GuestGuard;
