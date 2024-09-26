import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { initializeConnector, Web3ReactHooks } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { Network } from '@web3-react/network';
import { Actions, Connector } from '@web3-react/types';
import { WalletConnect } from '@web3-react/walletconnect-v2';
import { isMobile } from 'react-device-detect';
import { assert } from 'ts-essentials';
import { WALLET_CONNECT_PROJECT_ID } from '../constants';
import { Chain, chainConfigs, rpcUrls } from './chains';
import {
  getIsMetaMaskWallet,
  getShouldAdvertiseMetaMask,
  getIsGenericInjector,
  getIsInjectedMobileBrowser,
  getIsCoinbaseWalletBrowser,
} from './wallet';

export enum ConnectionType {
  METAMASK = 'Metamask',
  COINBASE_WALLET = 'Coinbase',
  WALLET_CONNECT = 'WalletConnect',
  NETWORK = 'Network',
}

export interface Connection {
  connector: Connector;
  type: ConnectionType;
  shouldDisplay: () => boolean;
}

const walletConnectOptions = {
  projectId: WALLET_CONNECT_PROJECT_ID ?? '',
  chains: [Chain.Ethereum].map(Number),
  optionalChains: Object.keys(chainConfigs).map(Number),
  showQrModal: true,
  qrModalOptions: { themeVariables: { '--wcm-z-index': '1301' } },
};

const callbacks: Record<ConnectionType, (actions: Actions) => Connector> = {
  [ConnectionType.METAMASK]: (actions: Actions): MetaMask => new MetaMask({ actions }),
  [ConnectionType.COINBASE_WALLET]: (actions: Actions): CoinbaseWallet =>
    new CoinbaseWallet({ actions, options: { url: chainConfigs[Chain.Ethereum].rpcUrl, appName: '' } }),
  [ConnectionType.WALLET_CONNECT]: (actions: Actions): WalletConnect =>
    new WalletConnect({ actions, options: walletConnectOptions }),
  [ConnectionType.NETWORK]: (actions: Actions): Network => new Network({ actions, urlMap: rpcUrls }),
};

const [metaMask, metaMaskHooks] = initializeConnector(callbacks[ConnectionType.METAMASK]);
const [coinbase, coinbaseHooks] = initializeConnector(callbacks[ConnectionType.COINBASE_WALLET]);
const [walletConnect, walletConnectHooks] = initializeConnector(callbacks[ConnectionType.WALLET_CONNECT]);
const [network, networkHooks] = initializeConnector(callbacks[ConnectionType.NETWORK]);

export const CONNECTIONS: Record<ConnectionType, Connection> = {
  [ConnectionType.METAMASK]: {
    connector: metaMask,
    type: ConnectionType.METAMASK,
    shouldDisplay: () => getIsMetaMaskWallet() || getShouldAdvertiseMetaMask() || getIsGenericInjector(),
  },
  [ConnectionType.COINBASE_WALLET]: {
    connector: coinbase,
    type: ConnectionType.COINBASE_WALLET,
    shouldDisplay: () =>
      Boolean((isMobile && !getIsInjectedMobileBrowser()) || !isMobile || getIsCoinbaseWalletBrowser()),
  },
  [ConnectionType.WALLET_CONNECT]: {
    connector: walletConnect,
    type: ConnectionType.WALLET_CONNECT,
    shouldDisplay: () => !getIsInjectedMobileBrowser(),
  },
  // for eagerly connect
  [ConnectionType.NETWORK]: {
    connector: network,
    type: ConnectionType.NETWORK,
    shouldDisplay: () => false,
  },
};

// for web3ReactProvider
export const CONNECTORS: [Connector, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks],
  [coinbase, coinbaseHooks],
  [walletConnect, walletConnectHooks],
  [network, networkHooks],
];

export const getConnection = (c: Connector | ConnectionType): Connection | undefined => {
  if (c instanceof Connector) {
    const currentConnection = Object.values(CONNECTIONS).find(connection => connection.connector === c);
    assert(currentConnection, 'connection is not defined');

    return currentConnection;
  } else {
    switch (c) {
      case ConnectionType.METAMASK:
        return CONNECTIONS[ConnectionType.METAMASK];
      case ConnectionType.COINBASE_WALLET:
        return CONNECTIONS[ConnectionType.COINBASE_WALLET];
      case ConnectionType.WALLET_CONNECT:
        return CONNECTIONS[ConnectionType.WALLET_CONNECT];
      case ConnectionType.NETWORK:
        return CONNECTIONS[ConnectionType.NETWORK];
    }
  }
};
