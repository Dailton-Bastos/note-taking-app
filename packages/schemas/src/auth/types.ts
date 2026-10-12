import { z } from 'zod';
import { signUpSchema } from './index.js';

export type SignUpDto = z.infer<typeof signUpSchema>;
