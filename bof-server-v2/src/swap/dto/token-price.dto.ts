export interface TokensPricesResponseDto {
	status: {
		timestamp: string
		error_code: number
		error_message: null | string
		elapsed: number
		credit_count: number
		notice: null
		total_count: number
	}
	data: TokenPrice[]
}

export interface TokenPrice {
	id: string
	name: string
	symbol: string
	slug: string
	total_supply: number
	last_updated: string
	quote: Record<string, TokenQuote>
}

export interface TokenQuote {
	price: number
	volume_24h: number
	volume_change_24h: number
	percent_change_1h: number
	percent_change_24h: number
	percent_change_7d: number
	percent_change_30d: number
	percent_change_60d: number
	percent_change_90d: number
	market_cap: number
	market_cap_dominance: number
	fully_diluted_market_cap: number
	last_updated: string
}
