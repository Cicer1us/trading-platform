import { Chain, explorerUrl, tokensList, nativeToken } from './chain-config.constants'
import { ChainConfig } from './chain-config.interface'

export const CHAIN_CONFIG: ChainConfig = {
	[Chain.MAINNET]: {
		isTest: false,
		id: Chain.MAINNET,
		tokens: [],
		rpcHttpUrl: `https://mainnet.infura.io/v3/${process.env.INFURA_ID}`,
		rpcWsUrl: `wss://mainnet.infura.io/ws/v3/${process.env.INFURA_ID}`,
		explorerApiUrl: explorerUrl[Chain.MAINNET],
		explorerApiKey: process.env.MAINNET_EXPLORER_API_KEY,
		tokensList: tokensList[Chain.MAINNET],
		nativeToken: nativeToken[Chain.MAINNET],
		coinGeckoChainId: 'ethereum',
		coinGeckoNativeId: 'ethereum',
		moralisChainName: 'eth'
	},
	[Chain.POLYGON]: {
		isTest: false,
		id: Chain.POLYGON,
		tokens: [],
		rpcHttpUrl: 'https://polygon-rpc.com',
		rpcWsUrl: '',
		explorerApiUrl: explorerUrl[Chain.POLYGON],
		explorerApiKey: process.env.POLYGON_EXPLORER_API_KEY,
		tokensList: tokensList[Chain.POLYGON],
		nativeToken: nativeToken[Chain.POLYGON],
		coinGeckoChainId: 'polygon-pos',
		coinGeckoNativeId: 'matic-network',
		moralisChainName: 'polygon'
	},
	[Chain.FANTOM]: {
		isTest: false,
		id: Chain.FANTOM,
		tokens: [],
		rpcHttpUrl: `https://rpc.ftm.tools`,
		rpcWsUrl: ``,
		explorerApiUrl: explorerUrl[Chain.FANTOM],
		explorerApiKey: process.env.FANTOM_EXPLORER_API_KEY,
		tokensList: tokensList[Chain.FANTOM],
		nativeToken: nativeToken[Chain.FANTOM],
		coinGeckoChainId: 'fantom',
		coinGeckoNativeId: 'fantom',
		moralisChainName: 'fantom'
	},
	[Chain.BSC]: {
		isTest: false,
		id: Chain.BSC,
		tokens: [],
		rpcHttpUrl: 'https://bsc-dataseed1.defibit.io',
		rpcWsUrl: '',
		explorerApiUrl: explorerUrl[Chain.BSC],
		explorerApiKey: process.env.BSC_EXPLORER_API_KEY,
		tokensList: tokensList[Chain.BSC],
		nativeToken: nativeToken[Chain.BSC],
		coinGeckoChainId: 'binance-smart-chain',
		coinGeckoNativeId: 'binancecoin',
		moralisChainName: 'bcs'
	},
	[Chain.AVALANCHE]: {
		isTest: false,
		id: Chain.AVALANCHE,
		tokens: [],
		rpcHttpUrl: 'https://api.avax.network/ext/bc/C/rpc',
		rpcWsUrl: '',
		explorerApiUrl: explorerUrl[Chain.AVALANCHE],
		explorerApiKey: process.env.AVALANCHE_EXPLORER_API_KEY,
		tokensList: tokensList[Chain.AVALANCHE],
		nativeToken: nativeToken[Chain.AVALANCHE],
		coinGeckoChainId: 'avalanche',
		coinGeckoNativeId: 'avalanche-2',
		moralisChainName: 'avalanche'
	},
	[Chain.ARBITRUM]: {
		isTest: false,
		id: Chain.ARBITRUM,
		tokens: [],
		rpcHttpUrl: 'https://rpc.ankr.com/arbitrum',
		rpcWsUrl: '',
		explorerApiUrl: explorerUrl[Chain.ARBITRUM],
		explorerApiKey: process.env.ARBITRUM_EXPLORER_API_KEY,
		tokensList: tokensList[Chain.ARBITRUM],
		nativeToken: nativeToken[Chain.ARBITRUM],
		coinGeckoChainId: 'arbitrum-one',
		coinGeckoNativeId: 'ethereum',
		moralisChainName: 'arbitrum'
	},
	[Chain.OPTIMISM]: {
		isTest: false,
		id: Chain.OPTIMISM,
		tokens: [],
		rpcHttpUrl: 'https://mainnet.optimism.io',
		rpcWsUrl: '',
		explorerApiUrl: explorerUrl[Chain.OPTIMISM],
		explorerApiKey: process.env.OPTIMISM_EXPLORER_API_KEY,
		tokensList: tokensList[Chain.OPTIMISM],
		nativeToken: nativeToken[Chain.OPTIMISM],
		coinGeckoChainId: 'optimistic-ethereum',
		coinGeckoNativeId: 'ethereum'
	}
}
