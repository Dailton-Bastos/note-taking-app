import { Test, TestingModule } from '@nestjs/testing';
import { getDrizzleToken } from '@nestjs/drizzle';
import type { SessionRecord } from '@nestjs/authentication';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SessionsRepository } from '../sessions.repository.js';
import { sessions } from '../../database/schema/index.js';
import type { Database } from '../../database/database';

describe('SessionsRepository', () => {
  let repository: SessionsRepository;
  let database: Database;

  let mockDb: {
    transaction: ReturnType<typeof vi.fn>;
    select: ReturnType<typeof vi.fn>;
    from: ReturnType<typeof vi.fn>;
    limit: ReturnType<typeof vi.fn>;
    insert: ReturnType<typeof vi.fn>;
    values: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    where: ReturnType<typeof vi.fn>;
    returning: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockDb = {
      transaction: vi
        .fn()
        .mockImplementation(async (callback: (tx: typeof mockDb) => Promise<unknown>) => {
          return callback(mockDb);
        }),
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      returning: vi.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsRepository,
        {
          provide: getDrizzleToken(),
          useValue: mockDb,
        },
      ],
    }).compile();

    repository = module.get<SessionsRepository>(SessionsRepository);
    database = module.get<Database>(getDrizzleToken());
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(database).toBeDefined();
  });

  describe('create', () => {
    it('should create a session', async () => {
      // Arrange
      const session: SessionRecord = {
        id: 'ZM3uKwwpsbR00Tov5hGaLnvrgnqsJtzapb8jrjY-m08',
        userId: '1',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour from now
        lastActiveAt: new Date(),
        createdAt: new Date(),
      };

      // Act
      await repository.create(session);

      // Assert
      expect(mockDb.transaction).toHaveBeenCalledTimes(1);
      expect(mockDb.insert).toHaveBeenCalledWith(sessions);
      expect(mockDb.values).toHaveBeenCalledWith({
        ...session,
        userId: Number(session.userId),
      });
      expect(mockDb.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should find a session by id', async () => {
      const session: SessionRecord = {
        id: 'ZM3uKwwpsbR00Tov5hGaLnvrgnqsJtzapb8jrjY-m08',
        userId: '1',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour from now
        lastActiveAt: new Date(),
        createdAt: new Date(),
      };

      mockDb.limit = vi.fn().mockResolvedValue([session]);

      const result = await repository.findById(session.id);

      expect(result).toBeDefined();
      expect(result?.id).toBe(session.id);
      expect(result?.userId).toBe(String(session.userId));
    });

    it('should return undefined if session is not found', async () => {
      mockDb.limit = vi.fn().mockResolvedValue([]);

      const result = await repository.findById('non-existent-id');

      expect(result).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('should delete a session by id', async () => {
      const sessionId = 'ZM3uKwwpsbR00Tov5hGaLnvrgnqsJtzapb8jrjY-m08';

      await repository.delete(sessionId);

      expect(mockDb.delete).toHaveBeenCalledWith(sessions);
      expect(mockDb.where).toHaveBeenCalledTimes(1);
      expect(mockDb.returning).toHaveBeenCalledTimes(1);
    });
  });
});
