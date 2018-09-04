// @ts-check

const autosrc = require('autosrc');

/** @type {autosrc.Rules} */
const rules = (exports.rules = {});

const touch = file => `touch ${file}`;

const tslint = files => {
  const tsFiles = files.filter(file => /\.tsx?$/.test(file)).join(' ');

  if (tsFiles) {
    return `yarn tslint --config tslint.json --project tsconfig.json --format verbose ${tsFiles}`;
  }
};

rules.all = {
  phony: true,
  prereqs: ['lib']
};

rules.clean = {
  phony: true,
  prereqs: ['src/**/*.{ts,tsx}'],
  recipe: (_, newerPrereqs) => [...newerPrereqs.map(touch), 'rm -rf lib']
};

rules.lib = {
  prereqs: [
    'node_modules',
    'src/**/*.{ts,tsx}',
    'tsconfig.json',
    'tslint.json'
  ],
  recipe: (target, newerPrereqs) => [
    'yarn tsc --project tsconfig.json',
    tslint(newerPrereqs),
    touch(target)
  ]
};

rules.node_modules = {
  prereqs: ['package.json', 'yarn.lock'],
  recipe: target => ['yarn install --check-files', touch(target)]
};
