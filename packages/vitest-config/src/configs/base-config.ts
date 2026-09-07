import { defineConfig } from 'vitest/config';

export const baseConfig = defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    reporters: ['default', 'blob'],
    include: ['**/*.spec.{ts,tsx,js}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/coverage/**'],
    outputFile: {
      blob: 'coverage/blob/report.json',
    },
    coverage: {
      provider: 'istanbul' as const,
      reportsDirectory: 'coverage',
      enabled: true,
    },
  },
});
