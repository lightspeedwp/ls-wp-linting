import { defineConfig } from 'vitest/config';

// Tests live in a __tests__/ folder beside each script. Coverage covers this
// skill's own TypeScript tooling and must stay at 80% or above.
export default defineConfig({
  test: {
    include: ['scripts/**/__tests__/**/*.test.ts'],
    environment: 'node',
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      include: ['scripts/**/*.ts'],
      exclude: ['scripts/**/__tests__/**'],
      reporter: ['text', 'lcov'],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
