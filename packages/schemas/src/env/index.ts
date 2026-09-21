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
});
