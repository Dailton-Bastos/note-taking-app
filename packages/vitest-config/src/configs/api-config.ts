import { defineProject, mergeConfig } from 'vitest/config';
import { baseConfig } from './base-config.js';

export const apiConfig = mergeConfig(
  baseConfig,
  defineProject({
    test: {
      root: './',
      environment: 'node',
    },
  }),
);

export const apiE2EConfig = mergeConfig(
  baseConfig,
  defineProject({
    test: {
      root: './test',
      environment: 'node',
      include: ['**/*.e2e-spec.ts'],
    },
  }),
);
