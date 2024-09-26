import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common'
import { LeverageTransferService } from './leverage-transfer.service'
import { CreateLeverageTransferDto } from './dto/create-leverage-transfer.dto'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { LeverageTransfer } from './entities/leverage-transfer.entity'
import { LeverageTransferSearchParams } from './dto/leverage-transfer-search-params'
import { LeverageTransferResponseDto } from './dto/leverage-transfer-response.dto'
import { JwtAuthGuard } from '../admin-auth/guards/jwt-auth.guard'

@ApiTags('Leverage transfer')
@Controller('leverage-transfer')
export class LeverageTransferController {
	constructor(private readonly leverageTransferService: LeverageTransferService) {}

	@Post()
	create(@Body() createLeverageTransferDto: CreateLeverageTransferDto): Promise<LeverageTransfer> {
		return this.leverageTransferService.create(createLeverageTransferDto)
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('secret_token')
	@Get('stats')
	@ApiResponse({ status: 200, type: LeverageTransferResponseDto })
	getStats(@Query() query: LeverageTransferSearchParams): Promise<LeverageTransferResponseDto> {
		return this.leverageTransferService.getStatistic(query)
	}
}
