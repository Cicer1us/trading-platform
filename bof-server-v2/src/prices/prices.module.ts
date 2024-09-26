import { CacheModule, Module } from '@nestjs/common'
import { PricesController } from './prices.controller'
import { PricesService } from './prices.service'
import { HttpModule } from '@nestjs/axios'

@Module({
	imports: [CacheModule.register(), HttpModule],
	controllers: [PricesController],
	providers: [PricesService]
})
export class PricesModule {}
