import * as Sentry from '@sentry/node'

export const sentryInit = (): void => {
	Sentry.init({
		dsn: process.env.SENTRY_DNS_URL,
		// Set tracesSampleRate to 1.0 to capture 100%
		// of transactions for performance monitoring.
		// We recommend adjusting this value in production
		tracesSampleRate: 1.0
	})
}

export const sentryCaptureException = (exception, issueType: string): void => {
	Sentry.captureException(exception, {
		tags: {
			issueType: issueType
		}
	})
}
