import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { PrismaModule } from '@/prisma/prisma.module'

import { IS_DEV_ENV } from '@/shared/lib'

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true
		}),
		PrismaModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
