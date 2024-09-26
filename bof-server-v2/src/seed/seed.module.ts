import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LimitOrder } from 'src/limit-order/entities/limit-order.entity'
import { Swap } from 'src/swap/entities/swap.entity'
import { SeedService } from './seed.service'

@Module({
	imports: [TypeOrmModule.forFeature([Swap, LimitOrder])],
	providers: [SeedService]
})
export class SeedModule {}
