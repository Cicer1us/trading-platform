import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsEnum, IsOptional } from 'class-validator'
import { TransferOperation } from '../entities/leverage-transfer.entity'

export class LeverageTransferSearchParams {
	@ApiProperty({ enum: TransferOperation })
	@IsEnum(TransferOperation)
	operation: TransferOperation

	@ApiProperty({ required: false })
	@IsDateString()
	@IsOptional()
	dateFrom?: string

	@ApiProperty({ required: false })
	@IsDateString()
	@IsOptional()
	dateTo?: string
}
