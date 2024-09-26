import { Web3ReactHooks } from '@web3-react/core';
import { coinbaseWallet, hooks as coinbaseWalletHooks } from './coinbaseWallet';
import { hooks as metaMaskHooks, metaMask } from './metaMask';
import { hooks as walletConnectHooks, walletConnect } from './walletConnect';
import { Connector } from '@web3-react/types';
import { initializeConnector } from '@web3-react/core';
import { Network } from '@web3-react/network';
import { URLS } from '../chains';
import { hooks as walletConnectV2Hooks, walletConnectV2 } from './walletConnectV2';

const [network, networkHooks] = initializeConnector<Network>(actions => new Network({ actions, urlMap: URLS }));

export const connectors: [Connector, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
  [walletConnectV2, walletConnectV2Hooks],
  [coinbaseWallet, coinbaseWalletHooks],
  [network, networkHooks]
];
