import { Module } from '@nestjs/common'
// use import ConfigModule before other modules to be able to use process.env in any file
import ConfigModule from './config-module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { GasEstimatorModule } from './gas-estimator/gas-estimator.module'
import { SwapModule } from './swap/swap.module'
import { LimitOrderModule } from './limit-order/limit-order.module'
import { SeedModule } from './seed/seed.module'
import { AffiliateModule } from './affiliate/affiliate.module'
import { LeverageTradeModule } from './leverage-trade/leverage-trade.module'
import { LeverageTransferModule } from './leverage-transfer/leverage-transfer.module'
import { AdminAuthModule } from './admin-auth/admin-auth.module'
import { ChainConfigModule } from './chain-config/chain-config.module'
import { PricesModule } from './prices/prices.module'
import TypeOrmModule from './typeorm-module'

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'public')
		}),
		ConfigModule,
		TypeOrmModule,
		GasEstimatorModule,
		SwapModule,
		LimitOrderModule,
		SeedModule,
		AffiliateModule,
		LeverageTradeModule,
		LeverageTransferModule,
		AdminAuthModule,
		ChainConfigModule,
		PricesModule
	]
})
export class AppModule {}
