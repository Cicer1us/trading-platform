import { INestApplication, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { createProxyMiddleware } from 'http-proxy-middleware'

const initProxy = (app: INestApplication): void => {
	app.use(
		'/moralis',
		createProxyMiddleware({
			target: 'https://deep-index.moralis.io/',
			changeOrigin: true,
			pathRewrite: {
				[`^/moralis`]: ''
			},
			headers: {
				'X-API-KEY': process.env.MORALIS_API_KEY
			}
		})
	)
}

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule)
	const port = process.env.PORT || 3000
	app.enableCors()
	initProxy(app)

	app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

	const authOptions = new DocumentBuilder()
		.setTitle('Bit Of Trade')
		.setDescription('# About\nBasic description\n')
		.addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'secret_token')
		.build()

	const document = SwaggerModule.createDocument(app, authOptions)

	await SwaggerModule.setup('/', app, document)
	await app.listen(port)
	console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
