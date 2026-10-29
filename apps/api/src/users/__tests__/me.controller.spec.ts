import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import type { User } from '@repo/schemas';
import { MeController } from '../me.controller.js';

describe('MeController', () => {
  let controller: MeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeController],
    }).compile();

    controller = module.get<MeController>(MeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMe', () => {
    it('should return the current user', () => {
      const user = { id: 1, email: 'test@example.com' } as User;

      const result = controller.getMe(user);

      expect(result).toEqual(user);
    });
  });
});
