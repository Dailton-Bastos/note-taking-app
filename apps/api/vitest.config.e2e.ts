// import { defineConfig } from 'vitest/config';
// import tsconfigPaths from 'vite-tsconfig-paths';

// export default defineConfig({
//   plugins: [tsconfigPaths()],
//   test: {
//     globals: true,
//     root: './',
//     include: ['**/*.e2e-spec.ts'],
//   },
// });
import { apiE2EConfig } from '@repo/vitest-config';

export default apiE2EConfig;
