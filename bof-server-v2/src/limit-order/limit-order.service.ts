import { BadRequestException, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder, UpdateResult } from 'typeorm'
import { CreateLimitOrderDto } from './dto/create-limit-order.dto'
import { LimitOrder, LimitOrderStatus } from './entities/limit-order.entity'
import Web3 from 'web3'
import { getContractAddressesForChainOrThrow } from '@0x/contract-addresses'
import { INFURA_WEBSOCKET_OPTIONS } from '../common/websocket-provider-options'
import ZeroXAbi from './data/0x-abi'
import { LimitOrderFilledEvent, OrderCancelledEvent } from './limit-order.interface'
import { Contract } from 'web3-eth-contract'
import { EntityNotFoundError } from '../common/error-wrapper'
import LimitOrderSettingsDto from './dto/limit-order-settings.dto'
import { GasEstimatorService } from '../gas-estimator/gas-estimator.service'
import { StatsLimitOrderDto } from './dto/stats-limit-order.dto'
import {
	LimitOrderUSDVolume,
	LimitOrderVolume,
	TotalLimitOrdersStat
} from './interfaces/limit-order-volume.interface'
import { UsersCountDto } from '../leverage-trade/dto/users-count.dto'
import { SearchTradedLimitTokensDto } from './dto/search-traded-tokens.dto'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import dayjs from 'dayjs'
import { LimitDynamicStatsSearch } from './dto/limit-dynamic-stats-search.dto'
import { Chain } from 'src/chain-config/chain-config.constants'
import { Token } from 'src/chain-config/chain-config.interface'

@Injectable()
export class LimitOrderService implements OnApplicationBootstrap {
	private web3: Web3
	private logger: Logger
	private chainId = Chain.MAINNET
	constructor(
		@InjectRepository(LimitOrder)
		private limitOrderRepo: Repository<LimitOrder>,
		private gasService: GasEstimatorService,
		private chainConfigService: ChainConfigService
	) {}

	findAllByAddresses(address: string): Promise<LimitOrder[]> {
		return this.limitOrderRepo.find({ where: [{ maker: address }, { taker: address }] })
	}

	async create(limitOrderDto: CreateLimitOrderDto): Promise<LimitOrder> {
		try {
			const limitOrder = new LimitOrder()

			limitOrder.maker = limitOrderDto.maker
			limitOrder.taker = limitOrderDto.taker
			limitOrder.makerToken = limitOrderDto.makerToken
			limitOrder.takerToken = limitOrderDto.takerToken
			limitOrder.takerAmount = limitOrderDto.takerAmount
			limitOrder.makerAmount = limitOrderDto.makerAmount
			limitOrder.verifyingContract = limitOrderDto.verifyingContract
			limitOrder.salt = limitOrderDto.salt
			limitOrder.sender = limitOrderDto.sender
			limitOrder.chainId = limitOrderDto.chainId
			limitOrder.feeRecipient = limitOrderDto.feeRecipient
			limitOrder.pool = limitOrderDto.pool
			limitOrder.takerTokenFeeAmount = limitOrderDto.takerTokenFeeAmount
			limitOrder.orderHash = limitOrderDto.orderHash
			limitOrder.expiry = limitOrderDto.expiry

			const order = await this.limitOrderRepo.save(limitOrder)
			return order
		} catch (e) {
			throw new BadRequestException(e.message)
		}
	}

	getOrderSettings(): LimitOrderSettingsDto {
		return {
			feePercentage: Number(process.env.LIMIT_ORDER_FEE_PERCENTAGE ?? 0),
			partnerAddress: process.env.PARTNER_ADDRESS
		}
	}

	applyDefaultLimitOrderFilters(filters: StatsLimitOrderDto): SelectQueryBuilder<LimitOrder> {
		const request = this.limitOrderRepo
			.createQueryBuilder('order')
			.where('order.status = :status ', { status: filters.status })

		if (filters.maker) {
			request.andWhere('order.maker = :maker', { maker: filters.maker })
		}

		if (filters.makers) {
			request.andWhere('order.maker IN (:...makers)', { makers: filters.makers })
		}

		if (filters.makerToken) {
			request.andWhere('order.makerToken = :makerToken', { makerToken: filters.makerToken })
		}

		if (filters.takerToken) {
			request.andWhere('order.takerToken = :takerToken', { takerToken: filters.takerToken })
		}

		if (filters.dateFrom) {
			request.andWhere('order.createdAt >= :dateFrom', { dateFrom: filters.dateFrom })
		}

		if (filters.dateTo) {
			request.andWhere('order.createdAt <= :dateTo', { dateTo: filters.dateTo })
		}

		return request
	}

	async findUniqueAddresses(statsLimitOrderDto: StatsLimitOrderDto): Promise<UsersCountDto> {
		const query = this.applyDefaultLimitOrderFilters(statsLimitOrderDto)

		const userListResult = await query.select('order.maker as address').groupBy('order.maker').getRawMany()

		return {
			uniqueUsersCount: userListResult.length,
			users: userListResult.map((res) => res.address)
		}
	}

	async getTradedTokens(statsLimitOrderDto: SearchTradedLimitTokensDto): Promise<Token[]> {
		const limitStat = await this.getLimitOrderVolumes(statsLimitOrderDto)
		const tokens = []
		limitStat.forEach((token) => {
			const srcToken = this.chainConfigService.findToken(token.takerToken, this.chainId)
			const destToken = this.chainConfigService.findToken(token.makerToken, this.chainId)
			tokens.push(srcToken)
			tokens.push(destToken)
		})
		return tokens
	}

	async getLimitOrderVolumes(params: StatsLimitOrderDto): Promise<LimitOrderVolume[]> {
		const query = this.applyDefaultLimitOrderFilters(params)
			.select([
				'order.takerToken as takerToken',
				'order.makerToken as makerToken',
				'COUNT(*) as orderCount',
				'SUM(order.takerTokenFeeAmountUSD) as feesInUSD',
				'SUM(order.takerAmountUSD) as volumeInUSD'
			])
			.groupBy('order.takerToken')
			.addGroupBy('order.makerToken')

		if (params.includeMakers) {
			query.addSelect('order.maker as maker').addGroupBy('order.maker')
		}

		return query.getRawMany()
	}

	async getLimitOrderUSDVolume(query: StatsLimitOrderDto): Promise<LimitOrderUSDVolume[]> {
		const orderVolumes = await this.getLimitOrderVolumes(query)
		if (orderVolumes.length !== 0) {
			return orderVolumes.map((order) => {
				const srcToken = this.chainConfigService.findToken(order.makerToken, this.chainId)
				const destToken = this.chainConfigService.findToken(order.takerToken, this.chainId)
				return {
					...order,
					takerTokenDecimals: destToken.decimals,
					takerTokenSymbol: destToken.symbol,
					takerTokenLogoURI: destToken.logoURI,
					makerTokenDecimals: srcToken.decimals,
					makerTokenSymbol: srcToken.symbol,
					makerTokenLogoURI: srcToken.logoURI
				}
			})
		}
		return []
	}

	async getTotalLimitOrdersStat(query: StatsLimitOrderDto): Promise<TotalLimitOrdersStat> {
		const volumes = await this.getLimitOrderUSDVolume(query)
		const total = {
			totalVolumeInUSD: 0,
			totalFeesInUSD: 0,
			totalLimitOrderCount: 0
		}

		volumes.forEach((volume) => {
			total.totalFeesInUSD += volume.feesInUSD
			total.totalVolumeInUSD += volume.volumeInUSD
			total.totalLimitOrderCount += volume.orderCount
		})

		return { ...total, volumes }
	}

	async getDynamicData(params: LimitDynamicStatsSearch): Promise<Record<string, unknown>[]> {
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
				this.getTotalLimitOrdersStat({
					dateFrom,
					dateTo,
					withoutVolumes: true,
					status: LimitOrderStatus.Filled
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

	initWeb3(): void {
		const mainnetWsUrl = this.chainConfigService.config[this.chainId].rpcWsUrl
		this.web3 = new Web3(new Web3.providers.WebsocketProvider(mainnetWsUrl, INFURA_WEBSOCKET_OPTIONS))
		this.logger = new Logger('Limit order service')
	}
	/**
	 * Initialize events listener to track all order updates
	 */
	onApplicationBootstrap(): void {
		this.initWeb3()
		const zeroXAddresses = getContractAddressesForChainOrThrow(Number(this.chainId))
		const contractAddress = zeroXAddresses.exchangeProxy
		const zeroXContract = new this.web3.eth.Contract(ZeroXAbi, contractAddress)

		this.limitOrderFilledListener(zeroXContract)
		this.orderCanceledListener(zeroXContract)
	}
	/**
	 * Listen 'LimitOrderFilled' event
	 */
	private limitOrderFilledListener(contract: Contract): void {
		contract.events
			.LimitOrderFilled()
			.on('data', (event: LimitOrderFilledEvent) => {
				const orderHash = event.returnValues.orderHash
				const taker = event.returnValues.taker
				const txHash = event.transactionHash
				this.fillLimitOrderByOrderHash(orderHash, txHash, taker)
					.then()
					.catch((e) => {
						this.logger.error(e.message)
					})
			})
			.on('changed', (event: LimitOrderFilledEvent) => {
				const orderHash = event.returnValues.orderHash
				this.resetLimitOrder(orderHash)
					.then()
					.catch((e) => {
						this.logger.log(e.message)
					})
			})
			.on('error', (error) => {
				this.logger.error(error.message)
			})
	}
	/**
	 * Listen 'OrderCancelled' event
	 */
	private orderCanceledListener(contract: Contract): void {
		contract.events
			.OrderCancelled()
			.on('data', (event: OrderCancelledEvent) => {
				const orderHash = event.returnValues.orderHash
				const txHash = event.transactionHash
				this.cancelLimitOrderByOrderHash(orderHash, txHash)
					.then()
					.catch((e) => {
						this.logger.error(e.message)
					})
			})
			.on('changed', (event: OrderCancelledEvent) => {
				const orderHash = event.returnValues.orderHash
				this.resetLimitOrder(orderHash)
					.then()
					.catch((e) => {
						this.logger.error(e.message)
					})
			})
			.on('error', (error) => {
				this.logger.error(error.message)
			})
	}

	async resetLimitOrder(orderHash: string): Promise<UpdateResult> {
		const order = await this.limitOrderRepo.findOne({ orderHash })
		if (order) {
			return this.limitOrderRepo.update(order.id, {
				status: LimitOrderStatus.Open,
				transactionHash: null,
				takerGasFeeAmount: null,
				takerGasFeeAmountUSD: null,
				takerAmountUSD: null,
				takerTokenFeeAmountUSD: null
			})
		}
	}

	async cancelLimitOrderByOrderHash(
		orderHash: string,
		transactionHash: string | null = null
	): Promise<UpdateResult> {
		const order = await this.limitOrderRepo.findOne({ orderHash })
		if (order) {
			const gasFee = await this.gasService.calculateTxGasFeeAmount(transactionHash, this.chainId)
			const gasFeeUSD = await this.chainConfigService.convertGasCostToUSD(gasFee, this.chainId)

			return this.limitOrderRepo.update(order.id, {
				transactionHash,
				status: LimitOrderStatus.Cancelled,
				takerGasFeeAmount: gasFee,
				takerGasFeeAmountUSD: gasFeeUSD
			})
		}

		throw new EntityNotFoundError(`Order with orderHash: ${orderHash} was not found`)
	}

	async fillLimitOrderByOrderHash(
		orderHash: string,
		transactionHash: string,
		taker: string
	): Promise<UpdateResult> {
		const order = await this.limitOrderRepo.findOne({ orderHash })
		if (order) {
			const gasCost = await this.gasService.calculateTxGasFeeAmount(transactionHash, this.chainId)
			const gasCostUSD = await this.chainConfigService.convertGasCostToUSD(gasCost, this.chainId)
			const [takerAmountUSD, takerTokenFeeAmountUSD] =
				await this.chainConfigService.convertDestAmountAndFeeToUSD(
					this.chainId,
					order.takerToken,
					order.takerAmount,
					order.takerTokenFeeAmount
				)

			return this.limitOrderRepo.update(order.id, {
				taker,
				transactionHash,
				status: LimitOrderStatus.Filled,
				takerGasFeeAmount: gasCost,
				takerGasFeeAmountUSD: gasCostUSD,
				takerTokenFeeAmountUSD,
				takerAmountUSD
			})
		}

		throw new EntityNotFoundError(`Order with orderHash: ${orderHash} was not found`)
	}
}
