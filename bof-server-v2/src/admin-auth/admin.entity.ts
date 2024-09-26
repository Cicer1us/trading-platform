import { ApiProperty } from '@nestjs/swagger'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Admin extends BaseEntity {
	@ApiProperty()
	@PrimaryGeneratedColumn('increment')
	id: number

	@ApiProperty()
	@Column({ unique: true })
	login: string

	@ApiProperty()
	@Column({ nullable: true })
	password: string
}
