import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ScheduleModule } from '@nestjs/schedule'
import { ChainConfigController } from './chain-config.controller'
import { ChainConfigService } from './chain-config.service'

@Module({
	imports: [HttpModule, ScheduleModule.forRoot()],
	controllers: [ChainConfigController],
	providers: [ChainConfigService],
	exports: [ChainConfigService]
})
export class ChainConfigModule {}
