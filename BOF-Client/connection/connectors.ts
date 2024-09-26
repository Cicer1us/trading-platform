import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { initializeConnector, Web3ReactHooks } from '@web3-react/core';
import { GnosisSafe } from '@web3-react/gnosis-safe';
import { MetaMask } from '@web3-react/metamask';
import { Network } from '@web3-react/network';
import { Connector } from '@web3-react/types';
import { chains, Chains, RPC_PROVIDERS, RPC_URL } from './chainConfig';
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';

export enum ConnectionType {
  INJECTED = 'INJECTED',
  COINBASE_WALLET = 'COINBASE_WALLET',
  WALLET_CONNECT = 'WALLET_CONNECT',
  NETWORK = 'NETWORK',
  GNOSIS_SAFE = 'GNOSIS_SAFE',
}

export interface Connection {
  connector: Connector;
  hooks: Web3ReactHooks;
  type: ConnectionType;
}

function onError(error: Error) {
  console.debug(`web3-react error: ${error}`);
}

const [web3Network, web3NetworkHooks] = initializeConnector<Network>(
  actions => new Network({ actions, urlMap: RPC_PROVIDERS, defaultChainId: 1 })
);

export const networkConnection: Connection = {
  connector: web3Network,
  hooks: web3NetworkHooks,
  type: ConnectionType.NETWORK,
};

const [web3Injected, web3InjectedHooks] = initializeConnector<MetaMask>(actions => new MetaMask({ actions, onError }));
export const injectedConnection: Connection = {
  connector: web3Injected,
  hooks: web3InjectedHooks,
  type: ConnectionType.INJECTED,
};

const [web3GnosisSafe, web3GnosisSafeHooks] = initializeConnector<GnosisSafe>(actions => new GnosisSafe({ actions }));
export const gnosisSafeConnection: Connection = {
  connector: web3GnosisSafe,
  hooks: web3GnosisSafeHooks,
  type: ConnectionType.GNOSIS_SAFE,
};

const [web3CoinbaseWallet, web3CoinbaseWalletHooks] = initializeConnector<CoinbaseWallet>(
  actions =>
    new CoinbaseWallet({
      actions,
      options: {
        url: RPC_URL[Chains.MAINNET],
        appName: 'bitoftrade',
        reloadOnDisconnect: true,
      },
      onError,
    })
);
export const coinbaseWalletConnection: Connection = {
  connector: web3CoinbaseWallet,
  hooks: web3CoinbaseWalletHooks,
  type: ConnectionType.COINBASE_WALLET,
};

const [web3WalletConnect, web3WalletConnectHooks] = initializeConnector<WalletConnectV2>(actions => {
  const RPC_URL_WITHOUT_FALLBACKS = Object.entries(RPC_URL).reduce(
    (map, [chainId, url]) => ({
      ...map,
      [chainId]: url,
    }),
    {}
  );
  return new WalletConnectV2({
    actions,
    options: {
      rpcMap: RPC_URL_WITHOUT_FALLBACKS,
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
      chains: [Chains.MAINNET],
      optionalChains: Object.keys(chains).map(Number),
      optionalMethods: ['eth_signTypedData', 'eth_signTypedData_v3', 'eth_signTypedData_v4', 'eth_sign'],
      showQrModal: true,
      qrModalOptions: {
        themeVariables: {
          '--wcm-z-index': '100',
          '--wcm-accent-color': '#38D9C0',
          '--wcm-background-color': '#38D9C0',
        },
      },
    },
  });
});

export const walletConnectConnection: Connection = {
  connector: web3WalletConnect,
  hooks: web3WalletConnectHooks,
  type: ConnectionType.WALLET_CONNECT,
};
