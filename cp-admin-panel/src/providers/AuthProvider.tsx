import { createContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/router';

import { AuthValuesType, User } from '../common/types';
import { MERCHANT_LOGIN } from 'src/common/locationPath';
import { getUser } from 'src/api/merchant/auth';
import { setAxiosAuthTokenGlobally, removeAxiosAuthTokenGlobally } from 'src/api/utils';
import { getAccessToken, removeAccessToken, setAccessToken } from 'src/common/auth';

const defaultValue: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => null,
  logout: () => null
};

const AuthContext = createContext(defaultValue);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(defaultValue.user);
  const [loading, setLoading] = useState<boolean>(defaultValue.loading);

  const router = useRouter();

  const initAuth = useCallback(async (): Promise<void> => {
    const storedAccessToken = getAccessToken()!;

    if (storedAccessToken) {
      try {
        const user = await getUser(storedAccessToken);
        setUser(user);
        setAxiosAuthTokenGlobally(storedAccessToken);
      } catch (err) {
        setUser(null);
        removeAccessToken();
        removeAxiosAuthTokenGlobally();
        if (!router.pathname.includes('login')) router.replace(MERCHANT_LOGIN);
      }
    }

    setLoading(false);
  }, [router]);

  useEffect(() => {
    initAuth();
  }, [initAuth, router]);

  const login = (accessToken: string) => {
    setAccessToken(accessToken);
    setAxiosAuthTokenGlobally(accessToken);
  };

  const logout = () => {
    setUser(null);

    removeAccessToken();
    removeAxiosAuthTokenGlobally();

    router.push(MERCHANT_LOGIN);
  };

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login,
    logout
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
