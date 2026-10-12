import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { timestamps } from '../helpers/columns.helpers.js';

export const users = table('users', {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  email: t.varchar().notNull().unique(),
  password: t.varchar().notNull(),
  ...timestamps,
});
