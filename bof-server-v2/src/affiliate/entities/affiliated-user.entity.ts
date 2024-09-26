import { ApiProperty } from '@nestjs/swagger'
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn
} from 'typeorm'
import { Affiliate } from './affiliate.entity'

export const AFFILIATE_ID_LENGTH = 12
@Entity()
export class AffiliatedUser extends BaseEntity {
	@ApiProperty()
	@PrimaryGeneratedColumn('increment')
	id: number

	@ApiProperty()
	@Column({ unique: true })
	clientAddress: string

	@ApiProperty()
	@ManyToOne(() => Affiliate, (aff) => aff.id, { eager: true })
	@JoinColumn()
	affiliate?: Affiliate
	@Column({ nullable: true })
	affiliateId: string

	@ApiProperty()
	@CreateDateColumn()
	createdAt: Date
}
