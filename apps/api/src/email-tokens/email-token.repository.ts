import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import type { EmailTokenRecord, EmailTokenPurpose } from '@nestjs/authentication';
import { eq, and } from 'drizzle-orm';
import type { Database } from '../database/database.js';
import { emailTokens } from '../database/schema/index.js';
import { trim } from '../database/helpers/trim.helper.js';
import { withoutNulls } from '../database/helpers/without-nulls.helper.js';

@Injectable()
export class EmailTokenRepository {
  protected readonly maxPending: number = 100_000;

  constructor(@InjectDrizzle() private readonly db: Database) {}

  async saveEmailToken(record: EmailTokenRecord): Promise<void> {
    await this.db.transaction(async (tx) => {
      await tx.insert(emailTokens).values({
        ...record,
        userId: Number(record.userId),
      });

      await this.trim(record.createdAt, tx);
    });
  }

  async consumeEmailToken(
    id: string,
    purpose: EmailTokenPurpose,
  ): Promise<EmailTokenRecord | undefined> {
    const [record] = await this.db
      .delete(emailTokens)
      .where(and(eq(emailTokens.id, id), eq(emailTokens.purpose, purpose)))
      .returning();

    if (!record) return;

    return withoutNulls({
      ...record,
      userId: String(record.userId),
    });
  }

  async deleteUserEmailTokens(userId: string, purpose: EmailTokenPurpose): Promise<void> {
    await this.db
      .delete(emailTokens)
      .where(and(eq(emailTokens.userId, Number(userId)), eq(emailTokens.purpose, purpose)));
  }

  private async trim(now: Date, db: Database): Promise<void> {
    await trim({
      db,
      table: emailTokens,
      now,
      maxPending: this.maxPending,
    });
  }
}
