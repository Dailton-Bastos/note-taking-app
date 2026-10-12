import { z } from 'zod';
import { userSchema } from './index.js';

export type User = z.infer<typeof userSchema>;
