import { defineConfig } from 'drizzle-kit';

import 'dotenv/config';

export default defineConfig({
  schema: './src/database/schema',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.POSTGRES_URL as string },
  strict: true,
  verbose: true,
});
