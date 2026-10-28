import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import type { SessionRecord } from '@nestjs/authentication';
import { lte, eq, and, lt } from 'drizzle-orm';
import type { Database } from '../database/database.js';
import { sessions } from '../database/schema/index.js';

@Injectable()
export class SessionsRepository {
  constructor(@InjectDrizzle() private readonly db: Database) {}

  async findById(id: string): Promise<SessionRecord | undefined> {
    const [session] = await this.db.select().from(sessions).where(eq(sessions.id, id)).limit(1);

    if (!session) return;

    return {
      ...session,
      userId: String(session.userId),
      mfa: session.mfa ? session.mfa : undefined,
      metadata: session.metadata ?? {},
    };
  }

  async create(session: SessionRecord): Promise<void> {
    await this.db.transaction(async (tx) => {
      await tx.insert(sessions).values({
        ...session,
        userId: Number(session.userId),
      });

      await tx.delete(sessions).where(lte(sessions.expiresAt, session.createdAt));
    });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(sessions)
      .where(eq(sessions.id, id))
      .returning({ id: sessions.id });

    return result.length > 0;
  }

  async touch(id: string, lastActiveAt: Date): Promise<void> {
    await this.db
      .update(sessions)
      .set({ lastActiveAt })
      .where(and(eq(sessions.id, id), lt(sessions.lastActiveAt, lastActiveAt)));
  }
}
