import path from 'node:path';

// Safely escape filenames for the shell execution
const quoteForShell = (value) => `'${value.replace(/'/g, `'"'"'`)}'`;

/**
 * Builds individual commands for a given package directory.
 * Using Oxlint/Oxfmt for high-speed linting/fixing.
 */
const buildLintCommands = (dir, files) => {
  const quotedDir = quoteForShell(dir);
  const quotedFiles = files.map(quoteForShell).join(' ');
  const hasTypeScriptFiles = files.some((file) => /\.(?:ts|tsx)$/.test(file));

  return [
    // cd into the specific app/package directory so local configs are picked up
    `bash -c "cd ${quotedDir} && pnpm oxlint --fix ${quotedFiles}"`,
    `bash -c "cd ${quotedDir} && pnpm oxfmt --no-error-on-unmatched-pattern ${quotedFiles}"`,
    ...(hasTypeScriptFiles
      ? [
          `bash -c "cd ${quotedDir} && if [ -f tsconfig.json ]; then pnpm exec tsc --noEmit -p tsconfig.json; fi"`,
        ]
      : []),
  ];
};

export default {
  // Handle apps separately with proper directory context
  'apps/**/*.{js,jsx,ts,tsx}': (filenames) => {
    const filesByApp = filenames.reduce((acc, filename) => {
      // Convert lint-staged's absolute path to a root-relative POSIX path.
      const posixPath = path.relative(process.cwd(), filename).replace(/\\/g, '/');
      const match = posixPath.match(/^apps\/([^/]+)\/(.+)/);
      if (!match) return acc;

      const appName = match[1];
      if (!acc[appName]) acc[appName] = [];
      acc[appName].push(posixPath);
      return acc;
    }, {});

    // Use proper shell command format
    return Object.entries(filesByApp).flatMap(([appName, files]) => {
      const appDir = `apps/${appName}`;
      // Calculate paths relative to the app directory (e.g., src/index.ts instead of apps/web/src/index.ts)
      const relativeFiles = files.map((file) => path.relative(appDir, file));

      return buildLintCommands(appDir, relativeFiles);
    });
  },

  // Run tests for staged test files
  '**/*.{test,spec}.{js,jsx,ts,tsx}': (filenames) => {
    const uniqueFiles = [...new Set(filenames.map((file) => file.replace(/\\/g, '/')))].filter(
      Boolean,
    );
    const quotedFiles = uniqueFiles.map(quoteForShell).join(' ');
    return [`pnpm vitest run -- ${quotedFiles}`];
  },

  // Handle packages separately
  'packages/**/*.{js,jsx,ts,tsx}': (filenames) => {
    const filesByPackage = filenames.reduce((acc, filename) => {
      const posixPath = path.relative(process.cwd(), filename).replace(/\\/g, '/');
      const match = posixPath.match(/^packages\/([^/]+)\/(.+)/);
      if (!match) return acc;

      const pkgName = match[1];
      if (!acc[pkgName]) acc[pkgName] = [];
      acc[pkgName].push(posixPath);
      return acc;
    }, {});

    return Object.entries(filesByPackage).flatMap(([pkgName, files]) => {
      const pkgDir = `packages/${pkgName}`;
      const relativeFiles = files.map((file) => path.relative(pkgDir, file));

      return buildLintCommands(pkgDir, relativeFiles);
    });
  },

  // Root level configurations and documentation files
  '*.{json,md,yml,yaml,hbs}': (filenames) => {
    const quotedFiles = filenames.map(quoteForShell).join(' ');
    return [`pnpm oxfmt --no-error-on-unmatched-pattern ${quotedFiles}`];
  },
};
