import { Injectable, ConflictException } from '@nestjs/common';
import { PasswordHasher } from '@nestjs/authentication';
import type { User, SignUpDto } from '@repo/schemas';
import { UsersRepository } from '../users/users.repository.js';

@Injectable()
export class CredentialsService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async register({ email, password }: SignUpDto): Promise<User> {
    const existingUser = await this.usersRepository.findByEmail({ email });

    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    const hashedPassword = await this.passwordHasher.hash(password);

    return this.usersRepository.create({ email, password: hashedPassword });
  }
}
