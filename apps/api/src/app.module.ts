import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from '@nestjs/drizzle';
import { AuthenticationModule } from '@nestjs/authentication';
import { validate } from './env/env.validation.js';
import { EnvModule } from './env/env.module.js';
import { DatabaseConfigModule } from './database/database.config.module.js';
import { DrizzleConfigService } from './database/drizzle.config.service.js';
import { HealthModule } from './health/health.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    DrizzleModule.forRootAsync({
      imports: [DatabaseConfigModule],
      useExisting: DrizzleConfigService,
    }),
    AuthenticationModule.forRoot({
      isGlobal: true,
    }),
    EnvModule,
    HealthModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
