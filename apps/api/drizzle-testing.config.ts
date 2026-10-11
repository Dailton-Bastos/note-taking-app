import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/database/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://postgres:mysecretpassword@postgres:5432/note-taking-app-testing',
  },
  strict: true,
  verbose: true,
});
