import { ApiProperty } from '@nestjs/swagger'

class MarketVolume {
	@ApiProperty()
	market: string

	@ApiProperty()
	fee: number

	@ApiProperty()
	volume: number

	@ApiProperty()
	tradesCount: number
}

export class LeverageStatistic {
	@ApiProperty()
	totalFee: number

	@ApiProperty()
	totalVolume: number

	@ApiProperty()
	tradesCount: number

	@ApiProperty()
	userAddress?: string
}
export class LeverageStatisticResponseDto extends LeverageStatistic {
	@ApiProperty({ isArray: true, type: MarketVolume })
	volumes: MarketVolume[]

	@ApiProperty({ required: false, isArray: true, type: LeverageStatistic })
	usersStat?: LeverageStatistic[]
}
