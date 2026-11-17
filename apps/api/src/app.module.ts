import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from '@nestjs/drizzle';
import { AuthenticationModule } from '@nestjs/authentication';
import { FileTemplateEngine, MailModule, SmtpTransport } from '@nestjs/mail';
import { Environment } from '@repo/schemas';
import { join } from 'node:path';
import { validate } from './env/env.validation.js';
import { EnvModule } from './env/env.module.js';
import { EnvService } from './env/env.service.js';
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
    MailModule.forRootAsync({
      imports: [EnvModule],
      useFactory: (envService: EnvService) => ({
        transport: new SmtpTransport({
          url: envService.get('SMTP_URL'),
          startTls:
            envService.get('NODE_ENV') === Environment.Production ? 'required' : 'opportunistic',
          pool: true,
        }),
        templates: new FileTemplateEngine({
          dir: join(import.meta.dirname, 'mail/templates'),
          layout: 'layout',
          cache: envService.get('NODE_ENV') === Environment.Production,
        }),
        from: envService.get('MAIL_FROM'),
      }),
      inject: [EnvService],
    }),
    AuthenticationModule.forRootAsync({
      isGlobal: true,
      imports: [EnvModule],
      useFactory: (envService: EnvService) => ({
        session: {
          absoluteTtl: '7d',
          idleTtl: '1d',
          cookieName: '__Host-sid',
        },
        emailVerification: { url: `${envService.get('APP_URL')}/verify-email` },
      }),
      inject: [EnvService],
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
