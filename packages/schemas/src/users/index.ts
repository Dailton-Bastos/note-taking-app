import { z } from 'zod';

export const userSchema = z.object({
  id: z.number().int(),
  email: z.email(),
  password: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
