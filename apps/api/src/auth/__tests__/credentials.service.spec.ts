import { Test, TestingModule } from '@nestjs/testing';
import { PasswordHasher } from '@nestjs/authentication';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { SignUpDto, User } from '@repo/schemas';
import { CredentialsService } from '../credentials.service.js';
import { UsersRepository } from '../../users/users.repository.js';

describe('CredentialsService', () => {
  let service: CredentialsService;
  let usersRepository: UsersRepository;
  let passwordHasher: PasswordHasher;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CredentialsService,
        {
          provide: UsersRepository,
          useValue: {
            findByEmail: vi.fn(),
            create: vi.fn(),
          },
        },
        {
          provide: PasswordHasher,
          useValue: {
            hash: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CredentialsService>(CredentialsService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    passwordHasher = module.get<PasswordHasher>(PasswordHasher);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(usersRepository).toBeDefined();
    expect(passwordHasher).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user correctly', async () => {
      // Arrange
      const createUserDto: SignUpDto = { email: 'test@example.com', password: 'password' };
      const hashedPassword = 'hashedPassword';

      vi.spyOn(usersRepository, 'findByEmail').mockResolvedValue(null);
      vi.spyOn(passwordHasher, 'hash').mockResolvedValue(hashedPassword);
      vi.spyOn(usersRepository, 'create').mockResolvedValue({
        id: 1,
        ...createUserDto,
      } as unknown as User);

      // Act
      const result = await service.register(createUserDto);

      // Assert
      expect(result).toEqual({ id: 1, ...createUserDto });
      expect(passwordHasher.hash).toHaveBeenCalledWith(createUserDto.password);
      expect(usersRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
      expect(usersRepository.findByEmail).toHaveBeenCalledWith({ email: createUserDto.email });
    });

    it('should throw an error if the email is already in use', async () => {
      // Arrange
      const createUserDto: SignUpDto = { email: 'test@example.com', password: 'password' };

      vi.spyOn(usersRepository, 'findByEmail').mockResolvedValue({
        id: 1,
        ...createUserDto,
      } as unknown as User);

      // Act & Assert
      await expect(service.register(createUserDto)).rejects.toThrow('Email is already in use');

      expect(usersRepository.findByEmail).toHaveBeenCalledWith({ email: createUserDto.email });
      expect(usersRepository.create).not.toHaveBeenCalled();
    });
  });
});
