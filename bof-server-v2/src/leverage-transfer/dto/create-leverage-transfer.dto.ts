import { OmitType } from '@nestjs/swagger'
import { LeverageTransfer } from '../entities/leverage-transfer.entity'

export class CreateLeverageTransferDto extends OmitType(LeverageTransfer, ['id'] as const) {}
