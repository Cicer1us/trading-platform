import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsString } from 'class-validator'
import { Chain } from '../chain-config/chain-config.constants'

const supportedChains = Object.keys(Chain).filter((chain) => !isNaN(Number(chain)))

export class GetPricesDto {
	@ApiProperty()
	@IsIn(supportedChains)
	@IsString()
	chainId: string

	@ApiProperty()
	@IsString()
	addresses: string
}

export class GetNativePriceDto {
	@ApiProperty()
	@IsString()
	chainId: number
}
