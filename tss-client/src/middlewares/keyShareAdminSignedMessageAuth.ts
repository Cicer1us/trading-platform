import { defaultWeb3Provider } from '@src/core'
import { SignedMessageDto } from '@src/dto/signedMessage.dto'
import { TypedRequestBody } from '@src/interfaces'
import env from '@src/utils/env.validation'
import { Response, NextFunction } from 'express'

export function keyShareAdminSignedMessageAuth() {
	return async (
		req: TypedRequestBody<SignedMessageDto>,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const { message, signature } = req.body
			const address = defaultWeb3Provider.eth.accounts.recover(message, signature)
			if (env.KEY_SHARE_ADMIN === address.toLowerCase()) {
				next()
			} else {
				res.status(400).json({
					error: true,
					message: 'Message is not signed by current keyShareAdmin'
				})
			}
		} catch (error) {
			res.status(500).json({
				error: true,
				message: 'Failed to verify signed message'
			})
		}
	}
}
