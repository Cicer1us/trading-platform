import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, Check } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { checkColumnType, lowerCaseTransform } from '../../common/db-helpers'
import { ZERO_ADDRESS } from '../../common/ethereum-static-addresses'
import { IsNumber, IsString } from 'class-validator'

export enum LimitOrderStatus {
	Open = 'Open',
	Cancelled = 'Cancelled',
	Filled = 'Filled'
}

@Entity()
@Check(checkColumnType('status', LimitOrderStatus))
export class LimitOrder extends BaseEntity {
	@ApiProperty()
	@PrimaryGeneratedColumn('increment')
	id: number

	@ApiProperty()
	@Column({ unique: true })
	@IsString()
	orderHash: string

	@ApiProperty()
	@Column({ nullable: true })
	@IsString()
	transactionHash: string

	@ApiProperty()
	@Column({ transformer: lowerCaseTransform() })
	@IsString()
	maker: string

	@ApiProperty()
	@Column({ transformer: lowerCaseTransform(), default: ZERO_ADDRESS })
	@IsString()
	taker: string

	@ApiProperty()
	@Column({ transformer: lowerCaseTransform() })
	@IsString()
	makerToken: string

	@ApiProperty()
	@Column({ transformer: lowerCaseTransform() })
	@IsString()
	takerToken: string

	@ApiProperty()
	@Column()
	@IsString()
	makerAmount: string

	@ApiProperty()
	@Column()
	@IsString()
	takerAmount: string

	@ApiProperty()
	@Column()
	@IsString()
	takerTokenFeeAmount: string

	@ApiProperty()
	@Column({ transformer: lowerCaseTransform(), default: ZERO_ADDRESS })
	@IsString()
	sender: string

	@ApiProperty()
	@Column({ transformer: lowerCaseTransform(), default: ZERO_ADDRESS })
	@IsString()
	pool: string

	@ApiProperty()
	@Column()
	@IsNumber()
	chainId: number

	@ApiProperty()
	@Column({ transformer: lowerCaseTransform() })
	@IsString()
	feeRecipient: string

	@ApiProperty()
	@Column()
	@IsString()
	salt: string

	@ApiProperty()
	@Column({ nullable: true })
	takerGasFeeAmount: string

	@ApiProperty()
	@Column({ transformer: lowerCaseTransform() })
	@IsString()
	verifyingContract: string

	@ApiProperty()
	@Column()
	@IsString()
	expiry: string

	@ApiProperty()
	@Column({ default: LimitOrderStatus.Open })
	status: LimitOrderStatus

	@ApiProperty()
	@Column({ default: 0, nullable: true, type: 'float' })
	takerAmountUSD: number

	@ApiProperty()
	@Column({ default: 0, nullable: true, type: 'float' })
	takerTokenFeeAmountUSD: number

	@ApiProperty()
	@Column({ default: 0, nullable: true, type: 'float' })
	takerGasFeeAmountUSD: number

	@ApiProperty()
	@CreateDateColumn()
	createdAt: Date
}
