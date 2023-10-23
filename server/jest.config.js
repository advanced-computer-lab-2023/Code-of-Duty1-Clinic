module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/tests/test.setup.ts'],
  testMatch: ['**/*.test.ts'],
  maxWorkers: 1
  // collectCoverage: true,
  // coverageDirectory: './coverage',
};
