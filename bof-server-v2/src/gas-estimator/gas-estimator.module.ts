import { Module } from '@nestjs/common'
import { GasEstimatorService } from './gas-estimator.service'
import { ChainConfigModule } from 'src/chain-config/chain-config.module'

@Module({
	imports: [ChainConfigModule],
	providers: [GasEstimatorService],
	exports: [GasEstimatorService]
})
export class GasEstimatorModule {}
