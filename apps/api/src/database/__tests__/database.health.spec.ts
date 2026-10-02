import { Test, TestingModule } from '@nestjs/testing';
import { HealthIndicatorService } from '@nestjs/terminus';
import { getDrizzleToken } from '@nestjs/drizzle';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DatabaseHealthIndicator } from '../database.health.js';
import type { Database } from '../database.js';

describe('DatabaseHealthIndicator', () => {
  let indicator: DatabaseHealthIndicator;
  let healthIndicatorService: HealthIndicatorService;
  let database: Database;

  let mockDb: {
    execute: ReturnType<typeof vi.fn>;
  };

  let mockHealthIndicatorService: {
    check: ReturnType<typeof vi.fn>;
    attempt: ReturnType<typeof vi.fn>;
    withTimeout: ReturnType<typeof vi.fn>;
    cacheFor: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockHealthIndicatorService = {
      check: vi.fn().mockReturnThis(),
      attempt: vi.fn().mockReturnThis(),
      withTimeout: vi.fn().mockReturnThis(),
      cacheFor: vi.fn().mockReturnValue(Promise.resolve({ status: 'up' })), // Final return
    };

    mockDb = {
      execute: vi.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseHealthIndicator,
        {
          provide: HealthIndicatorService,
          useValue: mockHealthIndicatorService,
        },
        {
          provide: getDrizzleToken(),
          useValue: mockDb,
        },
      ],
    }).compile();

    indicator = module.get<DatabaseHealthIndicator>(DatabaseHealthIndicator);
    healthIndicatorService = module.get<HealthIndicatorService>(HealthIndicatorService);
    database = module.get(getDrizzleToken());
  });

  it('should be defined', () => {
    expect(indicator).toBeDefined();
    expect(healthIndicatorService).toBeDefined();
    expect(database).toBeDefined();
  });

  describe('pingCheck', () => {
    it('should return a successful health check', async () => {
      const key = 'database';

      const result = await indicator.pingCheck(key);

      expect(result).toBeDefined();
      expect(mockHealthIndicatorService.check).toHaveBeenCalledWith(key);
      expect(mockHealthIndicatorService.attempt).toHaveBeenCalledWith(expect.any(Function));
      expect(mockHealthIndicatorService.withTimeout).toHaveBeenCalledWith(expect.any(Number));
      expect(mockHealthIndicatorService.cacheFor).toHaveBeenCalledWith(expect.any(Number));

      // Test the async callback inside .attempt()
      const attemptCallback = mockHealthIndicatorService.attempt.mock.calls[0][0];
      await attemptCallback();
      expect(mockDb.execute).toHaveBeenCalled();
    });

    it('should handle database execution failures inside the attempt callback', async () => {
      const key = 'database';

      const dbError = new Error('Database connection lost');
      mockDb.execute.mockRejectedValueOnce(dbError);

      await indicator.pingCheck(key);

      const attemptCallback = mockHealthIndicatorService.attempt.mock.calls[0][0];

      await expect(attemptCallback()).rejects.toThrow('Database connection lost');

      expect(mockDb.execute).toHaveBeenCalled();
    });
  });
});
