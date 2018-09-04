module.exports = () => ({
  files: ['src/**/*.ts', '!src/**/*.test.ts'],
  tests: ['src/**/*.test.ts'],
  env: {type: 'node', runner: 'node'},
  testFramework: 'jest'
});
