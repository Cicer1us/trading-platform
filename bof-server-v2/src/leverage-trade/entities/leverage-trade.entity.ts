import { ApiProperty } from '@nestjs/swagger'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { IsEnum, IsNumber, IsString } from 'class-validator'

export enum LeverageTradeSide {
	BUY = 'BUY',
	SELL = 'SELL'
}

export enum LeverageTradeLiquidity {
	TAKER = 'TAKER',
	MAKER = 'MAKER'
}

export enum LeverageTradeType {
	MARKET = 'MARKET'
}

@Entity()
export class LeverageTrade {
	@ApiProperty()
	@PrimaryGeneratedColumn('increment')
	id: number

	@ApiProperty()
	@Column()
	@IsString()
	userAddress: string

	@ApiProperty({ enum: LeverageTradeSide })
	@Column({ enum: LeverageTradeSide })
	@IsEnum(LeverageTradeSide, { message: 'side should be BUY or SELL' })
	side: LeverageTradeSide

	@ApiProperty({ enum: LeverageTradeLiquidity })
	@Column({ enum: LeverageTradeLiquidity })
	@IsEnum(LeverageTradeLiquidity, { message: 'liquidity should be TAKER or MAKER' })
	liquidity: LeverageTradeLiquidity

	@ApiProperty({ enum: LeverageTradeType })
	@Column({ enum: LeverageTradeType })
	@IsEnum(LeverageTradeType, { message: 'type should be MARKET' })
	type: LeverageTradeType

	@ApiProperty()
	@Column()
	@IsString()
	market: string

	@ApiProperty()
	@Column('float')
	@IsNumber()
	price: number

	@ApiProperty()
	@Column('float')
	@IsNumber()
	size: number

	@ApiProperty()
	@Column('float')
	@IsNumber()
	fee: number

	@ApiProperty()
	@Column({ unique: true })
	@IsString()
	orderId: string

	@ApiProperty()
	@Column()
	@IsNumber()
	transactionId: number

	@ApiProperty()
	@Column()
	@IsNumber()
	orderClientId: string

	@ApiProperty()
	@CreateDateColumn()
	createdAt: Date
}
