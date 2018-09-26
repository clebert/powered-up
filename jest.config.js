module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  modulePathIgnorePatterns: ['/lib/'],
  testMatch: ['<rootDir>/@powered-up/*/src/**/*.test.ts'],
  transform: {'.ts': 'ts-jest'},
  testURL: 'http://localhost',
  collectCoverage: false,
  collectCoverageFrom: ['**/@powered-up/*/src/**/*.ts'],
  coverageThreshold: {
    global: {branches: 100, functions: 100, lines: 100, statements: 100}
  }
};
