import { z } from 'zod';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export const validationApiSchema = z.object({
  NODE_ENV: z
    .enum([Environment.Development, Environment.Production, Environment.Test])
    .default(Environment.Development),
  PORT: z.coerce.number<number>().default(3000),
  POSTGRES_URL: z
    .string()
    .regex(/^(postgresql|postgres):\/\/.+$/, 'Invalid PostgreSQL connection string'),
  HEALTH_RSS_THRESHOLD: z.coerce.number<number>().default(300 * 1024 * 1024),
  HEALTH_HEAP_THRESHOLD: z.coerce.number<number>().default(150 * 1024 * 1024),
  HEALTH_DISK_THRESHOLD: z.coerce.number<number>().default(250 * 1024 * 1024 * 1024),
});
