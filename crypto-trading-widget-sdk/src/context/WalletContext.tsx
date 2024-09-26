import React, { createContext, useCallback, useEffect } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { Chain, chainConfigs, rpcUrls } from '../utils/chains';
import { useAppDispatch, useAppSelector } from '../redux/hooks/reduxHooks';
import { setSelectedChain, setSelectedWallet } from '../redux/appSlice';
import { handlePriceRouteUpdate } from '../redux/thunks/handlePriceRouteUpdate';
import { InputAction } from '../redux/app.interface';
import { useWeb3React } from '@web3-react/core';
import { assert } from 'ts-essentials';
import { CONNECTIONS, ConnectionType } from 'utils/connections';
import { isSupportedChain } from 'utils/common';

export interface WalletCtxInterface {
  account: string | undefined;
  walletChain?: Chain;
  selectChain: (chain: Chain) => Promise<void>;
  library: Web3Provider | undefined;
  disconnect: () => void;
}

export const WalletCtx = createContext<WalletCtxInterface | null>(null);

interface WalletCtxProps {
  children: JSX.Element;
}

export const WalletContext: React.FC<WalletCtxProps> = ({ children }) => {
  const { connector, account, provider: library, chainId: walletChain } = useWeb3React();
  const { selectedChain } = useAppSelector(({ app }) => app);
  const dispatch = useAppDispatch();

  const disconnect = useCallback(() => {
    if (connector.deactivate) connector.deactivate();

    dispatch(setSelectedWallet(undefined));
    connector.resetState();
  }, [connector, dispatch]);

  const selectChain = useCallback(
    async (chainId: Chain) => {
      assert(!!chainId && !!chainConfigs[chainId], `Unsupported chainId: ${chainId}`);

      const isWalletConnect = connector === CONNECTIONS[ConnectionType.WALLET_CONNECT]?.connector;
      const isNetwork = connector === CONNECTIONS[ConnectionType.NETWORK]?.connector;

      try {
        if (isWalletConnect || isNetwork) {
          await connector.activate(chainId);
        } else {
          await connector.activate({
            chainId,
            chainName: chainConfigs[chainId].name,
            rpcUrls: [rpcUrls[chainId]],
            nativeCurrency: chainConfigs[chainId].nativeToken,
            blockExplorerUrls: [chainConfigs[chainId].explorerUrl],
          });
        }

        dispatch(setSelectedChain(chainId));
      } catch (error) {
        console.error(error);
        throw new Error(`Failed to switch to chain ${chainId}`);
      }

      dispatch(handlePriceRouteUpdate({ inputAction: InputAction.PayValueChange, chain: chainId }));
    },
    [connector, dispatch]
  );

  useEffect(() => {
    // set chain from wallet on load if chain is supported
    if (walletChain && isSupportedChain(walletChain)) {
      dispatch(setSelectedChain(walletChain));
    }

    dispatch(handlePriceRouteUpdate({ inputAction: InputAction.PayValueChange, chain: walletChain ?? selectedChain }));
  }, [walletChain, dispatch, selectedChain]);

  const contextValue = { account, library, selectChain, walletChain, disconnect };

  return <WalletCtx.Provider value={contextValue}>{children}</WalletCtx.Provider>;
};
