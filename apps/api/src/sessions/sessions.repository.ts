import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import type { SessionRecord } from '@nestjs/authentication';
import { lte } from 'drizzle-orm';
import type { Database } from '../database/database.js';
import { sessions } from '../database/schema/index.js';

@Injectable()
export class SessionsRepository {
  constructor(@InjectDrizzle() private readonly db: Database) {}

  async create(session: SessionRecord): Promise<void> {
    await this.db.transaction(async (tx) => {
      await tx.insert(sessions).values({
        ...session,
        userId: Number(session.userId),
      });

      await tx.delete(sessions).where(lte(sessions.expiresAt, session.createdAt));
    });
  }
}
