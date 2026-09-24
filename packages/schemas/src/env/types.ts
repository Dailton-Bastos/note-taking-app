import { z } from 'zod';
import { validationApiSchema } from './index.js';

export type EnvironmentApi = z.infer<typeof validationApiSchema>;
