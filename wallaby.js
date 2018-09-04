module.exports = () => ({
  files: ['@powered-up/*/src/**/*.ts', '!@powered-up/*/src/**/*.test.ts'],
  tests: ['@powered-up/*/src/**/*.test.ts'],
  env: {type: 'node', runner: 'node'},
  testFramework: 'jest'
});
