import { lte, lt, desc } from 'drizzle-orm';
import { emailTokens } from '../schema/index.js';
import type { Database } from '../database.js';

/** Deletes what expired, and past `maxPending`, what expires first. */
export const trim = async ({
  db,
  table,
  now,
  maxPending,
}: {
  db: Database;
  table: typeof emailTokens;
  now: Date;
  maxPending: number;
}): Promise<void> => {
  await db.delete(table).where(lte(table.expiresAt, now));

  const [cutoff] = await db
    .select({ expiresAt: table.expiresAt })
    .from(table)
    .where(lt(table.expiresAt, now))
    .orderBy(desc(table.expiresAt))
    .limit(1)
    .offset(maxPending);

  if (cutoff) {
    await db.delete(table).where(lte(table.expiresAt, cutoff.expiresAt));
  }
};
