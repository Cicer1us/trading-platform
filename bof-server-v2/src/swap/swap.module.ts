import { Module } from '@nestjs/common'
import { SwapController } from './swap.controller'
import { HttpModule } from '@nestjs/axios'
import { GasEstimatorModule } from '../gas-estimator/gas-estimator.module'
import { SwapService } from './swap.service'
import { ScheduleModule } from '@nestjs/schedule'
import { Swap } from './entities/swap.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChainConfigModule } from 'src/chain-config/chain-config.module'

@Module({
	imports: [
		HttpModule,
		GasEstimatorModule,
		ScheduleModule.forRoot(),
		TypeOrmModule.forFeature([Swap]),
		GasEstimatorModule,
		ChainConfigModule
	],
	providers: [SwapService],
	controllers: [SwapController],
	exports: [SwapService]
})
export class SwapModule {}
