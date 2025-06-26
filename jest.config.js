module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleNameMapper: {
    '^/src/(.*)$': '<rootDir>/src/$1'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: [
    '**/tests/**/*.spec.ts',
    '**/tests/**/*.test.ts'
  ],
  // Remove setupFilesAfterEnv if you don't need a setup file
  // setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
};