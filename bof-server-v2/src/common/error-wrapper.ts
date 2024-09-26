import { sentryCaptureException } from './sentry-configuration'

export class BlockchainEventListenerError extends Error {
	constructor(message: string, sendToSentry = true, sentryIssueType = 'blockchain event listener') {
		super(message)
		if (sendToSentry) sentryCaptureException(message, sentryIssueType)
	}
}

export class EntityNotFoundError extends Error {
	constructor(message: string, sendToSentry = true, sentryIssueType = 'Entity is not found') {
		super(message)
		if (sendToSentry) sentryCaptureException(message, sentryIssueType)
	}
}
