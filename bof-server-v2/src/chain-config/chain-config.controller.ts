import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Token } from './chain-config.interface'
import { ChainConfigService } from './chain-config.service'

@Controller('chain-config')
@ApiTags('Chain Config')
export class ChainConfigController {
	constructor(private tokenService: ChainConfigService) {}

	@Get()
	getAll(): Record<number, Token> {
		return this.tokenService.getTokens()
	}
}
