import { z } from 'zod';

export const userSchema = z.object({
  id: z.number().int(),
  email: z.email(),
  emailVerified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
