import { Injectable } from '@nestjs/common';
import { type SessionStore, SessionRecord, AuthenticationStorage } from '@nestjs/authentication';
import { SessionsRepository } from './sessions.repository.js';

@Injectable()
export class SessionAuthStore implements SessionStore {
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    storage: AuthenticationStorage,
  ) {
    storage.registerSource({ sessions: this });
  }

  async getSession(): Promise<SessionRecord | undefined> {
    return;
  }

  async createSession(session: SessionRecord): Promise<void> {
    await this.sessionsRepository.create(session);
  }

  async listUserSessions(): Promise<SessionRecord[]> {
    return [];
  }

  async touchSession() {}

  async deleteSession(): Promise<boolean> {
    return false;
  }

  async deleteUserSessions() {}
}
