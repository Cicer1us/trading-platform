import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import { Swap } from './entities/swap.entity'
import { Repository, SelectQueryBuilder } from 'typeorm'
import { CreateSwapDto } from './dto/create-swap.dto'
import { SearchSwapsDto } from './dto/search-swap.dto'
import SwapSettingsDto from './dto/swap-settings.dto'
import { StatsSwapsDto } from './dto/stats-swap.dto'
import { SwapUSDVolume, SwapVolume, TotalSwapsStat } from './interfaces/swap-volume.interface'
import { UsersCountDto } from '../leverage-trade/dto/users-count.dto'
import { SearchTradedTokensDto } from './dto/search-traded-tokens.dto'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import dayjs from 'dayjs'
import { SwapDynamicStatsSearchDto } from './dto/swap-dynamic-stats-search.dto'
import { ChainConfig, Token, TokenPrices } from 'src/chain-config/chain-config.interface'
import { THE_GRAPH_PARASWAP_URL } from 'src/common/constants'
import request from 'graphql-request'
import { Chain } from 'src/chain-config/chain-config.constants'
import { FetchSwapsVariables, ParaswapSwap } from './swap.interface'
import { PARASWAP_QUERY } from './swap.graphql'
import { CHAIN_CONFIG } from 'src/chain-config/chain-config.config'

@Injectable()
export class SwapService {
	private config: ChainConfig = CHAIN_CONFIG
	private currentChainIndex: number
	private logger: Logger
	private serverStartTimestamp: string

	constructor(
		@InjectRepository(Swap)
		private swapRepo: Repository<Swap>,
		private chainConfigService: ChainConfigService
	) {
		this.currentChainIndex = 0
		this.logger = new Logger('Swap Service')
		this.serverStartTimestamp = Math.ceil(new Date().getTime() / 1000).toString()
	}
	getCurrentChainId(): Chain {
		const chains = Object.values(this.config).filter((chain) => !chain.isTest)
		this.currentChainIndex++
		this.currentChainIndex = this.currentChainIndex % chains.length
		return chains[this.currentChainIndex].id
	}

	async create(swapDto: CreateSwapDto): Promise<Swap | void> {
		const prevSwap = await this.swapRepo.findOne({ hash: swapDto.hash })
		if (!prevSwap) {
			const swap = new Swap()

			swap.blockNumber = swapDto.blockNumber
			swap.srcAmount = swapDto.srcAmount
			swap.srcToken = swapDto.srcToken
			swap.destAmount = swapDto.destAmount
			swap.destToken = swapDto.destToken
			swap.initiator = swapDto.initiator
			swap.hash = swapDto.hash
			swap.gasCost = swapDto.gasCost
			swap.feeAmount = swapDto.feeAmount
			swap.chainId = swapDto.chainId
			swap.destAmountUSD = swapDto.destAmountUSD
			swap.feeAmountUSD = swapDto.feeAmountUSD
			swap.gasCostUSD = swapDto.gasCostUSD

			return this.swapRepo.save(swap)
		}
	}

	async batchCreate(swapsDto: CreateSwapDto[]): Promise<void> {
		const chunkSize = 20
		for (let i = 0; i < swapsDto.length; i += chunkSize) {
			const swaps = swapsDto.slice(i, i + chunkSize)
			await this.swapRepo.createQueryBuilder().insert().into(Swap).values(swaps).execute()
		}
	}
	/**
	 * Every 10 minutes
	 */
	@Cron(`0 */10 * * * *`)
	async updateSwaps(): Promise<void> {
		const chainId = this.getCurrentChainId()
		const swaps = await this.getLastSwapsByChain(chainId)
		if (swaps.length !== 0) {
			const prices = await this.getPricesBySwaps(chainId, swaps)
			const swapsDto = swaps.map((swap) => this.convertParaswapSwapToDBSwap(chainId, swap, prices))
			await this.batchCreate(swapsDto)
		}
	}

	async getLastSwapsByChain(chainId: Chain): Promise<ParaswapSwap[]> {
		const lastSwapInDB = await this.swapRepo.findOne({ where: { chainId }, order: { timestamp: 'DESC' } })
		const swaps = await this.fetchSwaps(chainId, lastSwapInDB?.timestamp ?? this.serverStartTimestamp)
		return swaps
	}

	async getPricesBySwaps(chainId: Chain, swaps: ParaswapSwap[]): Promise<TokenPrices> {
		const uniqueAddresses: Set<string> = new Set()
		swaps.forEach((swap) => {
			uniqueAddresses.add(swap.srcToken)
			uniqueAddresses.add(swap.destToken)
		})
		return this.chainConfigService.getTokenPrices(chainId, Array.from(uniqueAddresses))
	}

	convertParaswapSwapToDBSwap(chainId: Chain, swap: ParaswapSwap, prices: TokenPrices): CreateSwapDto {
		const [gasCostUSD, destAmountUSD, feeAmountUSD] = this.calcSwapUSDParams(chainId, swap, prices)
		return {
			chainId,
			gasCostUSD,
			destAmountUSD,
			feeAmountUSD,
			timestamp: swap.timestamp,
			gasCost: swap.txGasUsed,
			feeAmount: swap.referrerFee,
			srcToken: swap.srcToken,
			srcAmount: swap.srcAmount,
			destAmount: swap.destAmount,
			destToken: swap.destToken,
			hash: swap.txHash,
			initiator: swap.initiator,
			blockNumber: Number(swap.blockNumber)
		}
	}

	calcSwapUSDParams(chainId: Chain, swap: ParaswapSwap, prices: TokenPrices): [number, number, number] {
		const nativeToken = this.chainConfigService.config[chainId].nativeToken
		const gasCostHuman = this.chainConfigService.convertWeiToHuman(
			nativeToken.address,
			chainId,
			(Number(swap.txGasUsed) * Number(swap.txGasPrice)).toString()
		)
		const feeAmountHuman = this.chainConfigService.convertWeiToHuman(
			swap.destToken,
			chainId,
			swap.referrerFee
		)
		const destAmountHuman = this.chainConfigService.convertWeiToHuman(
			swap.destToken,
			chainId,
			swap.destAmount
		)
		const gasCostUSD = gasCostHuman * (prices[nativeToken.address] ?? 0)
		const destAmountUSD = destAmountHuman * (prices[swap.destToken] ?? 0)
		const feeAmountUSD = feeAmountHuman * (prices[swap.destToken] ?? 0)

		return [gasCostUSD, destAmountUSD, feeAmountUSD]
	}

	getSwapSettings(): SwapSettingsDto {
		return {
			feePercentage: Number(process.env.PARTNER_FEE_BPS ?? 0),
			partnerAddress: process.env.PARTNER_ADDRESS
		}
	}

	findSwapsByHashes(hashes: string[], chainId: number): Promise<Swap[]> {
		return this.swapRepo
			.createQueryBuilder('swap')
			.select(['swap.hash'])
			.where('swap.hash IN (:...hashes)', { hashes })
			.andWhere('swap.chainId = :id', { id: chainId })
			.getMany()
	}

	async findSwaps(query: SearchSwapsDto): Promise<Swap[]> {
		const request = await this.applyDefaultSwapFilters(query)
		return request.getMany()
	}

	applyDefaultSwapFilters(filters: StatsSwapsDto): SelectQueryBuilder<Swap> {
		const request = this.swapRepo.createQueryBuilder('swap').where('swap.feeAmount IS NOT NULL')

		if (filters.initiator) {
			request.andWhere('swap.initiator = :initiator', { initiator: filters.initiator })
		}

		if (filters.chainId) {
			request.andWhere('swap.chainId = :chainId', { chainId: filters.chainId })
		}

		if (filters.initiators) {
			request.andWhere('swap.initiator IN (:...initiators)', { initiators: filters.initiators })
		}

		if (filters.srcToken) {
			request.andWhere('swap.srcToken = :srcToken', { srcToken: filters.srcToken })
		}

		if (filters.destToken) {
			request.andWhere('swap.destToken = :destToken', { destToken: filters.destToken })
		}

		if (filters.dateFrom) {
			request.andWhere('swap.createdAt >= :dateFrom', { dateFrom: filters.dateFrom })
		}

		if (filters.dateTo) {
			request.andWhere('swap.createdAt <= :dateTo', { dateTo: filters.dateTo })
		}

		return request
	}

	async findUniqueAddresses(statsSwapsDto: StatsSwapsDto): Promise<UsersCountDto> {
		const query = this.applyDefaultSwapFilters(statsSwapsDto)

		const userListResult = await query
			.select('swap.initiator as address')
			.groupBy('swap.initiator')
			.getRawMany()

		return {
			uniqueUsersCount: userListResult.length,
			users: userListResult.map((res) => res.address)
		}
	}

	async getTradedTokens(statsSwapsDto: StatsSwapsDto | SearchTradedTokensDto): Promise<Token[]> {
		const swapStat = await this.getSwapVolumes(statsSwapsDto)
		const tokens = []
		swapStat.forEach((token) => {
			const srcToken = this.chainConfigService.findToken(token.srcToken, statsSwapsDto.chainId)
			const destToken = this.chainConfigService.findToken(token.destToken, statsSwapsDto.chainId)
			tokens.push(srcToken)
			tokens.push(destToken)
		})
		return tokens
	}

	async getSwapVolumes(params: StatsSwapsDto): Promise<SwapVolume[]> {
		const query = this.applyDefaultSwapFilters(params)
			.select([
				'swap.destToken as destToken',
				'swap.srcToken as srcToken',
				'COUNT(*) as swapCount',
				'SUM(swap.feeAmountUSD) as feesInUSD',
				'SUM(swap.destAmountUSD) as volumeInUSD',
				'swap.chainId as chainId'
			])
			.groupBy('swap.destToken')
			.addGroupBy('swap.srcToken')
			.addGroupBy('swap.chainId')

		if (params.includeInitiators) {
			query.addSelect('swap.initiator as initiator').addGroupBy('swap.initiator')
		}

		return query.getRawMany()
	}

	async getSwapUSDVolume(query: StatsSwapsDto): Promise<SwapUSDVolume[]> {
		const swapVolumes = await this.getSwapVolumes(query)
		if (swapVolumes.length !== 0) {
			return swapVolumes.map((swap) => {
				const chainId = swap.chainId
				const srcToken = this.chainConfigService.findToken(swap.srcToken, chainId)
				const destToken = this.chainConfigService.findToken(swap.destToken, chainId)
				return {
					...swap,
					srcTokenLogoURI: srcToken.logoURI,
					srcTokenSymbol: srcToken.symbol,
					srcTokenDecimals: srcToken.decimals,
					destTokenLogoURI: destToken.logoURI,
					destTokenSymbol: destToken.symbol,
					destTokenDecimals: destToken.decimals
				}
			})
		}
		return []
	}

	async getTotalSwapsStat(query: StatsSwapsDto): Promise<TotalSwapsStat> {
		let volumes = []
		try {
			volumes = await this.getSwapUSDVolume(query)
		} catch (e) {
			this.logger.error(e)
		}
		const total = {
			totalVolumeInUSD: 0,
			totalFeesInUSD: 0,
			totalSwapCount: 0
		}

		volumes.forEach((volume) => {
			total.totalFeesInUSD += volume.feesInUSD
			total.totalVolumeInUSD += volume.volumeInUSD
			total.totalSwapCount += volume.swapCount
		})

		if (query?.withoutVolumes) {
			return total
		}
		return { ...total, volumes }
	}

	async getDynamicData(params: SwapDynamicStatsSearchDto): Promise<Record<string, unknown>[]> {
		const numberOfSteps = params?.numberOfSteps ?? 5
		const promises = []
		const ranges = []

		for (let i = 0; i < numberOfSteps; i++) {
			const dateFrom = dayjs()
				.subtract(numberOfSteps - i, params.stepSize)
				.format('YYYY-MM-DD')
			const dateTo = dayjs()
				.subtract(numberOfSteps - 1 - i, params.stepSize)
				.format('YYYY-MM-DD')
			ranges.push({
				dateFrom,
				dateTo
			})

			promises.push(
				this.getTotalSwapsStat({
					dateFrom,
					dateTo,
					withoutVolumes: true,
					chainId: params.chainId
				})
			)
		}

		const results = await Promise.all(promises)
		for (let i = 0; i < numberOfSteps; i++) {
			results[i].dateFrom = ranges[i].dateFrom
			results[i].dateTo = ranges[i].dateTo
		}

		return results
	}

	async fetchSwaps(chainId: Chain, afterBy?: string): Promise<ParaswapSwap[]> {
		const url = THE_GRAPH_PARASWAP_URL[chainId]
		const variables: FetchSwapsVariables = {
			referrer: process.env.PARTNER_ADDRESS.toLowerCase(),
			...(afterBy ? { afterBy } : {})
		}
		if (url) {
			try {
				const response = await request<{ swaps: ParaswapSwap[] }>(url, PARASWAP_QUERY, variables)
				return response?.swaps ?? []
			} catch (e) {
				this.logger.error(e.message)
				return []
			}
		}
		return []
	}
}
