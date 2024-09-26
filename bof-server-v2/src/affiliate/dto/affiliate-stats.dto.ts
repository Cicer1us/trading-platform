import { ApiProperty } from '@nestjs/swagger'

class Statistic {
	@ApiProperty()
	count: number

	@ApiProperty()
	feesUSD: number

	@ApiProperty()
	volumeUSD: number

	@ApiProperty()
	chainId: number
}
export class AffiliateStatsDto {
	@ApiProperty({ isArray: true, type: String })
	userAddresses: string[]

	@ApiProperty({ isArray: true, type: Statistic })
	swapStat: Statistic[]

	@ApiProperty()
	limitOrdersStat: Statistic

	@ApiProperty()
	leverageStat: Statistic

	@ApiProperty()
	id: string

	@ApiProperty()
	companyName: string
}
