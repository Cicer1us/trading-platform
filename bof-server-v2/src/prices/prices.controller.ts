import { Controller, Get, Query } from '@nestjs/common'
import { GetPricesDto } from './get-prices.dto'
import { PricesObj, PricesService } from './prices.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Prices')
@Controller('prices')
export class PricesController {
	constructor(private readonly pricesService: PricesService) {}

	@Get()
	getPrices(@Query() query: GetPricesDto): Promise<PricesObj> {
		return this.pricesService.getPrices(query)
	}
}
