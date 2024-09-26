import { SignedMsgType, ConnectTssClientParams } from '@bitoftrade/tss-core'
import { IsNotExpired } from '@src/utils/decorators'
import env from '@src/utils/env.validation'
import { ArrayContains, IsArray, IsEthereumAddress, IsIn, IsNumber, IsString } from 'class-validator'

export class ConnectTssClientDto implements ConnectTssClientParams {
	@IsNumber()
	@IsNotExpired()
	expiryTime: number

	@IsIn([SignedMsgType.CONNECT_TSS_CLIENT])
	type: SignedMsgType.CONNECT_TSS_CLIENT

	@IsEthereumAddress()
	@IsIn([env.KEY_SHARE_MANAGER_ADDRESS])
	keyShareManagerAddress: string

	@IsString()
	@IsIn([env.KEY_SHARE_MANAGER_CHAIN_ID])
	keyShareManagerChainId: string

	@IsEthereumAddress()
	@IsIn([env.ADMIN_GNOSIS_SAFE_ADDRESS])
	adminGnosisSafeAddress: string

	@IsString()
	@IsIn([env.ADMIN_GNOSIS_SAFE_CHAIN_ID])
	adminGnosisSafeChainId: string

	@IsArray()
	@ArrayContains(env.AVAILABLE_CHAINS)
	availableChains: number[]
}
