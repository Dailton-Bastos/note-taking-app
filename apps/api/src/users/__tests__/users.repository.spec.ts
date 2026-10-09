import { Test, TestingModule } from '@nestjs/testing';
import { getDrizzleToken } from '@nestjs/drizzle';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UsersRepository } from '../users.repository.js';
import type { User, SignUpDto } from '@repo/schemas';
import type { Database } from '../../database/database';

describe('UsersRepository', () => {
  let repository: UsersRepository;
  let database: Database;

  let mockDb: {
    select: ReturnType<typeof vi.fn>;
    insert: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockDb = {
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
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

  describe('create', () => {
    it('should create a new user', async () => {
      const newUser = { email: 'test@example.com', password: 'password123' } as SignUpDto;

      const insertSpy = vi.spyOn(mockDb, 'insert');

      insertSpy.mockReturnValueOnce({
        values: vi.fn().mockReturnThis(),
        onConflictDoNothing: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValueOnce([newUser]),
      });

      const result = await repository.create({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual(newUser);
      expect(insertSpy).toHaveBeenCalled();
    });

    it('should throw an error if the user could not be created', async () => {
      const insertSpy = vi.spyOn(mockDb, 'insert');

      insertSpy.mockReturnValueOnce({
        values: vi.fn().mockReturnThis(),
        onConflictDoNothing: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValueOnce([]),
      });

      const newUser = { email: 'test@example.com', password: 'password123' } as SignUpDto;

      await expect(repository.create(newUser)).rejects.toThrow();
      expect(insertSpy).toHaveBeenCalled();
    });
  });
});
