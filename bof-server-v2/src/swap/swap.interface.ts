export interface ParaswapSwap {
	id: string
	initiator: string
	srcToken: string
	destToken: string
	srcAmount: string
	destAmount: string
	referrer: string
	paraswapFee: string
	referrerFee: string
	feeCode: string
	feeToken: string
	txHash: string
	txGasUsed: string
	txGasPrice: string
	blockNumber: string
	timestamp: string
}
export interface FetchSwapsVariables {
	referrer: string
	afterBy?: string
}
