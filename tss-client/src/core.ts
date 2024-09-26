import { initCore } from '@bitoftrade/tss-core'
import { rpcUrls } from '@src/data/chain.config'
import Web3 from 'web3'
import env from './utils/env.validation'

const generateWeb3Providers = (): Record<string, Web3> => {
	return Object.keys(rpcUrls).reduce(
		(acc, currentNetworkId) => ({
			...acc,
			[currentNetworkId]: new Web3(rpcUrls[currentNetworkId])
		}),
		{}
	)
}

const web3Providers = generateWeb3Providers()
export const defaultWeb3Provider = web3Providers[env.KEY_SHARE_MANAGER_CHAIN_ID]

const {
	verifyGnosisSafeAdminSignedMessageOrReject,
	getKeyShareHolderByAdmin,
	getCurrentSigner,
	getKeyShareAdminIndexOrReject,
	verifyAndParseEventOrReject
} = initCore({
	web3Providers: web3Providers,
	config: {
		KEY_SHARE_MANAGER_ADDRESS: env.KEY_SHARE_MANAGER_ADDRESS,
		KEY_SHARE_MANAGER_CHAIN_ID: env.KEY_SHARE_MANAGER_CHAIN_ID,
		ADMIN_GNOSIS_SAFE_ADDRESS: env.ADMIN_GNOSIS_SAFE_ADDRESS,
		ADMIN_GNOSIS_SAFE_CHAIN_ID: env.ADMIN_GNOSIS_SAFE_CHAIN_ID
	}
})

export {
	getKeyShareHolderByAdmin,
	verifyGnosisSafeAdminSignedMessageOrReject,
	getKeyShareAdminIndexOrReject,
	getCurrentSigner,
	verifyAndParseEventOrReject
}
