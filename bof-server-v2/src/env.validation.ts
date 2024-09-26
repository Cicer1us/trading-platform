import { plainToInstance } from 'class-transformer'
import { IsNumber, IsString, validateSync } from 'class-validator'

class EnvironmentVariables {
	/** MSSQL **/
	@IsString()
	SA_PASSWORD: string

	@IsString()
	MSSQL_HOST: string

	@IsString()
	MSSQL_USER: string

	@IsString()
	MSSQL_DATABASE: string

	@IsNumber()
	MSSQL_PORT: number

	@IsString()
	PARASWAP_URL: string

	@IsString()
	PARTNER_ADDRESS: string

	@IsNumber()
	PARTNER_FEE_BPS: number

	@IsNumber()
	LIMIT_ORDER_FEE_PERCENTAGE: number

	@IsString()
	SENTRY_DNS_URL: string

	@IsString()
	INFURA_ID: string

	@IsString()
	MAINNET_EXPLORER_API_KEY

	@IsString()
	POLYGON_EXPLORER_API_KEY

	@IsString()
	FANTOM_EXPLORER_API_KEY

	@IsString()
	BSC_EXPLORER_API_KEY

	@IsString()
	AVALANCHE_EXPLORER_API_KEY

	@IsString()
	ARBITRUM_EXPLORER_API_KEY

	@IsString()
	OPTIMISM_EXPLORER_API_KEY

	@IsString()
	AUTHENTICATOR_APP_SECRET: string

	@IsString()
	JWT_SECRET: string

	@IsString()
	COINGECKO_API_KEY: string
}

export function validate(config: Record<string, unknown>): EnvironmentVariables {
	const validatedConfig = plainToInstance(EnvironmentVariables, config, {
		enableImplicitConversion: true
	})
	const errors = validateSync(validatedConfig, { skipMissingProperties: false })

	if (errors.length > 0) {
		throw new Error(errors.toString())
	}
	return validatedConfig
}
