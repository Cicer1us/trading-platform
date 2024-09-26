import { ClassType, transformAndValidate } from 'class-transformer-validator'
import { Request, Response, NextFunction } from 'express'

export function makeValidateBody<T>(
	c: T,
	whitelist = true,
	errorHandler?: (err: unknown, req: Request, res: Response, next: NextFunction) => void
) {
	return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const toValidate = req.body
		if (!toValidate) {
			if (errorHandler) {
				errorHandler({ type: 'no-body' }, req, res, next)
			} else {
				res.status(400).json({
					error: true,
					message: 'Validation failed',
					originalError: { message: 'No request body found' }
				})
			}
		} else {
			try {
				const transformed = await transformAndValidate<Record<string, unknown>>(
					c as unknown as ClassType<Record<string, unknown>>,
					toValidate,
					{
						validator: { whitelist }
					}
				)
				req.body = transformed
				next()
			} catch (err) {
				if (errorHandler) {
					errorHandler(err, req, res, next)
				} else {
					res.status(400).json({
						error: true,
						message: 'Validation failed',
						originalError: err
					})
				}
			}
		}
	}
}
