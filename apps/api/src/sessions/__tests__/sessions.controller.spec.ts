import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { SignInService } from '@nestjs/authentication';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SessionsController } from '../sessions.controller.js';

describe('SessionsController', () => {
  let controller: SessionsController;
  let signInService: SignInService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionsController],
      providers: [
        {
          provide: SignInService,
          useValue: {
            signOut: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SessionsController>(SessionsController);
    signInService = module.get<SignInService>(SignInService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(signInService).toBeDefined();
  });

  describe('signOut', () => {
    it('should call signOut on the SignInService', async () => {
      vi.spyOn(signInService, 'signOut').mockResolvedValue(true);

      await controller.signOut();

      expect(signInService.signOut).toHaveBeenCalled();
    });

    it('should throw an UnauthorizedException if signOut returns false', async () => {
      vi.spyOn(signInService, 'signOut').mockResolvedValue(false);

      await expect(controller.signOut()).rejects.toThrow(new UnauthorizedException());
    });
  });
});
