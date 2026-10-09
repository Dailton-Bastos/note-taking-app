import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthController } from '../auth.controller.js';
import { CredentialsService } from '../credentials.service.js';

describe('AuthController', () => {
  let controller: AuthController;
  let credentialsService: CredentialsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: CredentialsService,
          useValue: {
            register: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    credentialsService = module.get<CredentialsService>(CredentialsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(credentialsService).toBeDefined();
  });

  describe('register', () => {
    it('should call credentialsService.register with correct parameters', async () => {
      const createUserDto = { email: 'test@example.com', password: 'password' };

      await controller.signUp(createUserDto);

      expect(credentialsService.register).toHaveBeenCalledTimes(1);
      expect(credentialsService.register).toHaveBeenCalledWith(createUserDto);
    });
  });
});
