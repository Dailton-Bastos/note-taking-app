import { defineConfig } from 'drizzle-kit';

import 'dotenv/config';

const POSTGRES_URL_TEST = process.env.POSTGRES_URL_TEST;

if (!POSTGRES_URL_TEST) {
  throw new Error('POSTGRES_URL_TEST environment variable is not defined');
}

export default defineConfig({
  schema: './src/database/schema',
  dialect: 'postgresql',
  dbCredentials: { url: POSTGRES_URL_TEST },
  strict: true,
  verbose: true,
});
