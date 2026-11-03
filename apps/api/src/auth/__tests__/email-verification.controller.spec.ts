import { Test, TestingModule } from '@nestjs/testing';
import { EmailVerificationService } from '@nestjs/authentication';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { User } from '@repo/schemas';
import { EmailVerificationController } from '../email-verification.controller.js';

describe('EmailVerificationController', () => {
  let controller: EmailVerificationController;
  let emailVerificationService: EmailVerificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailVerificationController],
      providers: [
        {
          provide: EmailVerificationService,
          useValue: {
            verify: vi.fn(),
            send: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EmailVerificationController>(EmailVerificationController);
    emailVerificationService = module.get<EmailVerificationService>(EmailVerificationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(emailVerificationService).toBeDefined();
  });

  describe('verify', () => {
    it('should call emailVerificationService.verify', async () => {
      const verifySpy = vi.spyOn(emailVerificationService, 'verify');

      verifySpy.mockResolvedValue({
        email: 'test@example.com',
        userId: 'test-user-id',
      });

      const result = await controller.verify({ token: 'test-token' });

      expect(verifySpy).toHaveBeenCalledWith('test-token');
      expect(result).toEqual({
        email: 'test@example.com',
        verified: true,
      });
    });

    it('should throw an error if token is invalid or expired', async () => {
      const verifySpy = vi.spyOn(emailVerificationService, 'verify');

      verifySpy.mockResolvedValue(null);

      await expect(controller.verify({ token: 'test-token' })).rejects.toThrow(
        'Invalid or expired link',
      );
    });
  });

  describe('send', () => {
    it('should call emailVerificationService.send', async () => {
      const currentUser = { id: 1, email: 'test@example.com' } as User;
      const sendSpy = vi.spyOn(emailVerificationService, 'send');

      await controller.resend(currentUser);
      expect(sendSpy).toHaveBeenCalledWith({
        id: String(currentUser.id),
        email: currentUser.email,
      });
    });

    it('should throw an error if email is already verified', async () => {
      const currentUser = { id: 1, email: 'test@example.com', emailVerified: true } as User;
      const sendSpy = vi.spyOn(emailVerificationService, 'send');

      await expect(controller.resend(currentUser)).rejects.toThrow('Email is already verified');
      expect(sendSpy).not.toHaveBeenCalled();
    });
  });
});
