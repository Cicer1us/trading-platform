import { Connector } from '@web3-react/types';
import { RPC_URL, FALLBACK_URLS, Chains, chains } from './chainConfig';
import { walletConnectConnection, networkConnection } from './connectors';
import { isSupportedChain } from './utils';

function getRpcUrl(chainId: Chains): string {
  switch (chainId) {
    case Chains.MAINNET:
    case Chains.GOERLI:
      return RPC_URL[chainId];
    // Attempting to add a chain using an infura URL will not work, as the URL will be unreachable from the MetaMask background page.
    // MetaMask allows switching to any publicly reachable URL, but for novel chains, it will display a warning if it is not on the "Safe" list.
    // See the definition of FALLBACK_URLS for more details.
    default:
      return FALLBACK_URLS[chainId][0];
  }
}

export const switchChain = async (connector: Connector, chainId: Chains) => {
  if (!isSupportedChain(chainId)) {
    throw new Error(`Chain ${chainId} not supported for connector (${typeof connector})`);
  } else if (connector === walletConnectConnection.connector || connector === networkConnection.connector) {
    await connector.activate(chainId);
  } else {
    const addChainParameter = {
      chainId,
      chainName: chains[chainId].name,
      rpcUrls: [getRpcUrl(chainId)],
      nativeCurrency: chains[chainId].nativeToken,
      blockExplorerUrls: [chains[chainId].explorerUrl],
    };
    await connector.activate(addChainParameter);
  }
};
