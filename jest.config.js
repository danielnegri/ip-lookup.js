/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  rootDir: __dirname,
  modulePathIgnorePatterns: ['.cache'],
  setupFiles: ['<rootDir>/.jest/setEnvVars.js'],
  testMatch: ['/**/__tests__/**/*.[jt]s?(x)'],
};
