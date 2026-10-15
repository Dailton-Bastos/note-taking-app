import { z } from 'zod';
import { signUpSchema, signInSchema } from './index.js';

export type SignUpDto = z.infer<typeof signUpSchema>;
export type SignInDto = z.infer<typeof signInSchema>;
