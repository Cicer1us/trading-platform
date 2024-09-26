import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'

enum StepSize {
	DAY = 'day',
	WEEK = 'week',
	MONTH = 'month'
}

export class LeverageDynamicStatsSearchDto {
	@ApiProperty({ required: true, enum: StepSize })
	@IsEnum(StepSize)
	stepSize?: StepSize

	@ApiProperty({ required: false })
	@Type(() => Number)
	@IsNumber()
	@Max(10)
	@Min(1)
	@IsOptional()
	numberOfSteps: number
}
