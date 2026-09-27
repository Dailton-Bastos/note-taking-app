import { Module } from '@nestjs/common';
import { DrizzleConfigService } from './drizzle.config.service.js';

@Module({
  providers: [DrizzleConfigService],
  exports: [DrizzleConfigService],
})
export class DatabaseConfigModule {}
