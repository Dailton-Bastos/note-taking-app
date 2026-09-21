import { validationApiSchema } from '@repo/schemas';

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = validationApiSchema.safeParse(config);

  if (!validatedConfig.success) {
    throw new Error(`Invalid environment variables: ${validatedConfig.error.message}`);
  }

  return validatedConfig.data;
};
