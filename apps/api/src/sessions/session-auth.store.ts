import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import { type SessionStore, SessionRecord, AuthenticationStorage } from '@nestjs/authentication';
import type { Database } from '../database/database.js';

@Injectable()
export class SessionAuthStore implements SessionStore {
  constructor(
    @InjectDrizzle() private readonly db: Database,
    storage: AuthenticationStorage,
  ) {
    storage.registerSource({ sessions: this });
  }

  async getSession(): Promise<SessionRecord | undefined> {
    return;
  }

  async createSession() {}

  async listUserSessions(): Promise<SessionRecord[]> {
    return [];
  }

  async touchSession() {}

  async deleteSession(): Promise<boolean> {
    return false;
  }

  async deleteUserSessions() {}
}
