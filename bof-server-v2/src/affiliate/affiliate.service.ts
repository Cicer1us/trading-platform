import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateAffiliateDto } from './dto/create-affiliate.dto'
import { CreateAffiliatedUserDto } from './dto/create-affiliated-user.dto'
import { Affiliate } from './entities/affiliate.entity'
import { AffiliatedUser, AFFILIATE_ID_LENGTH } from './entities/affiliated-user.entity'
import randomString from 'randomstring'
import { LimitOrder, LimitOrderStatus } from 'src/limit-order/entities/limit-order.entity'
import { Swap } from 'src/swap/entities/swap.entity'
import { SwapService } from 'src/swap/swap.service'
import { LimitOrderService } from 'src/limit-order/limit-order.service'
import { AffiliateStatsDto } from './dto/affiliate-stats.dto'
import { LeverageTradeService } from '../leverage-trade/leverage-trade.service'
import { FailedToCreateUserException } from './affiliate.exception'
import { StatsAffiliatedUsersDto } from './dto/stats-affiliated-users.dto'
import { Chain } from 'src/chain-config/chain-config.constants'

type AffiliateStats = Record<string, AffiliateStatsDto>
type AddressToAffId = Record<string, string>
@Injectable()
export class AffiliateService {
	constructor(
		@InjectRepository(Affiliate)
		private affiliateRepo: Repository<Affiliate>,
		@InjectRepository(AffiliatedUser)
		private affiliatedUserRepo: Repository<AffiliatedUser>,
		@InjectRepository(Swap)
		private swapRepo: Repository<Swap>,
		@InjectRepository(LimitOrder)
		private limitOrderRepo: Repository<LimitOrder>,
		private swapService: SwapService,
		private limitOrderService: LimitOrderService,
		private readonly leverageTradeService: LeverageTradeService
	) {}

	findAllAffiliates(): Promise<Affiliate[]> {
		return this.affiliateRepo.find({})
	}

	findAllAffiliatedUsers(): Promise<AffiliatedUser[]> {
		return this.affiliatedUserRepo.find({})
	}

	async createAffiliate(affiliateDto: CreateAffiliateDto): Promise<Affiliate> {
		const affiliate = new Affiliate()
		affiliate.id = randomString.generate({ length: AFFILIATE_ID_LENGTH, capitalization: 'uppercase' })

		affiliate.name = affiliateDto.name
		affiliateDto?.companyName && (affiliate.companyName = affiliateDto.companyName)
		affiliateDto?.phone && (affiliate.phone = affiliateDto.phone)
		affiliateDto?.email && (affiliate.email = affiliateDto.email)

		return this.affiliateRepo.save(affiliate)
	}

	async createUser(affiliatedUserDto: CreateAffiliatedUserDto): Promise<AffiliatedUser> {
		const userWasCreated = await this.getUserWasCreated(affiliatedUserDto.clientAddress)
		const userWasActive = await this.getUserWasActive(affiliatedUserDto.clientAddress)
		const affiliate = await this.affiliateRepo.findOne({ id: affiliatedUserDto.affiliateId })

		if (!userWasCreated && !userWasActive && affiliate) {
			const affiliatedUser = new AffiliatedUser()
			affiliatedUser.clientAddress = affiliatedUserDto.clientAddress
			affiliatedUser.affiliateId = affiliatedUserDto.affiliateId
			return this.affiliatedUserRepo.save(affiliatedUser)
		} else {
			const exceptionText = this.getExceptionText(userWasCreated, userWasActive, !!affiliate)
			throw new BadRequestException(exceptionText)
		}
	}

	getExceptionText(isCreated: boolean, isActive: boolean, isAffiliate: boolean): FailedToCreateUserException {
		if (isCreated) return FailedToCreateUserException.USER_IS_ALREADY_AFFILIATED
		if (isActive) return FailedToCreateUserException.USER_IS_ALREADY_ACTIVE
		if (!isAffiliate) return FailedToCreateUserException.WRONG_AFFILIATED_ID
		return FailedToCreateUserException.INTERNAL_ERROR
	}

	async getUserWasCreated(clientAddress: string): Promise<boolean> {
		const prefAffUser = await this.affiliatedUserRepo.findOne({ clientAddress })
		return !!prefAffUser
	}

	async getUserWasActive(clientAddress: string): Promise<boolean> {
		const swaps = await this.swapRepo.find({ initiator: clientAddress })
		if (swaps.length !== 0) {
			return true
		}

		const limitOrders = await this.limitOrderRepo.find({ maker: clientAddress })
		if (limitOrders.length !== 0) {
			return true
		}

		const dydxAuth = await this.leverageTradeService.userHaveTrades(clientAddress)
		return !!dydxAuth
	}

	async getAffiliateStats(query: StatsAffiliatedUsersDto): Promise<AffiliateStatsDto[]> {
		const affiliatedStats = await this.getAffiliateStatTemplate()
		const userAffIdMap = await this.getUserToAffiliateIdMap(query)

		if (Object.keys(userAffIdMap).length > 0) {
			await this.addSwapStat(affiliatedStats, query, userAffIdMap)
			await this.addLimitStat(affiliatedStats, query, userAffIdMap)
			await this.addLeverageStat(affiliatedStats, query, userAffIdMap)
			this.deleteAddressesDuplicate(affiliatedStats)
		}

		return Object.values(affiliatedStats)
	}

	deleteAddressesDuplicate(affiliateStat: AffiliateStats): AffiliateStats {
		for (const [affId, stat] of Object.entries(affiliateStat)) {
			affiliateStat[affId] = {
				...stat,
				userAddresses: Array.from(new Set(stat.userAddresses))
			}
		}
		return affiliateStat
	}

	async getUserToAffiliateIdMap(params: StatsAffiliatedUsersDto): Promise<AddressToAffId> {
		const users = await this.affiliatedUserRepo.find(
			params.clientAddress ? { clientAddress: params.clientAddress } : {}
		)
		const userToAffiliateId: AddressToAffId = {}
		users.forEach((u) => (userToAffiliateId[u.clientAddress.toLocaleLowerCase()] = u.affiliateId))
		return userToAffiliateId
	}

	/*
	 * TODO: create one interface for any statistic, to prevent such methods for every stat data
	 */
	async addSwapStat(
		affiliateStat: AffiliateStats,
		filters: StatsAffiliatedUsersDto,
		addToAffId: AddressToAffId
	): Promise<AffiliateStats> {
		const users = Object.keys(addToAffId)
		const swapStats = await this.swapService.getSwapUSDVolume({
			...filters,
			includeInitiators: true,
			initiators: users
		})

		for (const swap of swapStats) {
			const userAddress = swap.initiator.toLocaleLowerCase()
			const affId = addToAffId[userAddress]
			const prevStat = affiliateStat[affId].swapStat.find((stat) => stat.chainId === swap.chainId)
			const newStat = {
				chainId: swap.chainId,
				count: prevStat.count + swap.swapCount,
				feesUSD: prevStat.feesUSD + swap.feesInUSD,
				volumeUSD: prevStat.volumeUSD + swap.volumeInUSD
			}
			affiliateStat[affId] = {
				...affiliateStat[affId],
				userAddresses: [...affiliateStat[affId].userAddresses, userAddress],
				swapStat: affiliateStat[affId].swapStat.map((st) => (st.chainId === swap.chainId ? newStat : st))
			}
		}

		return affiliateStat
	}

	async addLimitStat(
		affiliateStat: AffiliateStats,
		filters: StatsAffiliatedUsersDto,
		addToAffId: AddressToAffId
	): Promise<AffiliateStats> {
		const users = Object.keys(addToAffId)
		const limitStats = await this.limitOrderService.getLimitOrderUSDVolume({
			...filters,
			includeMakers: true,
			makers: users,
			status: LimitOrderStatus.Filled
		})

		for (const limit of limitStats) {
			const userAddress = limit.maker.toLocaleLowerCase()
			const affId = addToAffId[userAddress]

			affiliateStat[affId] = {
				...affiliateStat[affId],
				userAddresses: [...affiliateStat[affId].userAddresses, userAddress],
				limitOrdersStat: {
					chainId: affiliateStat[affId].limitOrdersStat.chainId,
					count: affiliateStat[affId].limitOrdersStat.count + limit.orderCount,
					feesUSD: affiliateStat[affId].limitOrdersStat.feesUSD + limit.feesInUSD,
					volumeUSD: affiliateStat[affId].limitOrdersStat.volumeUSD + limit.volumeInUSD
				}
			}
		}

		return affiliateStat
	}

	async addLeverageStat(
		affiliateStat: AffiliateStats,
		filters: StatsAffiliatedUsersDto,
		addToAffId: AddressToAffId
	): Promise<AffiliateStats> {
		const users = Object.keys(addToAffId)
		const leverageStat = await this.leverageTradeService.getStatistic({
			...filters,
			includeUserAddress: true,
			userAddressArray: users
		})

		for (const leverage of leverageStat.usersStat) {
			const userAddress = leverage.userAddress.toLocaleLowerCase()
			const affId = addToAffId[userAddress]

			affiliateStat[affId] = {
				...affiliateStat[affId],
				userAddresses: [...affiliateStat[affId].userAddresses, userAddress],
				leverageStat: {
					chainId: affiliateStat[affId].leverageStat.chainId,
					count: affiliateStat[affId].leverageStat.count + leverage.tradesCount,
					feesUSD: affiliateStat[affId].leverageStat.feesUSD + leverage.totalFee,
					volumeUSD: affiliateStat[affId].leverageStat.volumeUSD + leverage.totalVolume
				}
			}
		}

		return affiliateStat
	}

	async getAffiliateStatTemplate(): Promise<Record<string, AffiliateStatsDto>> {
		const affiliates = await this.affiliateRepo.find({})
		const chains = Object.keys(Chain).filter((chain) => !isNaN(Number(chain)))
		const stats: Record<string, AffiliateStatsDto> = {}
		const statTemplate = {
			count: 0,
			feesUSD: 0,
			volumeUSD: 0,
			chainId: Chain.MAINNET
		}

		for (const affiliate of affiliates) {
			stats[affiliate.id] = {
				userAddresses: [],
				id: affiliate.id,
				companyName: affiliate.companyName,
				swapStat: chains.map((chain) => ({ ...statTemplate, chainId: Number(chain) })),
				limitOrdersStat: { ...statTemplate },
				leverageStat: { ...statTemplate }
			}
		}

		return stats
	}
}
