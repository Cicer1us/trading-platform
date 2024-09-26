import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { lowerCaseTransform } from '../../common/db-helpers'
import { Chain } from 'src/chain-config/chain-config.constants'
import { IsNumber, IsString } from 'class-validator'

@Entity()
export class Swap {
	@ApiProperty()
	@PrimaryGeneratedColumn('increment')
	id: number

	@ApiProperty()
	@Column({ transformer: lowerCaseTransform() })
	@IsString()
	initiator: string

	@ApiProperty()
	@Column({ unique: true, transformer: lowerCaseTransform() })
	@IsString()
	hash: string

	@ApiProperty()
	@Column()
	@IsNumber()
	blockNumber: number

	@ApiProperty()
	@Column()
	@IsString()
	srcToken: string

	@ApiProperty()
	@Column({ nullable: true })
	@IsString()
	timestamp: string

	@ApiProperty()
	@Column({ nullable: false, default: Chain.MAINNET })
	@IsNumber()
	chainId: number

	@ApiProperty()
	@Column()
	@IsString()
	destToken: string

	@ApiProperty()
	@Column()
	@IsString()
	srcAmount: string

	@ApiProperty()
	@Column()
	@IsString()
	destAmount: string

	@ApiProperty()
	@Column({ nullable: true })
	@IsString()
	gasCost: string

	@ApiProperty()
	@Column({ nullable: true })
	@IsString()
	feeAmount: string

	// same as volume
	@ApiProperty()
	@Column({ default: 0, nullable: true, type: 'float' })
	destAmountUSD: number

	@ApiProperty()
	@Column({ default: 0, nullable: true, type: 'float' })
	feeAmountUSD: number

	@ApiProperty()
	@Column({ default: 0, nullable: true, type: 'float' })
	gasCostUSD: number

	@ApiProperty()
	@CreateDateColumn()
	createdAt: Date
}
