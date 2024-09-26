import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateLimitOrderDto } from './dto/create-limit-order.dto'
import LimitOrderSettingsDto from './dto/limit-order-settings.dto'
import { SearchLimitOrderDto } from './dto/search-limit-order.dto'
import { StatsLimitOrderDto } from './dto/stats-limit-order.dto'
import { LimitOrder } from './entities/limit-order.entity'
import { TotalLimitOrdersStat } from './interfaces/limit-order-volume.interface'
import { LimitOrderService } from './limit-order.service'
import { UsersCountDto } from '../leverage-trade/dto/users-count.dto'
import { SearchTradedLimitTokensDto } from './dto/search-traded-tokens.dto'
import { LimitDynamicStatsSearch } from './dto/limit-dynamic-stats-search.dto'
import { Token } from 'src/chain-config/chain-config.interface'
import { JwtAuthGuard } from '../admin-auth/guards/jwt-auth.guard'

@ApiTags('Limit order')
@Controller('limit-order')
@ApiTags('Limit Order')
export class LimitOrderController {
	constructor(private limitOrderService: LimitOrderService) {}

	@Get()
	@ApiResponse({ status: 200, type: LimitOrder, isArray: true })
	getAll(@Query() query: SearchLimitOrderDto): Promise<LimitOrder[]> {
		return this.limitOrderService.findAllByAddresses(query.address)
	}

	@Get('settings')
	@ApiResponse({ status: 200, type: LimitOrderSettingsDto })
	getOrderSettings(): LimitOrderSettingsDto {
		return this.limitOrderService.getOrderSettings()
	}

	@Post()
	@ApiResponse({ status: 200, type: LimitOrder })
	@ApiBody({ type: CreateLimitOrderDto })
	createSwapTxObject(@Body() orderDto: CreateLimitOrderDto): Promise<LimitOrder> {
		return this.limitOrderService.create(orderDto)
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('secret_token')
	@Get('stats')
	@ApiResponse({ status: 200, type: StatsLimitOrderDto })
	getStats(@Query() query: StatsLimitOrderDto): Promise<TotalLimitOrdersStat> {
		return this.limitOrderService.getTotalLimitOrdersStat(query)
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('secret_token')
	@Get('dynamic-stats')
	@ApiResponse({ status: 200 })
	getDynamicStats(@Query() query: LimitDynamicStatsSearch): Promise<Record<string, unknown>[]> {
		return this.limitOrderService.getDynamicData(query)
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('secret_token')
	@Get('unique-users')
	@ApiResponse({ status: 200, type: UsersCountDto })
	getUnique(@Query() query: StatsLimitOrderDto): Promise<UsersCountDto> {
		return this.limitOrderService.findUniqueAddresses(query)
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('secret_token')
	@Get('traded-tokens')
	@ApiResponse({ status: 200, type: Token, isArray: true })
	getTradedTokens(@Query() query: SearchTradedLimitTokensDto): Promise<Token[]> {
		return this.limitOrderService.getTradedTokens(query)
	}
}
