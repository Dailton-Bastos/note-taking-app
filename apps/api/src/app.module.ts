import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env/env.validation.js';
import { EnvModule } from './env/env.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    EnvModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
