import { Injectable } from '@nestjs/common'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import Web3 from 'web3'

@Injectable()
export class GasEstimatorService {
	constructor(private chainConfigService: ChainConfigService) {}
	/**
	 * Calculate transaction gas used amount in wei.
	 * @param  {string} hash
	 * @returns Promise
	 */
	async calculateTxGasFeeAmount(hash: string, chainId: number): Promise<string> {
		const web3 = this.getWeb3Provider(chainId)
		const receipt = await web3.eth.getTransactionReceipt(hash)
		const transaction = await web3.eth.getTransaction(hash)
		const gasUsed = !isNaN(Number(receipt?.gasUsed)) ? Number(receipt?.gasUsed) : 0
		const gasPrice = !isNaN(Number(transaction?.gasPrice)) ? Number(transaction?.gasPrice) : 0

		return (gasUsed * gasPrice).toString()
	}

	getWeb3Provider(chainId: number): Web3 {
		const rpcUrl = this.chainConfigService.config[chainId].rpcHttpUrl
		if (rpcUrl) {
			const web3 = new Web3()
			web3.setProvider(new Web3.providers.HttpProvider(rpcUrl))
			return web3
		}
		return null
	}
}
