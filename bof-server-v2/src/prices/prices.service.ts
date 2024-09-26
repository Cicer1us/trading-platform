import { HttpService } from '@nestjs/axios'
import { Cache } from 'cache-manager'
import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common'
import { GetPricesDto } from './get-prices.dto'
import { CHAIN_CONFIG } from '../chain-config/chain-config.config'
import { Chain } from '../chain-config/chain-config.constants'

const getPricesCoingeckoUrl = (chain: string, addresses: string): string => {
	return (
		`https://pro-api.coingecko.com/api/v3/simple/token_price/${chain}?` +
		`vs_currencies=usd&contract_addresses=${addresses}` +
		`&x_cg_pro_api_key=${process.env.COINGECKO_API_KEY}`
	)
}

const getPriceMoralisUrl = (chain: string, address: string): string => {
	return `https://deep-index.moralis.io/api/v2/erc20/${address}/price?chain=${chain}`
}

export type PricesObj = Record<string, { usd: number }>

const nativeAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
const wrappedNativeAddress: Record<Chain, string> = {
	[Chain.MAINNET]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
	[Chain.POLYGON]: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
	[Chain.BSC]: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
	[Chain.FANTOM]: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
	[Chain.AVALANCHE]: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
	[Chain.OPTIMISM]: '0x4200000000000000000000000000000000000006',
	[Chain.ARBITRUM]: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1'
}

@Injectable()
export class PricesService {
	private logger: Logger
	constructor(
		@Inject(CACHE_MANAGER)
		private cacheManager: Cache,
		private httpService: HttpService
	) {
		this.logger = new Logger('Prices service')
	}

	getPricesCoingecko(chain: string, addresses: string[]): Promise<{ data: PricesObj }> {
		const url = getPricesCoingeckoUrl(chain, addresses.join(','))
		return this.httpService.axiosRef.get(url)
	}

	getPriceMoralis(chain: string, address: string): Promise<{ data: { usdPrice: number } }> {
		const url = getPriceMoralisUrl(chain, address)
		return this.httpService.axiosRef.get(url, {
			headers: { 'X-API-Key': process.env.MORALIS_API_KEY }
		})
	}

	async cachePrices(chainId: number, prices: PricesObj): Promise<void> {
		for (const pricesKey in prices) {
			const price = prices[pricesKey]
			await this.cacheManager.set(`${chainId}:${pricesKey}`, price.usd, 30)
		}
	}

	async fillPricesFromCacheAndMarkMissing(
		pricesResult: PricesObj,
		reqAddressArr: string[],
		chainId: number
	): Promise<string[]> {
		const needToReFetch = []
		for (let i = 0; i < reqAddressArr.length; i++) {
			const address = reqAddressArr[i]
			const price = await this.cacheManager.get<string>(`${chainId}:${address}`)
			if (price) {
				pricesResult[address] = { usd: Number(price) }
			} else {
				needToReFetch.push(address)
			}
		}
		return needToReFetch
	}

	async handleFetchPricesCoingecko(coinGeckoChainId: string, addresses: string[]): Promise<PricesObj> {
		try {
			if (addresses) {
				return (await this.getPricesCoingecko(coinGeckoChainId, addresses)).data
			}
		} catch (e) {
			this.logger.error(e)
			this.logger.error(`Error while trying to fetch from coingecko`)
			return {}
		}
	}

	async handleFetchPricesMoralis(
		moralisChainName: string,
		addresses: string[],
		prices: PricesObj
	): Promise<void> {
		try {
			const priceRequests = []
			for (let i = 0; i < addresses.length; i++) {
				const address = addresses[i]
				priceRequests.push(this.getPriceMoralis(moralisChainName, address))
			}

			const results = await Promise.all(priceRequests)
			results.forEach((res, index) => {
				const price = res?.data?.usdPrice
				if (price) {
					prices[addresses[index]] = { usd: Number(price) }
				}
			})
		} catch (e) {
			this.logger.error(e)
			this.logger.error(`Unable fetch price. Chain: ${moralisChainName}, tokens: ${addresses}`)
		}
	}

	async getPrices(query: GetPricesDto): Promise<PricesObj> {
		const chain = CHAIN_CONFIG[query.chainId]
		const reqAddressArr = query.addresses.replace(nativeAddress, wrappedNativeAddress[chain.id]).split(',')
		const pricesResult: PricesObj = {}

		const needToReFetch = await this.fillPricesFromCacheAndMarkMissing(pricesResult, reqAddressArr, chain.id)
		const prices = await this.handleFetchPricesCoingecko(chain.coinGeckoChainId, needToReFetch)

		const notFoundOnCoingecko = []
		needToReFetch.forEach((address) => {
			if (!prices[address]) {
				notFoundOnCoingecko.push(address)
			}
		})

		await this.handleFetchPricesMoralis(chain.moralisChainName, notFoundOnCoingecko, prices)
		await this.cachePrices(chain.id, prices)

		return {
			...pricesResult,
			...prices,
			[nativeAddress]: pricesResult[wrappedNativeAddress[chain.id]] ?? prices[wrappedNativeAddress[chain.id]]
		}
	}
}
