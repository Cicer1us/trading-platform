import React, { useEffect } from 'react';
import style from './Widget.module.css';
import Tabs from '@/components/Tabs/Tabs';
import Tab from '@/components/Tabs/Tab/Tab';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/reduxHooks';
import { setCurrentTab, setTab } from '@/redux/widgetSlice';
import LeverageTrade from './LeverageTrade/LeverageTrade';
import { useRouter } from 'next/router';
import useMultilingual from '@/hooks/useMultilingual';
import LeverageOnboarding from './LeverageTrade/LeverageOnboarding/LeverageOnboarding';
import { TabsList } from '@/redux/redux.enum';
import LimitTrade from './LimitTrade/LimitTrade';
import { LimitSelectToken } from './LimitTrade/LimitSelectToken';
import { SwapSelectToken } from './SwapTrade/SwapSelectToken';
import { LeverageSelectToken } from './LeverageTrade/LeverageSelectToken';
import SwapTrade from './SwapTrade/SwapTrade';
import { useWeb3React } from '@web3-react/core';
import useChainValidate from '@/hooks/useChainValidate';
import ChangeChain from './ChangeChain';
import ConnectWallet from './ConnectWallet';
import CrossChainWidget from '../CrossChain/Widget/CrossChainWidget';
import CrossChainSelectToken from '../CrossChain/CrossChainSelectToken';
import { setClientAddress, updateBalances } from '@/redux/appSlice';
import { isMobile } from 'react-device-detect';
import CrossChainMobileWarning from './CrossChainMobileWarning';

const Widget: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const { account } = useWeb3React();
  const { isWrongChain, isConnected } = useChainValidate();
  const tabs = useAppSelector(({ widget }) => widget.tabs);
  const tab = useAppSelector(({ widget }) => widget.tab);
  const router = useRouter();
  const { t } = useMultilingual('widget');

  const isAuthorized = useAppSelector(({ dydxAuth }) => dydxAuth.authIsCompleted);
  const currentStep = useAppSelector(({ dydxAuth }) => dydxAuth.authStep);
  const chainId = useAppSelector(({ app }) => app.chainId);
  const clientAddress = useAppSelector(({ app }) => app.clientAddress);

  useEffect(() => {
    if (!clientAddress || !chainId) return;
    // TODO: apply react-query for balances
    dispatch(updateBalances());
    // TODO: add balances for custom tokens
  }, [clientAddress, chainId, tab]);

  useEffect(() => {
    if (account) {
      dispatch(setClientAddress(account));
    }
  }, [account]);

  useEffect(() => {
    const tab = router?.query?.tab;

    if (!tab) return;
    // TODO: simplify
    switch (tab) {
      case 'swap':
        dispatch(setTab(TabsList.SWAP));
        break;
      case 'leverage':
        dispatch(setTab(TabsList.LEVERAGE));
        break;
      case 'cross-chain':
        dispatch(setTab(TabsList.CROSS_CHAIN));
        break;
      default:
        break;
    }
  }, []);

  const handlerSwitchTabsList = (value: string) => {
    if (t(tabs[0].toLowerCase()) === value) {
      dispatch(setCurrentTab(TabsList.LEVERAGE));
    }
    if (t(tabs[1].toLowerCase()) === value) {
      dispatch(setCurrentTab(TabsList.SWAP));
    }
    if (t(tabs[2].toLowerCase()) === value) {
      dispatch(setCurrentTab(TabsList.LIMIT));
    }
  };

  const tabsMenu = (tab === TabsList.SWAP || tab === TabsList.LIMIT) && (
    <div className={style.header}>
      <Tabs>
        {[TabsList.SWAP, TabsList.LIMIT].map((item, index) => (
          <Tab key={`${item}-${index}`} handlerSelect={handlerSwitchTabsList} isActive={tab === item}>
            {t(item.toLowerCase())}
          </Tab>
        ))}
      </Tabs>
    </div>
  );

  const contents = () => {
    if (!account && tab === TabsList.LEVERAGE) {
      return <ConnectWallet />;
    }

    if (isWrongChain && isConnected && account) {
      return <ChangeChain />;
    }

    if (tab === TabsList.LIMIT) {
      return <LimitTrade />;
    } else if (tab === TabsList.SWAP) {
      return <SwapTrade />;
    } else if (tab === TabsList.LEVERAGE) {
      return isAuthorized && currentStep >= 2 ? <LeverageTrade /> : <LeverageOnboarding />;
    } else if (tab === TabsList.CROSS_CHAIN) {
      // temporary solution for mobile to hide actual cross-chain widget
      if (isMobile) {
        return <CrossChainMobileWarning />;
      }
      return <CrossChainWidget />;
    }
  };

  return (
    <div className={`${style.container} boxStyle`}>
      {tabsMenu}
      {contents()}

      {tab === TabsList.SWAP && <SwapSelectToken />}
      {tab === TabsList.LIMIT && <LimitSelectToken />}
      {tab === TabsList.LEVERAGE && <LeverageSelectToken />}
      {tab === TabsList.CROSS_CHAIN && <CrossChainSelectToken />}
    </div>
  );
};

export default React.memo(Widget);
