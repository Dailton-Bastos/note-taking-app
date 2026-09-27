import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import type { EnvironmentApi } from '@repo/schemas';
import { describe, it, expect, beforeEach } from 'vitest';
import { DrizzleConfigService } from '../drizzle.config.service.js';
import { EnvService } from '../../env/env.service.js';

describe('DrizzleConfigService', () => {
  let configService: ConfigService<EnvironmentApi, true>;
  let envService: EnvService;
  let drizzleConfigService: DrizzleConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, EnvService, DrizzleConfigService],
    }).compile();

    configService = module.get<ConfigService<EnvironmentApi, true>>(ConfigService);
    envService = module.get<EnvService>(EnvService);
    drizzleConfigService = module.get<DrizzleConfigService>(DrizzleConfigService);
  });

  it('should be defined', () => {
    expect(configService).toBeDefined();
    expect(envService).toBeDefined();
    expect(drizzleConfigService).toBeDefined();
  });

  describe('createDrizzleOptions', () => {
    it('should create drizzle options correctly', () => {
      const options = drizzleConfigService.createDrizzleOptions();
      expect(options).toBeDefined();
      expect(options).toHaveProperty('drizzle');
      expect(options).toHaveProperty('connection');
      expect(options).toHaveProperty('logger');
      expect(options.connection).toBe(envService.get('POSTGRES_URL'));
    });
  });
});
