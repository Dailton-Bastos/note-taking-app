export const sharedConfig = {
  test: {
    globals: true,
    reporters: ['default', 'blob'],
    outputFile: {
      blob: 'coverage/blob/report.json',
    },
    coverage: {
      provider: 'istanbul' as const,
      enabled: true,
    },
  },
};

export { baseConfig } from './configs/base-config.js';
export { apiConfig, apiE2EConfig } from './configs/api-config.js';
export { webConfig } from './configs/web-config.js';
