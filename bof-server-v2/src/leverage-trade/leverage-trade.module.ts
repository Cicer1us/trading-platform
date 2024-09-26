import { Module } from '@nestjs/common'
import { LeverageTradeService } from './leverage-trade.service'
import { LeverageTradeController } from './leverage-trade.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LeverageTrade } from './entities/leverage-trade.entity'
import { AdminAuthModule } from '../admin-auth/admin-auth.module'

@Module({
	imports: [TypeOrmModule.forFeature([LeverageTrade]), AdminAuthModule],
	controllers: [LeverageTradeController],
	providers: [LeverageTradeService],
	exports: [LeverageTradeService]
})
export class LeverageTradeModule {}
