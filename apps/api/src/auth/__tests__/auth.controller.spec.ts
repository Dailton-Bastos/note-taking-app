import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { type IssuedSession, SignInService } from '@nestjs/authentication';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthController } from '../auth.controller.js';
import { CredentialsService } from '../credentials.service.js';

describe('AuthController', () => {
  let controller: AuthController;
  let credentialsService: CredentialsService;
  let signInService: SignInService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: CredentialsService,
          useValue: {
            register: vi.fn(),
            verify: vi.fn(),
          },
        },
        {
          provide: SignInService,
          useValue: {
            signIn: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    credentialsService = module.get<CredentialsService>(CredentialsService);
    signInService = module.get<SignInService>(SignInService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(credentialsService).toBeDefined();
    expect(signInService).toBeDefined();
  });

  describe('signUp', () => {
    it('should call credentialsService.register with correct parameters', async () => {
      const createUserDto = { email: 'test@example.com', password: 'password' };

      vi.spyOn(credentialsService, 'register').mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await controller.signUp(createUserDto);

      expect(credentialsService.register).toHaveBeenCalledTimes(1);
      expect(credentialsService.register).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('signIn', () => {
    it('should call credentialsService.verify with correct parameters and signInService.signIn on success', async () => {
      const signInDto = { email: 'test@example.com', password: 'password' };

      vi.spyOn(credentialsService, 'verify').mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const signInSpy = vi.spyOn(signInService, 'signIn').mockResolvedValue({
        cookie: 'test-cookie',
      } as IssuedSession);

      await controller.signIn(signInDto);

      expect(credentialsService.verify).toHaveBeenCalledTimes(1);
      expect(credentialsService.verify).toHaveBeenCalledWith(signInDto);
      expect(signInSpy).toHaveBeenCalledTimes(1);
      expect(signInSpy).toHaveBeenCalledWith('1', { method: 'password' });
    });

    it('should throw UnauthorizedException if credentialsService.verify returns null', async () => {
      const signInDto = { email: 'test@example.com', password: 'password' };

      vi.spyOn(credentialsService, 'verify').mockResolvedValue(null);

      await expect(controller.signIn(signInDto)).rejects.toThrow(
        new UnauthorizedException('Email or password is incorrect'),
      );
    });
  });
});
