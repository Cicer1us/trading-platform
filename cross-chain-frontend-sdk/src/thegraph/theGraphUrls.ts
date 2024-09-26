import { Chain } from '@bitoftrade/cross-chain-core';

export const THE_GRAPH_URL: Record<Chain, string> = {
  [Chain.MAINNET]: '',
  [Chain.POLYGON]: 'https://api.thegraph.com/subgraphs/name/kanievksyidanylo/cross-chain-swaps-v2-polygon',
  [Chain.BSC]: 'https://api.thegraph.com/subgraphs/name/kanievksyidanylo/cross-chain-swaps-v2-bsc',
  [Chain.FANTOM]: 'https://api.thegraph.com/subgraphs/name/kanievksyidanylo/cross-chain-swaps-v2-fantom',
  [Chain.AVALANCHE]: 'https://api.thegraph.com/subgraphs/name/kanievksyidanylo/cross-chain-swaps-v2-avalanche',
  [Chain.ARBITRUM]: '',
  [Chain.OPTIMISM]: ''
};
