import { OmitType } from '@nestjs/swagger'
import { LimitOrder } from '../entities/limit-order.entity'

export class CreateLimitOrderDto extends OmitType(LimitOrder, [
	'status',
	'takerGasFeeAmount',
	'transactionHash',
	'id',
	'createdAt',
	'takerAmountUSD',
	'takerTokenFeeAmountUSD',
	'takerGasFeeAmountUSD'
] as const) {}
