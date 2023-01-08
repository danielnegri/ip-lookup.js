module.exports = {
  testMatch: ['**/?(*.)+(spec|test).e2e.js'],
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/'],
  transform: {},
  modulePathIgnorePatterns: ['.cache'],
  setupFiles: ['<rootDir>/.jest/setEnvVars.js'],
};
