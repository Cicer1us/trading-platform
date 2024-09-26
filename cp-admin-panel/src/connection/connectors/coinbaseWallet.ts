import { initializeConnector } from '@web3-react/core';
import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { Connection, ConnectionType, ChainId } from '../types';
import { CHAINS } from '../chains';

export const [coinbaseWallet, hooks] = initializeConnector<CoinbaseWallet>(
  actions =>
    new CoinbaseWallet({
      actions,
      options: {
        url: CHAINS[ChainId.MAINNET].rpcUrls[0] ?? '',
        appName: 'cp-admin-panel'
      }
    })
);

export const coinbaseConnection: Connection = {
  connector: coinbaseWallet,
  type: ConnectionType.COINBASE_WALLET
};
