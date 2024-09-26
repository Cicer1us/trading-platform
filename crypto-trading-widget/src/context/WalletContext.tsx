import React, { createContext, useContext, useEffect, useState } from 'react';
import { providerOptions } from './web3ModalConfig';
import { Web3Provider } from '@ethersproject/providers';
import { Chain, switchChain } from '../utils/chains';
import Web3 from 'web3';
import Web3Modal from 'web3modal';

export interface WalletCtxInterface {
  account?: string;
  walletIsLoading: boolean;
  connectWallet: () => Promise<void>;
  selectChain: (chain: Chain) => Promise<void>;
  walletChain?: Chain;
  library?: Web3Provider;
  disconnect: () => Promise<void>;
}

export const WalletCtx = createContext<WalletCtxInterface>({
  walletIsLoading: false,
  connectWallet: async () => {},
  selectChain: async () => {},
  disconnect: async () => {},
});

export const useWalletContext = (): WalletCtxInterface => {
  return useContext(WalletCtx);
};

interface WalletCtxProps {
  children: JSX.Element | JSX.Element[];
}

let web3Modal: Web3Modal;
if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    cacheProvider: true, // optional
    providerOptions, // required
  });
}

export const WalletContext: React.FC<WalletCtxProps> = ({ children }) => {
  const [web3, setWeb3] = useState<Web3>();
  const [library, setLibrary] = useState<Web3Provider>();
  const [account, setAccount] = useState<string>();
  const [walletIsLoading, setWalletIsLoading] = useState<boolean>(true); // should be removed or replaced with a better solution
  const [walletChain, setWalletChain] = useState<Chain>();

  const disconnect = async () => {
    setAccount(undefined);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await web3.currentProvider.close();
    }
    await web3Modal.clearCachedProvider();
  };

  const subscribeProvider = (prov: Web3Provider) => {
    if (prov?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts) setAccount(accounts[0]);
      };

      const handleChainChanged = (_hexChainId: string) => {
        const hex = Web3.utils.toHex(_hexChainId);
        setWalletChain(hex as Chain);
      };

      prov.on('close', disconnect);
      prov.on('accountsChanged', handleAccountsChanged);
      prov.on('chainChanged', handleChainChanged);
    }
  };

  const selectChain = async (chain: Chain) => {
    if (account && library) {
      await switchChain(library as Web3Provider, chain, () => {});
    }
  };

  const connectWallet = async () => {
    setWalletIsLoading(true);
    const prov = await web3Modal.connect();

    subscribeProvider(prov);

    await prov.enable();
    const web3Instance = new Web3(prov);
    const lib = new Web3Provider(prov, 'any');
    const accounts = await web3Instance.eth.getAccounts();

    web3Instance.eth.extend({
      methods: [
        {
          name: 'chainId',
          call: 'eth_chainId',
        },
      ],
    });

    const network = await lib.getNetwork();

    setLibrary(lib);
    setWeb3(web3Instance);

    if (accounts) setAccount(accounts[0]);
    const currentWalletChain = Web3.utils.toHex(network.chainId ?? 1) as Chain;
    setWalletChain(currentWalletChain);

    setWalletIsLoading(false);
  };

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet().then();
    } else {
      setWalletIsLoading(false);
    }
  }, []);

  const context: WalletCtxInterface = {
    account,
    library,
    connectWallet,
    selectChain,
    disconnect,
    walletChain,
    walletIsLoading,
  };

  return (
    <WalletCtx.Provider value={context}>
      <style>{`.web3modal-modal-lightbox { z-index: 1301 !important; }`}</style>
      {children}
    </WalletCtx.Provider>
  );
};
