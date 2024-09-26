export interface LimitOrderVolume {
	takerToken: string
	makerToken: string
	orderCount: number
	volumeInWei: number
	feesInWei: number
	maker?: string
	volumeInUSD: number
	feesInUSD: number
}

export interface LimitOrderUSDVolume extends LimitOrderVolume {
	takerTokenDecimals: number
	takerTokenSymbol: string
	takerTokenLogoURI: string
	makerTokenDecimals: number
	makerTokenSymbol: string
	makerTokenLogoURI: string
}

export interface TotalLimitOrdersStat {
	totalLimitOrderCount: number
	totalVolumeInUSD: number
	totalFeesInUSD: number
	volumes: LimitOrderUSDVolume[]
}
