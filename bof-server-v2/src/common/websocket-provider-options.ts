export const INFURA_WEBSOCKET_OPTIONS = {
	timeout: 30000,
	reconnect: {
		auto: true,
		delay: 5000,
		maxAttempts: 10,
		onTimeout: false
	},
	clientConfig: {
		keepalive: true,
		keepaliveInterval: 60000,
		maxReceivedFrameSize: 10000000000,
		maxReceivedMessageSize: 10000000000
	}
}
