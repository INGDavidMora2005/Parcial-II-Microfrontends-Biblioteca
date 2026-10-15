const { createCjsPreset } = require('jest-preset-angular/build/presets');

module.exports = {
  ...createCjsPreset(),
  testMatch: ['**/+(*.)+(spec|test).+(ts|tsx)'],
  setupFiles: ['<rootDir>/setup-jest.ts'],
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/main.ts',
    '!src/app/app.config.ts',
    '!src/app/app.routes.ts',
    '!src/app/app.ts',
    '!src/bootstrap.ts',
    '!src/**/*.config.ts',
    '!src/**/index.ts',
    '!src/**/*.module.ts',
    '!src/app/domain/entities/member.entity.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90,
    },
  },
};
