import { Test, TestingModule } from '@nestjs/testing';
import { getDrizzleToken } from '@nestjs/drizzle';
import type { EmailTokenRecord, EmailTokenPurpose } from '@nestjs/authentication';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { eq, and } from 'drizzle-orm';
import { EmailTokenRepository } from '../email-token.repository.js';
import { trim } from '../../database/helpers/trim.helper.js';
import { withoutNulls } from '../../database/helpers/without-nulls.helper.js';
import { emailTokens } from '../../database/schema/index.js';
import type { Database } from '../../database/database';

vi.mock('../../database/helpers/trim.helper.js', () => ({
  trim: vi.fn(),
}));

vi.mock('../../database/helpers/without-nulls.helper.js', () => ({
  withoutNulls: vi.fn((x) => x),
}));

describe('EmailTokenRepository', () => {
  let repository: EmailTokenRepository;
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
    orderBy: ReturnType<typeof vi.fn>;
    offset: ReturnType<typeof vi.fn>;
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
      limit: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      returning: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      offset: vi.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailTokenRepository,
        {
          provide: getDrizzleToken(),
          useValue: mockDb,
        },
      ],
    }).compile();

    repository = module.get(EmailTokenRepository);
    database = module.get(getDrizzleToken());
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(database).toBeDefined();
  });

  describe('saveEmailToken', () => {
    it('should save email token', async () => {
      const record = {
        userId: 'user-123',
        email: 'test@example.com',
        purpose: 'email-verification',
        createdAt: new Date(),
      } as EmailTokenRecord;

      await repository.saveEmailToken(record);

      expect(mockDb.transaction).toHaveBeenCalledTimes(1);
      expect(mockDb.insert).toHaveBeenCalledWith(emailTokens);
      expect(mockDb.values).toHaveBeenCalledWith({
        ...record,
        userId: Number(record.userId),
      });
      expect(trim).toHaveBeenCalledTimes(1);
      expect(trim).toHaveBeenCalledWith({
        db: mockDb,
        table: emailTokens,
        now: expect.any(Date),
        maxPending: repository['maxPending'],
      });
    });
  });

  describe('consumeEmailToken', () => {
    it('should consume email token', async () => {
      const id = 'token-123';
      const purpose: EmailTokenPurpose = 'email-verification';

      mockDb.delete.mockReturnThis();
      mockDb.where.mockReturnThis();
      mockDb.returning.mockResolvedValueOnce([
        {
          id,
          userId: 123,
          email: 'test@example.com',
          purpose,
          createdAt: new Date(),
        },
      ]);

      const result = await repository.consumeEmailToken(id, purpose);

      expect(mockDb.delete).toHaveBeenCalledWith(emailTokens);
      expect(mockDb.where).toHaveBeenCalledWith(
        and(eq(emailTokens.id, id), eq(emailTokens.purpose, purpose)),
      );
      expect(mockDb.returning).toHaveBeenCalled();
      expect(result).toEqual({
        id,
        userId: '123',
        email: 'test@example.com',
        purpose,
        createdAt: expect.any(Date),
      });
    });

    it('should return undefined if no email token is found', async () => {
      const id = 'token-123';
      const purpose: EmailTokenPurpose = 'email-verification';

      mockDb.delete.mockReturnThis();
      mockDb.where.mockReturnThis();
      mockDb.returning.mockResolvedValueOnce([]);

      const result = await repository.consumeEmailToken(id, purpose);

      expect(result).toBeUndefined();
      expect(withoutNulls).not.toHaveBeenCalled();
    });
  });

  describe('deleteUserEmailTokens', () => {
    it('should delete user email tokens', async () => {
      const userId = 'user-123';
      const purpose: EmailTokenPurpose = 'email-verification';

      mockDb.delete.mockReturnThis();
      mockDb.where.mockReturnThis();

      await repository.deleteUserEmailTokens(userId, purpose);

      expect(mockDb.delete).toHaveBeenCalledWith(emailTokens);
      expect(mockDb.where).toHaveBeenCalledWith(
        and(eq(emailTokens.userId, Number(userId)), eq(emailTokens.purpose, purpose)),
      );
    });
  });
});
