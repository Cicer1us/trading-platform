interface Event {
	removed: boolean
	logIndex: number
	transactionIndex: number
	transactionHash: string
	blockHash: string
	blockNumber: number
	address: string
	id: string
	signature: string
	raw: {
		data: string
		topics: string[]
	}
}

export interface LimitOrderFilledEvent extends Event {
	returnValues: ReturnValuesOrderFilled
	event: 'LimitOrderFilled'
}

export interface OrderCancelledEvent extends Event {
	returnValues: ReturnValuesOrderCanceled
	event: 'OrderCancelled'
}

interface ReturnValuesOrderFilled {
	0: string
	1: string
	2: string
	3: string
	4: string
	5: string
	6: string
	7: string
	8: string
	9: string
	10: string
	orderHash: string
	maker: string
	taker: string
	takerToken: string
	makerToken: string
	feeRecipient: string
	takerTokenFilledAmount: string
	makerTokenFilledAmount: string
	takerTokenFeeFilledAmount: string
	protocolFeePaid: string
	pool: string
}

interface ReturnValuesOrderCanceled {
	0: string
	1: string
	orderHash: string
	maker: string
}
