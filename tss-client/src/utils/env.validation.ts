import { cleanEnv, str, makeValidator, num, bool } from 'envalid'
import Web3 from 'web3'
import 'dotenv/config'

const numArray = makeValidator((value: string): number[] => {
	const array: number[] = JSON.parse(value)
	if (!array.every((value) => !isNaN(value))) {
		throw new Error('Every value in array should be a number')
	}
	return array.map((v) => Number(v))
})

const ethereumAddress = makeValidator((value: string) => {
	// somehow AWS ECS pass ethereum address from .env as decimal numbers
	// e.g. '0x08E194787b65f86AA3C2990F7F009E9603Bbff25' -> '50702527452486541380534916677552777960340848421'
	// to fix that, use this trick for parsing such cases
	if (!isNaN(Number(value)) && !Web3.utils.isAddress(value)) {
		return Web3.utils.toHex(value).toLowerCase()
	}

	if (/^0x[a-fA-F0-9]{40}$/.test(value)) {
		return value.toLowerCase()
	}

	throw new Error('Is not Ethereum Address')
})

const env = cleanEnv(process.env, {
	KEY_SHARE_ADMIN: ethereumAddress(),
	KEY_SHARE_HOLDER_PRIVATE_KEY: str(),
	NPM_TOKEN: str(),
	PORT: num(),
	SERVER_URL: str(),
	SM_MANAGER_BASE_URL: str(),
	NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
	KEY_SHARE_MANAGER_ADDRESS: ethereumAddress(),
	KEY_SHARE_MANAGER_CHAIN_ID: str(),
	ADMIN_GNOSIS_SAFE_ADDRESS: ethereumAddress(),
	ADMIN_GNOSIS_SAFE_CHAIN_ID: str(),
	AVAILABLE_CHAINS: numArray(),
	AUTO_CONNECT: bool({ default: true })
})

// check if every available chainId has rpc url
env.AVAILABLE_CHAINS.forEach((chainId) => {
	if (!process.env[`RPC_URL_${chainId}`]) {
		console.error(`ChainId ${chainId} doesn't have rpc url`)
		process.exit(1)
	}
})

export default env
