import { Injectable } from '@nestjs/common'
import { CreateLeverageTradeDto } from './dto/create-leverage-trade.dto'
import { Repository, SelectQueryBuilder } from 'typeorm'
import { LeverageTrade } from './entities/leverage-trade.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { LeverageTradeSearchParamsDto } from './dto/leverage-trade-search-params.dto'
import { UsersCountDto } from './dto/users-count.dto'
import { LeverageStatistic, LeverageStatisticResponseDto } from './dto/leverage-statistic-response.dto'
import dayjs from 'dayjs'
import { LeverageDynamicStatsSearchDto } from './dto/leverage-dynamic-stats-search.dto'

@Injectable()
export class LeverageTradeService {
	constructor(
		@InjectRepository(LeverageTrade)
		private readonly leverageTradesRepository: Repository<LeverageTrade>
	) {}

	create(createLeverageTradeDto: CreateLeverageTradeDto): Promise<LeverageTrade> {
		return this.leverageTradesRepository.save(createLeverageTradeDto)
	}

	async userHaveTrades(address: string): Promise<boolean> {
		const res = await this.leverageTradesRepository.findOne({ userAddress: address })
		return !!res
	}

	async getStatistic(searchDto: LeverageTradeSearchParamsDto): Promise<LeverageStatisticResponseDto> {
		const query = this.applyDefaultLeverageTradeSearchParams(searchDto)
			.select('sum(lt.fee) as totalFee')
			.addSelect('sum(lt.size * price) as totalVolume')
			.addSelect('count(lt.id) as tradesCount')

		if (searchDto.includeUserAddress) {
			query.addSelect('lt.userAddress as userAddress').groupBy('lt.userAddress')
		}

		const statsDataResponse: LeverageStatistic[] = await query.getRawMany()

		const volumes = await query
			.select('lt.market as market')
			.addSelect('SUM(lt.fee) as fee')
			.addSelect('SUM(lt.size * lt.price) as volume')
			.addSelect('COUNT(*) as tradesCount')
			.groupBy('lt.market')
			.getRawMany()

		const totalStatsTemplate = { totalFee: 0, totalVolume: 0, tradesCount: 0 }
		const totalStats: LeverageStatistic = statsDataResponse.reduce(
			(a, b) => ({
				totalFee: a.totalFee + b.totalFee,
				totalVolume: a.totalVolume + b.totalVolume,
				tradesCount: a.tradesCount + b.tradesCount
			}),
			totalStatsTemplate
		)

		return {
			...totalStats,
			...(searchDto ? { usersStat: statsDataResponse } : {}),
			volumes: volumes
		}
	}

	async getDynamicData(params: LeverageDynamicStatsSearchDto): Promise<Record<string, unknown>[]> {
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
				this.applyDefaultLeverageTradeSearchParams({
					dateFrom,
					dateTo
				})
					.select('sum(lt.fee) as totalFee')
					.addSelect('sum(lt.size * price) as totalVolume')
					.addSelect('count(lt.id) as tradesCount')
					.getRawOne()
			)
		}

		const results = await Promise.all(promises)
		for (let i = 0; i < numberOfSteps; i++) {
			results[i].dateFrom = ranges[i].dateFrom
			results[i].dateTo = ranges[i].dateTo
		}

		return results
	}

	applyDefaultLeverageTradeSearchParams(
		params: LeverageTradeSearchParamsDto
	): SelectQueryBuilder<LeverageTrade> {
		const query = this.leverageTradesRepository.createQueryBuilder('lt')

		if (params.dateFrom) {
			query.andWhere('lt.createdAt >= :dateFrom', { dateFrom: params.dateFrom })
		}
		if (params.dateTo) {
			query.andWhere('lt.createdAt <= :dateTo', { dateTo: params.dateTo })
		}
		if (params.market) {
			query.andWhere('lt.market = :market', { market: params.market })
		}
		if (params.userAddress) {
			query.andWhere('lt.userAddress = :userAddress', { userAddress: params.userAddress })
		}
		if (params.userAddressArray) {
			query.andWhere('lt.userAddress IN (:...userAddressArray)', {
				userAddressArray: params.userAddressArray
			})
		}

		return query
	}

	async getUniqueUsersCount(searchDto: LeverageTradeSearchParamsDto): Promise<UsersCountDto> {
		const query = this.applyDefaultLeverageTradeSearchParams(searchDto)
		const countResult = await query.select('count(distinct lt.userAddress) as uniqueUsersCount').getRawMany()
		const userListResult = await query
			.select('lt.userAddress as address')
			.groupBy('lt.userAddress')
			.getRawMany()

		return {
			uniqueUsersCount: countResult[0].uniqueUsersCount,
			users: userListResult
		}
	}
}
