import env from '@src/utils/env.validation'
import { Type } from 'class-transformer'
import {
	IsNumber,
	IsOptional,
	IsArray,
	IsBoolean,
	IsString,
	Matches,
	ValidateNested,
	IsIn
} from 'class-validator'
// Used for Type decorator
import 'reflect-metadata'

export class AbiInput {
	@IsString()
	type: string

	@IsString()
	name: string

	@IsBoolean()
	indexed: boolean
}

export class Abi {
	@IsString()
	name: string

	@IsString()
	type: string

	@IsBoolean()
	anonymous: boolean

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => AbiInput)
	inputs: AbiInput
}

export class EventSignDto {
	@IsNumber()
	@IsOptional()
	eventLogIndex: number

	@ValidateNested()
	@Type(() => Abi)
	abi: Abi

	@Type(() => Number)
	@IsIn(env.AVAILABLE_CHAINS)
	chainId: number

	@Matches(/^0x([A-Fa-f0-9]{64})$/, { message: 'Invalid transaction hash' })
	txHash: string
}
