import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  type HealthCheckResult,
  HealthCheckService,
  DiskHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { HealthController } from '../health.controller.js';
import { DatabaseHealthIndicator } from '../../database/database.health.js';

describe('HealthController', () => {
  let controller: HealthController;

  const mockHealthCheckService = {
    check: vi.fn(),
  };

  const mockDiskHealthIndicator = {
    checkStorage: vi.fn(),
  };

  const mockMemoryHealthIndicator = {
    checkRSS: vi.fn(),
    checkHeap: vi.fn(),
  };

  const mockDatabaseHealthIndicator = {
    pingCheck: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: mockHealthCheckService,
        },
        {
          provide: DiskHealthIndicator,
          useValue: mockDiskHealthIndicator,
        },
        {
          provide: MemoryHealthIndicator,
          useValue: mockMemoryHealthIndicator,
        },
        {
          provide: DatabaseHealthIndicator,
          useValue: mockDatabaseHealthIndicator,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('should call HealthCheckService.check with the correct indicators', async () => {
      const expectedResult = { status: 'ok' } as HealthCheckResult;
      mockHealthCheckService.check.mockResolvedValue(expectedResult);

      const result = await controller.check();

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
      expect(mockHealthCheckService.check).toHaveBeenCalledTimes(1);

      const registeredIndicators = mockHealthCheckService.check.mock.calls[0][0];

      expect(registeredIndicators).toHaveLength(4);
      expect(registeredIndicators).toEqual([
        expect.any(Function),
        expect.any(Function),
        expect.any(Function),
        expect.any(Function),
      ]);

      await Promise.all(registeredIndicators.map((indicator: () => Promise<any>) => indicator()));

      expect(mockDiskHealthIndicator.checkStorage).toHaveBeenCalledWith('storage', {
        path: '/',
        threshold: 250 * 1024 * 1024 * 1024,
      });

      expect(mockMemoryHealthIndicator.checkHeap).toHaveBeenCalledWith(
        'memory_heap',
        150 * 1024 * 1024,
      );

      expect(mockMemoryHealthIndicator.checkRSS).toHaveBeenCalledWith(
        'memory_rss',
        300 * 1024 * 1024,
      );

      expect(mockDatabaseHealthIndicator.pingCheck).toHaveBeenCalledWith('database');
    });
  });
});
