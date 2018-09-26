const {readdirSync} = require('fs');
const {join} = require('path');

const dependabotScopes = process.env.CI === 'true' ? ['deps', 'deps-dev'] : [];

const pkgScopes = readdirSync(join(__dirname, '@powered-up')).filter(
  scope => !/^\./.test(scope)
);

const scopes = ['all', ...dependabotScopes, ...pkgScopes];

module.exports = {
  extends: ['@commitlint/config-angular'],
  rules: {
    'header-max-length': [2, 'always', 140],
    'scope-empty': [2, 'never'],
    'scope-enum': [2, 'always', scopes]
  }
};
