import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'

import IORedis from 'ioredis'
import RedisStore from 'connect-redis'

import * as cookieParser from 'cookie-parser'
import * as session from 'express-session'

import { AppModule } from '@/app/app.module'

import { DEFAULT_APPLICATION_PORT, StringValue, parseTimeToMs, parseToBoolean } from '@/shared/lib'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const config = app.get(ConfigService)
	//const redis = new IORedis(config.getOrThrow<string>('REDIS_URI'))

	const redis = new IORedis({
		host: config.getOrThrow<string>('REDIS_HOST'),
		port: parseInt(config.getOrThrow<string>('REDIS_PORT'), 10),
		password: config.getOrThrow<string>('REDIS_PASSWORD')
	})

	app.use(cookieParser(config.getOrThrow<string>('COOKIE_SECRET')))

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true
		})
	)

	app.use(
		session({
			secret: config.getOrThrow<string>('ALLOWED_ORIGIN'),
			name: config.getOrThrow<string>('SESSION_NAME'),
			resave: true,
			saveUninitialized: false,
			cookie: {
				domain: config.getOrThrow<string>('SESSION_DOMAIN'),
				maxAge: parseTimeToMs(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
				httpOnly: parseToBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
				secure: parseToBoolean(config.getOrThrow<string>('SESSION_SECURE')),
				sameSite: 'lax'
			},
			store: new RedisStore({ client: redis, prefix: config.getOrThrow<string>('SESSION_FOLDER') })
		})
	)

	app.enableCors({
		origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
		credentials: true,
		exposedHeaders: ['set-cookie']
	})

	await app.listen(config.getOrThrow<string>('APPLICATION_PORT') || DEFAULT_APPLICATION_PORT)
}
bootstrap()
