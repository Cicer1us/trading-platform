import React, { useEffect } from 'react';
import { setLimitSettings } from '@/redux/limitSlice';
import Head from 'next/head';
import { setCurrentChainId } from '@/redux/appSlice';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/reduxHooks';
import { setTokensList } from '@/redux/widgetSlice';
import { setSwapSettings } from '@/redux/swapSlice';
import { useWeb3React } from '@web3-react/core';
import { chains } from 'connection/chainConfig';

export interface AppProviderProps {
  children: React.ReactNode;
  props: any;
}

const AppProvider: React.FC<AppProviderProps> = ({ children, props }: AppProviderProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { chainId } = useWeb3React();

  const lang = useAppSelector(({ app }) => app?.language);

  useEffect(() => {
    if (!chainId || !chains[chainId]) return;
    dispatch(setCurrentChainId(chainId));
  }, [chainId]);

  useEffect(() => {
    if (!!lang && router.locale !== lang) {
      router.replace(router.asPath, router.asPath, { locale: lang, scroll: false });
    }
  }, [lang]);

  useEffect(() => {
    const { tokensList, swapSettings, limitSettings } = props;
    if (tokensList) {
      dispatch(setTokensList(tokensList));
    }

    if (swapSettings) {
      dispatch(setSwapSettings(swapSettings));
    }

    if (limitSettings) {
      dispatch(setLimitSettings(limitSettings));
    }
  }, [props?.swapSettings, props?.limitSettings, props?.tokensList]);

  return (
    <>
      {process.env.NEXT_PUBLIC_NEXT_ENV === 'development' && (
        <Head>
          <meta name="robots" content="noindex,nofollow" />
        </Head>
      )}
      {children}
    </>
  );
};

export default AppProvider;
