import { Connector } from '@web3-react/types';
import { isSupportedChain } from 'src/common/helpers';
import { CHAINS, URLS } from './chains';
import { networkConnection } from './connectors/network';
import { walletConnectConnection } from './connectors/walletConnect';
import { ChainId } from './types';

export const switchChain = async (connector: Connector, chainId: ChainId) => {
  /**
   * Took this function from bof client.
   * Should be refactored.
   */

  if (!isSupportedChain(chainId)) {
    throw new Error(`Unsupported chainId: ${chainId}`);
  }

  if (connector === walletConnectConnection.connector || connector === networkConnection.connector) {
    await connector.activate(chainId);
  } else {
    await connector.activate({
      chainId: Number(chainId),
      chainName: CHAINS[chainId].name,
      rpcUrls: URLS[chainId],
      nativeCurrency: CHAINS[chainId].nativeCurrency,
      blockExplorerUrls: [CHAINS[chainId].blockExplorerUrls]
    });
  }
};
