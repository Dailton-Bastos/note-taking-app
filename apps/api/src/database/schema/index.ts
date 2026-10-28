import { pgTable as table, timestamp, index } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { timestamps } from '../helpers/columns.helpers.js';

export const users = table('users', {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  email: t.varchar().notNull().unique(),
  password: t.varchar().notNull(),
  ...timestamps,
});

export const sessions = table(
  'sessions',
  {
    id: t.text('id').primaryKey(),
    userId: t
      .integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
    lastActiveAt: timestamp('last_active_at', { withTimezone: true, mode: 'date' }).notNull(),
    mfa: t.text('mfa', { enum: ['pending', 'verified'] }),
    metadata: t.jsonb('metadata').$type<Record<string, unknown>>(),
    ...timestamps,
  },
  (t) => [
    index('sessions_user_id_idx').on(t.userId),
    index('sessions_expires_at_idx').on(t.expiresAt),
  ],
);
