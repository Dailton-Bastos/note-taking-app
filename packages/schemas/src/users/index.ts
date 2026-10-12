import { z } from 'zod';

export const userSchema = z.object({
  id: z.number().int(),
  email: z.email(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
