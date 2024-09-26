import { initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { Connection, ConnectionType } from '../types';

export const [metaMask, hooks] = initializeConnector<MetaMask>(actions => new MetaMask({ actions }));
export const metaMaskConnection: Connection = {
  connector: metaMask,
  type: ConnectionType.METAMASK
};
