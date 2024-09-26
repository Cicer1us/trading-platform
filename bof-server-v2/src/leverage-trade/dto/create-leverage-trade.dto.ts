import { OmitType } from '@nestjs/swagger'
import { LeverageTrade } from '../entities/leverage-trade.entity'

export class CreateLeverageTradeDto extends OmitType(LeverageTrade, ['id'] as const) {}
