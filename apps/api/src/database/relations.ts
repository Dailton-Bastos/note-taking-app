import { defineRelations } from 'drizzle-orm';
import * as schema from './schema/index.js';

export const relations = defineRelations(schema, (r) => ({
  users: { sessions: r.many.sessions(), emailTokens: r.many.emailTokens() },
  sessions: {
    user: r.one.users({
      from: r.sessions.userId,
      to: r.users.id,
    }),
  },
  emailTokens: {
    user: r.one.users({
      from: r.emailTokens.userId,
      to: r.users.id,
    }),
  },
}));
