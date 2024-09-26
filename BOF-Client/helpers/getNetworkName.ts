import { chains, Chains } from 'connection/chainConfig';

export default function getNetworkName(chainId: Chains): string {
  return chains[chainId].name ?? 'Unknown';
}
