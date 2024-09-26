import { Module } from '@nestjs/common'
import { LimitOrderService } from './limit-order.service'
import { LimitOrderController } from './limit-order.controller'
import { LimitOrder } from './entities/limit-order.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GasEstimatorModule } from '../gas-estimator/gas-estimator.module'
import { ChainConfigModule } from 'src/chain-config/chain-config.module'

@Module({
	imports: [TypeOrmModule.forFeature([LimitOrder]), GasEstimatorModule, ChainConfigModule],
	providers: [LimitOrderService],
	exports: [LimitOrderService],
	controllers: [LimitOrderController]
})
export class LimitOrderModule {}
