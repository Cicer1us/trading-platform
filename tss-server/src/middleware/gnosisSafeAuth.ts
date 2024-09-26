import { verifyGnosisSafeAdminSignedMessageOrReject } from '@src/core'
import { Request, Response, NextFunction } from 'express'

export function gnosisSafeAuth() {
	return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			await verifyGnosisSafeAdminSignedMessageOrReject(req.body.message, req.body.txHash)
			next()
		} catch (error) {
			res.status(500).json({
				error: true,
				message: error.message
			})
		}
	}
}
