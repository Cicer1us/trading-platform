import { Module } from '@nestjs/common'
import { AffiliateService } from './affiliate.service'
import { AffiliateController } from './affiliate.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Affiliate } from './entities/affiliate.entity'
import { AffiliatedUser } from './entities/affiliated-user.entity'
import { LimitOrder } from 'src/limit-order/entities/limit-order.entity'
import { Swap } from 'src/swap/entities/swap.entity'
import { SwapModule } from 'src/swap/swap.module'
import { LimitOrderModule } from 'src/limit-order/limit-order.module'
import { LeverageTradeModule } from '../leverage-trade/leverage-trade.module'

@Module({
	imports: [
		TypeOrmModule.forFeature([Swap, LimitOrder, Affiliate, AffiliatedUser]),
		SwapModule,
		LimitOrderModule,
		LeverageTradeModule
	],
	providers: [AffiliateService],
	controllers: [AffiliateController]
})
export class AffiliateModule {}
