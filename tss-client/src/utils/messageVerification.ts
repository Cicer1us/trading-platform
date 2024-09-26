import { Sign } from 'web3-core'
import { defaultWeb3Provider } from '@src/core'

export const createAuthSignedMessage = (msg: string): Sign => {
	// Use only process.env for private key variable
	// because it can be dynamically updated
	return defaultWeb3Provider.eth.accounts.sign(msg, process.env.KEY_SHARE_HOLDER_PRIVATE_KEY)
}
