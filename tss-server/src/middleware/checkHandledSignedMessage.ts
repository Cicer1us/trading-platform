import { checkSavedHandledSignedMessage } from '@src/utils/json'
import { Request, Response, NextFunction } from 'express'

export function checkAlreadyHandledSignedMessage() {
	return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const wasHandled = await checkSavedHandledSignedMessage(req.body.txHash)
		if (!wasHandled) {
			next()
		} else {
			res.status(400).json({
				error: true,
				message: 'This tx hash was already handled'
			})
		}
	}
}
