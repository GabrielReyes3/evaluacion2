module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/server.test.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/src/',
    '/build/'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/src/',
    '/build/'
  ],
  modulePathIgnorePatterns: [
    '/build/'
  ],
  testTimeout: 10000,
  verbose: true,
  collectCoverageFrom: [
    'server.js',
    '!src/**',
    '!build/**'
  ]
};