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

  async getSession(id: string): Promise<SessionRecord | undefined> {
    return this.sessionsRepository.findById(id);
  }

  async createSession(session: SessionRecord): Promise<void> {
    await this.sessionsRepository.create(session);
  }

  async listUserSessions(): Promise<SessionRecord[]> {
    // TODO: Implement listing user sessions based on the current authenticated user.
    return [];
  }

  async touchSession(id: string, lastActiveAt: Date): Promise<void> {
    await this.sessionsRepository.touch(id, lastActiveAt);
  }

  async deleteSession(id: string): Promise<boolean> {
    return this.sessionsRepository.delete(id);
  }

  async deleteUserSessions() {
    // TODO: Implement deleting all sessions for the current authenticated user.
  }
}
