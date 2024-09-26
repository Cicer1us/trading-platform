import { TypeOrmModule } from '@nestjs/typeorm'
import { Swap } from './swap/entities/swap.entity'
import { LimitOrder } from './limit-order/entities/limit-order.entity'
import { Affiliate } from './affiliate/entities/affiliate.entity'
import { AffiliatedUser } from './affiliate/entities/affiliated-user.entity'
import { LeverageTrade } from './leverage-trade/entities/leverage-trade.entity'
import { LeverageTransfer } from './leverage-transfer/entities/leverage-transfer.entity'
import { Admin } from './admin-auth/admin.entity'

export default TypeOrmModule.forRoot({
	type: 'mssql',
	authentication: {
		type: 'default',
		options: {
			userName: process.env.MSSQL_USER,
			password: process.env.SA_PASSWORD
		}
	},
	options: { encrypt: true },
	host: process.env.MSSQL_HOST,
	port: Number(process.env.MSSQL_PORT),
	database: process.env.MSSQL_DATABASE,
	synchronize: true,
	entities: [Affiliate, AffiliatedUser, Swap, LimitOrder, LeverageTrade, LeverageTransfer, Admin]
})
