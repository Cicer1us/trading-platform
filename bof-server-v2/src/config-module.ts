import { ConfigModule } from '@nestjs/config'
import { validate } from './env.validation'

export default ConfigModule.forRoot({
	validate: validate,
	validationSchema: {},
	isGlobal: true,
	envFilePath: !process.env.NODE_ENV ? '.env' : `.env.${process.env.NODE_ENV}`
})
