import { createLogger, format, Logger, transports } from 'winston'

const myFormat = format.printf(({ level, message, timestamp, service }) => {
	return `${level} [${service}] (${timestamp}) : ${message}`
})

export function initLogger(serviceName: string): Logger {
	return createLogger({
		format: format.combine(format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }), format.colorize(), myFormat),
		defaultMeta: { service: serviceName },
		transports: [new transports.Console()]
	})
}

export default initLogger
