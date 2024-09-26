import { cleanEnv, str, num, makeValidator } from 'envalid'
import 'dotenv/config'

const numArray = makeValidator((value: string): number[] => {
	const array: number[] = JSON.parse(value)
	if (!array.every((value) => !isNaN(value))) {
		throw new Error('Every value in array should be a number')
	}
	return array.map((v) => Number(v))
})

const ethereumAddress = makeValidator((value: string): string => {
	if (/^0x[a-fA-F0-9]{40}$/.test(value)) return value.toLowerCase()
	else throw new Error('Is not Ethereum Address')
})

const env = cleanEnv(process.env, {
	PORT: num(),
	NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
	KEY_SHARE_MANAGER_ADDRESS: ethereumAddress(),
	KEY_SHARE_MANAGER_CHAIN_ID: str(),
	ADMIN_GNOSIS_SAFE_ADDRESS: ethereumAddress(),
	ADMIN_GNOSIS_SAFE_CHAIN_ID: str(),
	AVAILABLE_CHAINS: numArray(),
	GG20_AVAILABLE_PORTS: numArray(),
	NPM_TOKEN: str(),
	// default value set env variable not required
	SIGNER_NAME: str({ default: 'signer' })
})

// check if every available chainId has rpc url
env.AVAILABLE_CHAINS.forEach((chainId) => {
	if (!process.env[`RPC_URL_${chainId}`]) {
		console.error(`ChainId ${chainId} doesn't have rpc url`)
		process.exit(1)
	}
})

export default env
