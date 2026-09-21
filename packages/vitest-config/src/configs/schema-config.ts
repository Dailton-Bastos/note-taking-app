import { defineProject, mergeConfig } from 'vitest/config';
import { baseConfig } from './base-config.js';

export const schemaConfig = mergeConfig(
  baseConfig,
  defineProject({
    test: {
      globals: true,
      environment: 'node',
    },
  }),
);
