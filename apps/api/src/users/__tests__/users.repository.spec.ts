import { Test, TestingModule } from '@nestjs/testing';
import { getDrizzleToken } from '@nestjs/drizzle';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UsersRepository } from '../users.repository.js';
import type { User } from '@repo/schemas';
import type { Database } from '../../database/database';

describe('UsersRepository', () => {
  let repository: UsersRepository;
  let database: Database;

  let mockDb: {
    select: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockDb = {
      select: vi.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: getDrizzleToken(),
          useValue: mockDb,
        },
      ],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
    database = module.get(getDrizzleToken());
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(database).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const user = { id: 1, email: 'test@example.com' } as User;

      const selectSpy = vi.spyOn(mockDb, 'select');

      selectSpy.mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValueOnce([user]),
      });

      const email = 'test@example.com';

      const result = await repository.findByEmail({ email });

      expect(result).toEqual(user);
      expect(selectSpy).toHaveBeenCalled();
    });

    it('should return null if no user is found', async () => {
      const selectSpy = vi.spyOn(mockDb, 'select');

      selectSpy.mockReturnValueOnce({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValueOnce([]),
      });

      const email = 'nonexistent@example.com';

      const result = await repository.findByEmail({ email });

      expect(result).toBeNull();
    });
  });
});
