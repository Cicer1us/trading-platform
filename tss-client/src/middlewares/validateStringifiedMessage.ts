import { ClassType, transformAndValidate } from 'class-transformer-validator'
import { Request, Response, NextFunction } from 'express'

export function validateStringifiedMessage<T>(c: T, whitelist = true) {
	return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			try {
				const toValidate = JSON.parse(req.body.message)
				const transformed = await transformAndValidate<Record<string, unknown>>(
					c as unknown as ClassType<Record<string, unknown>>,
					toValidate,
					{ validator: { whitelist } }
				)
				req.body.params = transformed
				next()
			} catch (err) {
				res.status(400).json({
					error: true,
					message: 'Message validation failed',
					originalError: err
				})
			}
		} catch (error) {
			res.status(400).json({
				error: true,
				message: 'Signed message should be stringified JSON'
			})
		}
	}
}
