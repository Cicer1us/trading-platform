import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common'
import { LeverageTradeService } from './leverage-trade.service'
import { CreateLeverageTradeDto } from './dto/create-leverage-trade.dto'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { LeverageTrade } from './entities/leverage-trade.entity'
import { LeverageTradeSearchParamsDto } from './dto/leverage-trade-search-params.dto'
import { LeverageStatisticResponseDto } from './dto/leverage-statistic-response.dto'
import { UsersCountDto } from './dto/users-count.dto'
import { LeverageDynamicStatsSearchDto } from './dto/leverage-dynamic-stats-search.dto'
import { JwtAuthGuard } from '../admin-auth/guards/jwt-auth.guard'

@ApiTags('Leverage trades')
@Controller('leverage-trade')
export class LeverageTradeController {
	constructor(private readonly leverageTradesService: LeverageTradeService) {}

	@Post()
	create(@Body() createLeverageTradeDto: CreateLeverageTradeDto): Promise<LeverageTrade> {
		return this.leverageTradesService.create(createLeverageTradeDto)
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('secret_token')
	@Get('stats')
	@ApiResponse({ status: 200, type: LeverageStatisticResponseDto })
	getStats(@Query() query: LeverageTradeSearchParamsDto): Promise<LeverageStatisticResponseDto> {
		return this.leverageTradesService.getStatistic(query)
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('secret_token')
	@Get('dynamic-stats')
	@ApiResponse({ status: 200, type: LeverageStatisticResponseDto })
	getDynamicStats(@Query() query: LeverageDynamicStatsSearchDto): Promise<Record<string, unknown>[]> {
		return this.leverageTradesService.getDynamicData(query)
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('secret_token')
	@Get('unique-users')
	@ApiResponse({ status: 200, type: UsersCountDto })
	countUniqueUsers(@Query() query: LeverageTradeSearchParamsDto): Promise<UsersCountDto> {
		return this.leverageTradesService.getUniqueUsersCount(query)
	}
}
