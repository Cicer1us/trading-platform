import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Chain } from 'src/chain-config/chain-config.constants'
import { LimitOrder } from 'src/limit-order/entities/limit-order.entity'
import { Swap } from 'src/swap/entities/swap.entity'
import { DeleteResult, EntityTarget, getConnection, Repository } from 'typeorm'

@Injectable()
export class SeedService implements OnModuleInit {
	private logger: Logger
	constructor(
		@InjectRepository(Swap)
		private swapRepo: Repository<Swap>,
		@InjectRepository(LimitOrder)
		private limitRepo: Repository<LimitOrder>
	) {
		this.logger = new Logger('Seed Service')
	}

	async onModuleInit(): Promise<void> {}

	async insertIntoDb(
		into: EntityTarget<unknown>,
		values: Record<string, unknown>[] | Array<unknown>
	): Promise<void> {
		await getConnection().createQueryBuilder().insert().into(into).values(values).execute()
	}
}
