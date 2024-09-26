import env from '@src/utils/env.validation'

export const rpcUrls: Record<string, string> = env.AVAILABLE_CHAINS.reduce(
	(urls, chainId) => ({
		...urls,
		[chainId]: process.env[`RPC_URL_${chainId}`]
	}),
	{}
)
