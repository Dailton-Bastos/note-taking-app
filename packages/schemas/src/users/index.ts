import { z } from 'zod';

export const userSchema = z.object({
  id: z.number().int(),
  email: z.email(),
  password: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
