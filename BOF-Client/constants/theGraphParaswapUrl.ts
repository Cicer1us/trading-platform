import { Chains } from 'connection/chainConfig';

const THE_GRAPH_PARASWAP_URL = {
  [Chains.MAINNET]: 'https://api.thegraph.com/subgraphs/name/paraswap/paraswap-subgraph',
  [Chains.POLYGON]: 'https://api.thegraph.com/subgraphs/name/paraswap/paraswap-subgraph-polygon',
  [Chains.BSC]: 'https://api.thegraph.com/subgraphs/name/paraswap/paraswap-subgraph-bsc',
  [Chains.FANTOM]: 'https://api.thegraph.com/subgraphs/name/paraswap/paraswap-subgraph-fantom',
  [Chains.AVALANCHE]: 'https://api.thegraph.com/subgraphs/name/paraswap/paraswap-subgraph-avalanche',
  [Chains.OPTIMISM]: 'https://api.thegraph.com/subgraphs/name/paraswap/paraswap-subgraph-optimism',
  [Chains.ARBITRUM]: 'https://api.thegraph.com/subgraphs/name/paraswap/paraswap-subgraph-arbitrum',
};

export default THE_GRAPH_PARASWAP_URL;
