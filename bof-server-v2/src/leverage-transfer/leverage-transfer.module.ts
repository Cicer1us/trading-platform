import { Module } from '@nestjs/common'
import { LeverageTransferService } from './leverage-transfer.service'
import { LeverageTransferController } from './leverage-transfer.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LeverageTransfer } from './entities/leverage-transfer.entity'

@Module({
	imports: [TypeOrmModule.forFeature([LeverageTransfer])],
	controllers: [LeverageTransferController],
	providers: [LeverageTransferService]
})
export class LeverageTransferModule {}
