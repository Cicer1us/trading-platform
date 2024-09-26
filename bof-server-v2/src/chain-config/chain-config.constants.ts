import { Token } from './chain-config.interface'

export enum Chain {
	MAINNET = 1,
	POLYGON = 137,
	FANTOM = 250,
	BSC = 56,
	AVALANCHE = 43114,
	ARBITRUM = 42161,
	OPTIMISM = 10
}
export type DefaultToken = Omit<Token, 'address' | 'chainId'>

export const nativeToken: Record<number, Token> = {
	[Chain.MAINNET]: {
		chainId: Chain.MAINNET,
		name: 'ETH',
		symbol: 'ETH',
		address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
		decimals: 18,
		logoURI:
			'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
	},
	[Chain.POLYGON]: {
		chainId: Chain.POLYGON,
		name: 'MATIC',
		symbol: 'MATIC',
		address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
		decimals: 18,
		logoURI:
			'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png'
	},
	[Chain.FANTOM]: {
		chainId: Chain.FANTOM,
		name: 'FTM',
		symbol: 'FTM',
		address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
		decimals: 18,
		logoURI: 'https://tokens.1inch.io/0x4e15361fd6b4bb609fa63c81a2be19d873717870.png'
	},
	[Chain.BSC]: {
		chainId: Chain.BSC,
		name: 'BNB',
		symbol: 'BNB',
		address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
		decimals: 18,
		logoURI: 'https://iconape.com/wp-content/files/ti/209546/svg/binance-coin-seeklogo.com.svg'
	},
	[Chain.AVALANCHE]: {
		chainId: Chain.AVALANCHE,
		name: 'AVAX',
		symbol: 'AVAX',
		address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
		decimals: 18,
		logoURI: 'https://cryptologos.cc/logos/avalanche-avax-logo.svg?v=022'
	},
	[Chain.ARBITRUM]: {
		chainId: Chain.ARBITRUM,
		name: 'ETH',
		symbol: 'ETH',
		address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
		logoURI:
			'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
		decimals: 18
	},
	[Chain.OPTIMISM]: {
		chainId: Chain.OPTIMISM,
		name: 'ETH',
		symbol: 'ETH',
		address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
		logoURI:
			'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
		decimals: 18
	}
}

export const tokensList: Record<number, string[]> = {
	[Chain.MAINNET]: [
		'https://www.gemini.com/uniswap/manifest.json',
		'https://wispy-bird-88a7.uniswap.workers.dev/?url=http://tokenlist.aave.eth.link',
		'https://gateway.ipfs.io/ipns/tokens.uniswap.org'
	],
	[Chain.POLYGON]: [
		'https://unpkg.com/quickswap-default-token-list@1.2.38/build/quickswap-default.tokenlist.json',
		'https://unpkg.com/@cometh-game/default-token-list@1.0.39/build/comethswap-default.tokenlist.json',
		'https://gateway.pinata.cloud/ipfs/QmSp78Z1q7mBZosTReEc9UpbSurN8Bhp1dvA4jpcqr4Byq',
		'https://raw.githubusercontent.com/dfyn/new-host/main/list-token.tokenlist.json'
	],
	[Chain.FANTOM]: [
		'https://raw.githubusercontent.com/SpookySwap/spooky-info/master/src/constants/token/spookyswap.json'
	],
	[Chain.BSC]: [
		'https://tokens.pancakeswap.finance/pancakeswap-extended.json',
		'https://gateway.pinata.cloud/ipfs/QmdKy1K5TMzSHncLzUXUJdvKi1tHRmJocDRfmCXxW5mshS'
	],
	[Chain.AVALANCHE]: [
		'https://raw.githubusercontent.com/pangolindex/tokenlists/main/pangolin.tokenlist.json',
		'https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/joe.tokenlist.json'
	],
	[Chain.ARBITRUM]: ['https://bridge.arbitrum.io/token-list-42161.json'],
	[Chain.OPTIMISM]: ['https://static.optimism.io/optimism.tokenlist.json']
}

export const explorerUrl: Record<number, string> = {
	[Chain.MAINNET]: 'https://api.etherscan.io/api',
	[Chain.POLYGON]: 'https://api.polygonscan.com/api',
	[Chain.FANTOM]: ' https://api.ftmscan.com/api',
	[Chain.BSC]: 'https://api.bscscan.com/api',
	[Chain.AVALANCHE]: 'https://api.snowtrace.io/api',
	[Chain.ARBITRUM]: 'https://api.arbiscan.io/api',
	[Chain.OPTIMISM]: 'https://api-optimistic.etherscan.io/api'
}

export const defaultToken: DefaultToken = {
	symbol: 'ERC20',
	name: 'Unknown',
	logoURI: 'https://www.boxexchanger.net/_nuxt/img/eth-erc20.37fba60.png',
	decimals: 18
}
