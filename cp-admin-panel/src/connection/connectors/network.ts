import { initializeConnector } from '@web3-react/core';
import { Network } from '@web3-react/network';
import { URLS } from '../chains';
import { Connection, ConnectionType } from '../types';

export const [network, hooks] = initializeConnector<Network>(actions => new Network({ actions, urlMap: URLS }));

export const networkConnection: Connection = {
  connector: network,
  type: ConnectionType.NETWORK
};
