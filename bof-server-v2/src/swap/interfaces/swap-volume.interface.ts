export interface SwapVolume {
	destToken: string
	srcToken: string
	swapCount: number
	initiator?: string
	chainId: number
	feesInUSD: number
	volumeInUSD: number
}

export interface SwapUSDVolume extends SwapVolume {
	srcTokenLogoURI: string
	srcTokenSymbol: string
	srcTokenDecimals: number
	destTokenLogoURI: string
	destTokenSymbol: string
	destTokenDecimals: number
}

export interface TotalSwapsStat {
	totalSwapCount: number
	totalVolumeInUSD: number
	totalFeesInUSD: number
	volumes?: SwapUSDVolume[]
}
