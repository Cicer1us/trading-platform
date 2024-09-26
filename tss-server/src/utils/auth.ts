import { AuthToken } from '@bitoftrade/tss-core'
import { getIsKeyShareAdmin, getKeyShareHolderByAdmin, recoverAddress } from '@src/core'
import { ConnectTssClientDto } from '@src/dto/connectTssClientDto'
import { transformAndValidate } from 'class-transformer-validator'

export const verifyConnectedTssClientOrReject = async (token: AuthToken): Promise<void> => {
	if (!token.r || !token.s || !token.v || !token.message) {
		throw new Error('Invalid token format')
	}

	const parsedMessage: object = JSON.parse(token.message)
	await transformAndValidate(ConnectTssClientDto, parsedMessage)

	const isKeyShareAdmin = await getIsKeyShareAdmin(token.keyShareAdmin)
	if (!isKeyShareAdmin) {
		throw new Error(`KeyShareAdmin is not whitelisted`)
	}

	const keyShareHolder = await getKeyShareHolderByAdmin(token.keyShareAdmin)
	if (!keyShareHolder) {
		throw new Error(`KeyShareHolder for current KeyShareAdmin doesn't exist`)
	}

	const recoveredAddress = recoverAddress(token, token.message)

	if (recoveredAddress.toLowerCase() !== keyShareHolder.toLowerCase()) {
		throw new Error(`Message is not signed by keyShareHolder`)
	}
}
