import { Chain } from 'src/chain-config/chain-config.constants'

export const COIN_GECKO_URL = 'https://pro-api.coingecko.com/api'

export const THE_GRAPH_PARASWAP_URL = {
	[Chain.MAINNET]: 'https://api.thegraph.com/subgraphs/name/paraswap/paraswap-subgraph',
	[Chain.POLYGON]: 'https://api.thegraph.com/subgraphs/name/paraswap/paraswap-subgraph-polygon',
	[Chain.BSC]: 'https://api.thegraph.com/subgraphs/name/paraswap/paraswap-subgraph-bsc',
	[Chain.FANTOM]: 'https://api.thegraph.com/subgraphs/name/paraswap/paraswap-subgraph-fantom',
	[Chain.AVALANCHE]: 'https://api.thegraph.com/subgraphs/name/paraswap/paraswap-subgraph-avalanche',
	[Chain.OPTIMISM]: 'https://api.thegraph.com/subgraphs/name/paraswap/paraswap-subgraph-optimism',
	[Chain.ARBITRUM]: 'https://api.thegraph.com/subgraphs/name/paraswap/paraswap-subgraph-arbitrum'
}
