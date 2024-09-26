import { OmitType } from '@nestjs/swagger'
import { Swap } from '../entities/swap.entity'

export class CreateRawSwapDto extends OmitType(Swap, [
	'id',
	'createdAt',
	'feeAmountUSD',
	'destAmountUSD',
	'gasCostUSD'
] as const) {}
export class CreateSwapDto extends OmitType(Swap, ['id', 'createdAt'] as const) {}
