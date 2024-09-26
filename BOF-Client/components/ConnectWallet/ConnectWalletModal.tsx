import { useAppDispatch } from '@/redux/hooks/reduxHooks';
import { useWeb3React } from '@web3-react/core';
import { Connector } from '@web3-react/types';
import { networkConnection } from 'connection/connectors';
import {
  getConnection,
  getIsInjected,
  getIsMetaMaskWallet,
  getIsCoinbaseWallet,
  isSupportedChain,
} from 'connection/utils';
import { useCallback, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import Modal from '../Modal/Modal';
import { OpenCoinbaseWalletOption, CoinbaseWalletOption } from './CoinbaseWalletOption';
import { InstallMetaMaskOption, MetaMaskOption, InjectedOption } from './InjectedOption';
import { WalletConnectOption } from './WalletConnectOption';
import style from './ConnectWallet.module.css';
import { updateSelectedWallet } from '@/redux/appSlice';
import { WalletConnect } from '@web3-react/walletconnect-v2';
import { MetaMask } from '@web3-react/metamask';
import { Notify, NotifyEnum } from '../CustomToastContainer/CustomToastContainer';

export interface ConnectWalletModal {
  active: boolean;
  setActive: (a: boolean) => void;
}

export const ConnectWalletModal = ({ active, setActive }: ConnectWalletModal) => {
  const dispatch = useAppDispatch();
  const { connector, chainId } = useWeb3React();

  const [pendingConnector, setPendingConnector] = useState<Connector | undefined>();
  const [connectionError, setConnectionError] = useState<string | undefined>();

  useEffect(() => {
    if (chainId && isSupportedChain(chainId) && connector !== networkConnection.connector) {
      networkConnection.connector.activate(chainId);
    }
  }, [chainId, connector]);

  const tryActivation = useCallback(
    async (connector: Connector) => {
      const connectionType = getConnection(connector).type;

      try {
        setPendingConnector(connector);

        await connector.activate();
        dispatch(updateSelectedWallet({ wallet: connectionType }));

        setActive(false);
        setPendingConnector(undefined);
      } catch (error) {
        console.debug(`web3-react connection error: ${error}`);
        Notify({ state: NotifyEnum.ERROR, message: error.message });
        setConnectionError(error.message);
        setPendingConnector(undefined);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    return () => {
      setConnectionError(undefined);
    };
  }, [active, pendingConnector]);

  // TODO: simplify logic of getOptions and make it possible to use it via map in the render
  function getOptions() {
    const isInjected = getIsInjected();
    const hasMetaMaskExtension = getIsMetaMaskWallet();
    const hasCoinbaseExtension = getIsCoinbaseWallet();

    const isCoinbaseWalletBrowser = isMobile && hasCoinbaseExtension;
    const isMetaMaskBrowser = isMobile && hasMetaMaskExtension;
    const isInjectedMobileBrowser = isCoinbaseWalletBrowser || isMetaMaskBrowser;

    let injectedOption;
    if (!isInjected) {
      if (!isMobile) {
        injectedOption = <InstallMetaMaskOption />;
      }
    } else if (!hasCoinbaseExtension) {
      if (hasMetaMaskExtension) {
        injectedOption = (
          <MetaMaskOption tryActivation={tryActivation} isLoading={pendingConnector instanceof MetaMask} />
        );
      } else {
        injectedOption = (
          <InjectedOption tryActivation={tryActivation} isLoading={pendingConnector instanceof MetaMask} />
        );
      }
    }

    let coinbaseWalletOption;
    if (isMobile && !isInjectedMobileBrowser) {
      coinbaseWalletOption = <OpenCoinbaseWalletOption />;
    } else if (!isMobile || isCoinbaseWalletBrowser) {
      coinbaseWalletOption = <CoinbaseWalletOption tryActivation={tryActivation} />;
    }

    const walletConnectionOption =
      (!isInjectedMobileBrowser && (
        <WalletConnectOption tryActivation={tryActivation} isLoading={pendingConnector instanceof WalletConnect} />
      )) ??
      null;

    return (
      <>
        {injectedOption}
        {coinbaseWalletOption}
        {walletConnectionOption}
      </>
    );
  }

  return (
    <Modal active={active && !connectionError} setActive={setActive}>
      <h1>Connect Wallet</h1>
      <div className={style.walletOptions}>{getOptions()}</div>
    </Modal>
  );
};
