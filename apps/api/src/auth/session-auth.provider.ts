import { Injectable } from '@nestjs/common';
import {
  type SessionRecord,
  SessionCookieProvider,
  AuthenticationRegistry,
} from '@nestjs/authentication';
import type { User } from '@repo/schemas';
import { UsersRepository } from '../users/users.repository.js';

@Injectable()
export class SessionAuthProvider extends SessionCookieProvider<User> {
  constructor(
    private readonly usersRepository: UsersRepository,
    registry: AuthenticationRegistry,
  ) {
    super();

    // Adds this provider to the chain the guard runs for every request.
    registry.registerProvider(this);
  }

  validate(session: SessionRecord) {
    // Returning null ends the session.
    return this.usersRepository.findById({ id: Number(session.id) });
  }
}
