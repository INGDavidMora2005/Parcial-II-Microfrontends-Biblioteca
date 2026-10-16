module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  coverageReporters: ['html', 'json', 'lcov', 'text', 'clover'],
  collectCoverageFrom: ['src/app/**/*.ts', '!src/app/**/*.spec.ts', '!src/app/app.config.ts', '!src/app/app.routes.ts'],
  coverageThreshold: { global: { statements: 90, branches: 90, functions: 90, lines: 90 } },
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  verbose: true,
  testEnvironment: 'jsdom',
  collectCoverage: true,
  clearMocks: true,
  testMatch: ['**/*.spec.ts'],
  rootDir: './'
};
