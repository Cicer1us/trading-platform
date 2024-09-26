import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import SwapSettingsDto from './dto/swap-settings.dto'
import { SearchSwapsDto } from './dto/search-swap.dto'
import { Swap } from './entities/swap.entity'
import { SwapService } from './swap.service'
import { StatsSwapsDto } from './dto/stats-swap.dto'
import { TotalSwapsStat } from './interfaces/swap-volume.interface'
import { UsersCountDto } from '../leverage-trade/dto/users-count.dto'
import { SearchTradedTokensDto } from './dto/search-traded-tokens.dto'
import { SwapDynamicStatsSearchDto } from './dto/swap-dynamic-stats-search.dto'
import { Token } from 'src/chain-config/chain-config.interface'
import { JwtAuthGuard } from '../admin-auth/guards/jwt-auth.guard'

@Controller('swap')
@ApiTags('Swap')
export class SwapController {
	constructor(private swapService: SwapService) {}

	@Get()
	@ApiResponse({ status: 200, type: Swap, isArray: true })
	getAll(@Query() query: SearchSwapsDto): Promise<Swap[]> {
		return this.swapService.findSwaps(query)
	}

	@Get('settings')
	@ApiResponse({ status: 200, type: SwapSettingsDto })
	getSettings(): SwapSettingsDto {
		return this.swapService.getSwapSettings()
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('secret_token')
	@Get('stats')
	@ApiResponse({ status: 200, type: StatsSwapsDto })
	getStats(@Query() query: StatsSwapsDto): Promise<TotalSwapsStat> {
		return this.swapService.getTotalSwapsStat(query)
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('secret_token')
	@Get('dynamic-stats')
	@ApiResponse({ status: 200 })
	getDynamicStats(@Query() query: SwapDynamicStatsSearchDto): Promise<Record<string, unknown>[]> {
		return this.swapService.getDynamicData(query)
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('secret_token')
	@Get('unique-users')
	@ApiResponse({ status: 200, type: StatsSwapsDto })
	getUnique(@Query() query: StatsSwapsDto): Promise<UsersCountDto> {
		return this.swapService.findUniqueAddresses(query)
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('secret_token')
	@Get('traded-tokens')
	@ApiResponse({ status: 200, isArray: true, type: Token })
	getTradedTokens(@Query() query: SearchTradedTokensDto): Promise<Token[]> {
		return this.swapService.getTradedTokens(query)
	}
}
