import { ApiProperty } from '@nestjs/swagger'

export class LeverageTransferResponseDto {
	@ApiProperty()
	totalAmount: number

	@ApiProperty()
	totalCount: number
}
