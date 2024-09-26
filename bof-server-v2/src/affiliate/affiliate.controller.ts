import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { ApiResponse, ApiBody, ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AffiliateService } from './affiliate.service'
import { AffiliateStatsDto } from './dto/affiliate-stats.dto'
import { CreateAffiliateDto } from './dto/create-affiliate.dto'
import { CreateAffiliatedUserDto } from './dto/create-affiliated-user.dto'
import { StatsAffiliatedUsersDto } from './dto/stats-affiliated-users.dto'
import { Affiliate } from './entities/affiliate.entity'
import { AffiliatedUser } from './entities/affiliated-user.entity'
import { JwtAuthGuard } from '../admin-auth/guards/jwt-auth.guard'

@Controller('affiliate')
@ApiTags('Affiliate')
export class AffiliateController {
	constructor(private affiliateService: AffiliateService) {}

	@Get()
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('secret_token')
	@ApiResponse({ status: 200, type: Affiliate, isArray: true })
	getAllAffiliates(): Promise<Affiliate[]> {
		return this.affiliateService.findAllAffiliates()
	}

	@Get('user')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('secret_token')
	@ApiResponse({ status: 200, type: AffiliatedUser, isArray: true })
	getAllAffiliatedUsers(): Promise<AffiliatedUser[]> {
		return this.affiliateService.findAllAffiliatedUsers()
	}

	@Post()
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('secret_token')
	@ApiOperation({
		summary: 'Use affiliate id for referral link',
		description: 'Link example: https://bitoftrade.com/?affiliate_id='
	})
	@ApiResponse({ status: 200, type: Affiliate })
	@ApiBody({ type: CreateAffiliateDto })
	createAffiliate(@Body() affiliateDto: CreateAffiliateDto): Promise<Affiliate> {
		return this.affiliateService.createAffiliate(affiliateDto)
	}

	@Post('user')
	@ApiResponse({ status: 200, type: AffiliatedUser })
	@ApiBody({ type: CreateAffiliatedUserDto })
	createAffiliatedUser(@Body() affiliatedUserDto: CreateAffiliatedUserDto): Promise<AffiliatedUser> {
		return this.affiliateService.createUser(affiliatedUserDto)
	}

	@Get('stats')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('secret_token')
	@ApiResponse({ status: 200, type: AffiliateStatsDto, isArray: true })
	getAffiliateStats(@Query() query: StatsAffiliatedUsersDto): Promise<AffiliateStatsDto[]> {
		return this.affiliateService.getAffiliateStats(query)
	}
}
