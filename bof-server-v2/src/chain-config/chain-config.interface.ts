interface ChainData {
	id: number
	rpcHttpUrl: string
	rpcWsUrl: string
	explorerApiUrl: string
	explorerApiKey: string
	tokensList: string[]
	nativeToken: Token
	tokens: Token[]
	isTest: boolean
	coinGeckoChainId: string
	coinGeckoNativeId: string
	moralisChainName?: string
}

export type ChainConfig = Record<number, ChainData>

export class Token {
	chainId: number
	symbol: string
	name: string
	decimals: number
	logoURI: string
	address: string
}

export type TokenPrices = Record<string, number>

export class RawToken extends Token {
	network?: number
	img?: string
}

export interface TokensListResponse {
	name: string
	timestamp: string
	version: Record<string, number>
	tags: Record<string, unknown>
	logoURI: string
	keywords: string[]
	tokens: RawToken[]
}

export type CoinGeckoSimplePrice = Record<string, Record<string, number>>

export enum CoinGeckoCurrency {
	USD = 'usd'
}
