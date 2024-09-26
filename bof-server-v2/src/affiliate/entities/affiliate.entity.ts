import { ApiProperty } from '@nestjs/swagger'
import { Entity, Column, CreateDateColumn, PrimaryColumn } from 'typeorm'

export const AFFILIATE_ID_LENGTH = 12
@Entity()
export class Affiliate {
	@ApiProperty()
	@PrimaryColumn()
	id: string

	@ApiProperty()
	@Column()
	name: string

	@ApiProperty()
	@Column({ nullable: true })
	companyName: string

	@ApiProperty()
	@Column({ nullable: true })
	email: string

	@ApiProperty()
	@Column({ nullable: true })
	phone: string

	@ApiProperty()
	@CreateDateColumn()
	createdAt: Date
}
