import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EnvService } from '../env.service.js';
import type { EnvironmentApi } from '@repo/schemas';

describe('EnvService', () => {
  let service: EnvService;
  let configService: ConfigService<EnvironmentApi, true>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnvService, ConfigService],
    }).compile();

    service = module.get<EnvService>(EnvService);
    configService = module.get<ConfigService<EnvironmentApi, true>>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(configService).toBeDefined();
  });

  it('should return the value of the environment variable', () => {
    const key = 'NODE_ENV';
    const value = 'test';

    const spy = vi.spyOn(configService, 'get');
    spy.mockReturnValue(value);

    expect(service.get(key)).toBe(value);
    expect(spy).toHaveBeenCalledWith(key, { infer: true });
  });

  it('should return undefined if the environment variable is not defined', () => {
    const key = 'UNDEFINED_ENV_VAR' as keyof EnvironmentApi;

    const spy = vi.spyOn(configService, 'get');
    spy.mockReturnValue(undefined);

    expect(service.get(key)).toBeUndefined();
    expect(spy).toHaveBeenCalledWith(key, { infer: true });
  });
});
