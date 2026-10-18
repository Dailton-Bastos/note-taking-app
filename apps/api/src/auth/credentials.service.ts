import { Injectable, ConflictException } from '@nestjs/common';
import { PasswordHasher } from '@nestjs/authentication';
import type { User, SignUpDto, SignInDto } from '@repo/schemas';
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

  async verify({ email, password }: SignInDto): Promise<User | null> {
    const user = await this.usersRepository.findByEmail({ email });

    if (!user) return null;

    const isPasswordValid = await this.passwordHasher.verify(password, user.password);

    if (!isPasswordValid) return null;

    // TODO: Rehash the password and update the user record

    return user;
  }
}
