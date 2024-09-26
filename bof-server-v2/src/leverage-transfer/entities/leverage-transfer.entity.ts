import { ApiProperty } from '@nestjs/swagger'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { IsEnum, IsNumber } from 'class-validator'

export enum TransferOperation {
	DEPOSIT = 'DEPOSIT',
	WITHDRAWAL = 'WITHDRAWAL'
}

@Entity()
export class LeverageTransfer {
	@ApiProperty()
	@PrimaryGeneratedColumn('increment')
	id: number

	@ApiProperty({ enum: TransferOperation })
	@Column({ enum: TransferOperation })
	@IsEnum(TransferOperation)
	operation: TransferOperation

	@ApiProperty()
	@Column()
	@IsNumber()
	amount: number

	@ApiProperty()
	@CreateDateColumn()
	createdAt: Date
}
