import { initializeConnector } from '@web3-react/core';
import { URLS } from '../chains';
import { Connection, ConnectionType } from '../types';
import { WalletConnect } from '@web3-react/walletconnect';

export const [walletConnect, hooks] = initializeConnector<WalletConnect>(
  actions =>
    new WalletConnect({
      actions,
      options: {
        rpc: URLS
      }
    })
);

export const walletConnectConnection: Connection = {
  connector: walletConnect,
  type: ConnectionType.WALLET_CONNECT
};
