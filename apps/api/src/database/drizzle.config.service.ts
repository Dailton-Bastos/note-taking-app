import { Injectable } from '@nestjs/common';
import { type DrizzleModuleFactoryOptions, DrizzleOptionsFactory } from '@nestjs/drizzle';
import { Environment } from '@repo/schemas';
import { drizzle } from 'drizzle-orm/node-postgres';
import { EnvService } from '../env/env.service.js';

@Injectable()
export class DrizzleConfigService implements DrizzleOptionsFactory {
  constructor(private readonly envService: EnvService) {}

  createDrizzleOptions(): DrizzleModuleFactoryOptions {
    return {
      drizzle,
      connection: this.envService.get('POSTGRES_URL'),
      logger: this.envService.get('NODE_ENV') === Environment.Development,
    };
  }
}
