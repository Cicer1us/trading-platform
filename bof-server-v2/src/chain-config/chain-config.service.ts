import { HttpException, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { Cron, CronExpression } from '@nestjs/schedule'
import { catchError, firstValueFrom, map } from 'rxjs'
import {
	ChainConfig,
	CoinGeckoCurrency,
	CoinGeckoSimplePrice,
	RawToken,
	Token,
	TokenPrices,
	TokensListResponse
} from './chain-config.interface'
import { CHAIN_CONFIG } from './chain-config.config'
import { Chain, defaultToken } from './chain-config.constants'
import { COIN_GECKO_URL } from 'src/common/constants'
import { convertFromWei } from 'src/common/web3-helpers'

@Injectable()
export class ChainConfigService implements OnApplicationBootstrap {
	private _config: ChainConfig = CHAIN_CONFIG
	private logger: Logger

	constructor(private httpService: HttpService) {
		this.logger = new Logger('Chain Service')
	}

	public get config(): ChainConfig {
		return this._config
	}

	getTokens(): Record<number, Token> {
		const tokens = {}
		for (const [chainId, chain] of Object.entries(this._config)) {
			tokens[chainId] = chain.tokens
		}
		return tokens
	}

	findToken(address: string, chainId: number): Token {
		const tokenAddress = address.toLocaleLowerCase()
		const token = this.config[chainId].tokens.find((token) => token.address === tokenAddress)
		if (token) return token
		return { ...defaultToken, address, chainId }
	}

	@Cron(CronExpression.EVERY_10_MINUTES)
	async onApplicationBootstrap(): Promise<void> {
		await this.loadTokensList()
	}

	async loadTokensList(): Promise<void> {
		for (const chain of Object.values(this.config)) {
			let tokens = [{ ...chain.nativeToken }]
			for (const listURL of chain.tokensList) {
				try {
					const tokensListResponse = await this.get<TokensListResponse>(listURL)
					if (tokensListResponse?.tokens) {
						tokens = [...tokens, ...tokensListResponse.tokens]
					}
				} catch (error) {}
			}
			if (tokens.length > 1) {
				this._config[chain.id].tokens = this.getUniqueTokens(tokens)
					.filter((token) => !!token?.symbol)
					.map((token) => this.normalizeToken(token))
					.filter((token) => token.chainId === chain.id)
			}
		}
	}

	normalizeToken(token: RawToken): Token {
		return {
			symbol: token.symbol,
			name: token.name ?? 'Token',
			decimals: token.decimals,
			address: token.address.toLowerCase(),
			chainId: token?.chainId ?? token?.network,
			logoURI: (token?.logoURI ?? token?.img)?.replace('ipfs://', 'https://ipfs.io/ipfs/')
		}
	}

	getUniqueTokens(tokensList: RawToken[]): RawToken[] {
		const uniqueTokens: Record<string, RawToken> = {}
		for (const token of tokensList) {
			const key = token.address.toLocaleLowerCase()
			if (!uniqueTokens.hasOwnProperty(key)) {
				uniqueTokens[key] = { ...token, address: key }
			}
			if (!uniqueTokens[key].logoURI && token.logoURI) {
				uniqueTokens[key].logoURI = token.logoURI
			}
		}
		return Object.values(uniqueTokens)
	}

	async getNativeTokenPrice(chainId: Chain): Promise<number> {
		const currency = CoinGeckoCurrency.USD
		const apiKey = process.env.COINGECKO_API_KEY
		const coinGeckoId = this.config[chainId].coinGeckoNativeId
		const url = `${COIN_GECKO_URL}/v3/simple/price`
		const requestParams = { params: { x_cg_pro_api_key: apiKey, ids: coinGeckoId, vs_currencies: currency } }
		try {
			const response = await this.get<CoinGeckoSimplePrice>(url, requestParams)
			return response?.[coinGeckoId]?.[currency] ?? 0
		} catch (e) {
			console.log(e)
			return 0
		}
	}

	async getTokenPricesByAddresses(addresses: string[], chainId: Chain): Promise<TokenPrices> {
		const currency = CoinGeckoCurrency.USD
		const apiKey = process.env.COINGECKO_API_KEY
		const coinGeckoId = this.config[chainId].coinGeckoChainId
		const url = `${COIN_GECKO_URL}/v3/simple/token_price/${coinGeckoId}`
		const requestParams = {
			params: { x_cg_pro_api_key: apiKey, contract_addresses: addresses.join(','), vs_currencies: currency }
		}
		try {
			const response = await this.get<CoinGeckoSimplePrice>(url, requestParams)
			const prices = {}
			Object.keys(response).forEach((address) => (prices[address] = response?.[address]?.[currency] ?? 0))
			return prices
		} catch (e) {
			this.logger.error(e.message)
			return {}
		}
	}

	async getTokenPrices(chainId: Chain, addresses: string[]): Promise<TokenPrices> {
		const nativeToken = this.config[chainId].nativeToken
		const erc20Prices = await this.getErc20TokenPrices(chainId, addresses)
		const nativeTokenPrice = await this.getNativeTokenPrice(chainId)
		return { ...erc20Prices, [nativeToken.address]: nativeTokenPrice }
	}

	async getErc20TokenPrices(chainId: Chain, addresses: string[]): Promise<TokenPrices> {
		// coingecko api supports only 40 max token addresses by request
		try {
			let prices = {}
			const requests = []
			const chunkSize = 40
			for (let i = 0; i < addresses.length; i += chunkSize) {
				const chunk = addresses.slice(i, i + chunkSize)
				requests.push(this.getTokenPricesByAddresses(chunk, chainId))
			}
			const tokenPricesResponses = await Promise.all(requests)
			tokenPricesResponses.forEach((tokenPrices) => (prices = { ...prices, ...tokenPrices }))
			return prices
		} catch (error) {
			this.logger.error(error.message)
			return {}
		}
	}

	convertWeiToHuman(address: string, chainId: Chain, weiAmount: string): number {
		if (address === this.config[chainId].nativeToken.address) {
			return this.convertNativeTokenAmountFromWei(chainId, weiAmount)
		}
		return this.convertTokenAmountFromWei(address, chainId, weiAmount)
	}

	convertNativeTokenAmountFromWei(chainId: Chain, weiAmount: string): number {
		const nativeToken = this.config[chainId].nativeToken
		return Number(convertFromWei(Number(weiAmount), nativeToken?.decimals))
	}

	convertTokenAmountFromWei(address: string, chainId: Chain, weiAmount: string): number {
		const token = this.config[chainId].tokens.find((token) => token.address === address.toLowerCase())
		if (!token) return 0
		// TODO: change everywhere convertFromWei return type from string to number
		return Number(convertFromWei(Number(weiAmount), token?.decimals))
	}

	async convertGasCostToUSD(gasCost: string, chainId: Chain): Promise<number> {
		const nativeTokenPrice = await this.getNativeTokenPrice(chainId)
		const humanGasCost = this.convertNativeTokenAmountFromWei(chainId, gasCost)
		return humanGasCost * nativeTokenPrice
	}

	async convertDestAmountAndFeeToUSD(
		chainId: Chain,
		destToken: string,
		destAmount: string,
		feeAmount: string
	): Promise<[number, number]> {
		const tokenPrice = await this.getTokenPrices(chainId, [destToken])
		const price = tokenPrice[destToken]
		const humanDestAmount = this.convertTokenAmountFromWei(destToken, chainId, destAmount)
		const humanFeeAmount = this.convertTokenAmountFromWei(destToken, chainId, feeAmount)
		return [humanDestAmount * price, humanFeeAmount * price]
	}

	async get<T>(url: string, params?: Record<string, Record<string, string>>): Promise<T> {
		try {
			const response = await this.httpService.get<T>(url, { ...params }).pipe(
				catchError((e) => {
					throw new HttpException(e?.response?.data, e?.response?.status)
				}),
				map((res) => res?.data)
			)
			return firstValueFrom(response, { defaultValue: null })
		} catch (error) {
			this.logger.error(error)
			return null
		}
	}
}
