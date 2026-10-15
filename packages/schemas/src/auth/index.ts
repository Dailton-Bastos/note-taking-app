import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(128),
});

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(1, 'Please enter your password'),
});
