// @ts-check

const autosrc = require('autosrc');
const {readdirSync} = require('fs');

/** @type {autosrc.Rules} */
const rules = (exports.rules = {});

function findLocalDependencies(pkg) {
  const {
    dependencies,
    devDependencies
  } = require(`./@powered-up/${pkg}/package.json`);

  return [
    ...Object.keys(dependencies || {}),
    ...Object.keys(devDependencies || {})
  ].filter(dependency => /^@powered-up\//.test(dependency));
}

const touch = file => `touch ${file}`;
const rm = file => `rm -rf ${file}`;

const tslint = (pkg, files) => {
  const config = `@powered-up/${pkg}/tslint.json`;
  const project = `@powered-up/${pkg}/tsconfig.build.json`;
  const tsFiles = files.filter(file => /\.tsx?$/.test(file)).join(' ');

  if (tsFiles) {
    return `yarn tslint --config ${config} --project ${project} --format verbose ${tsFiles}`;
  }
};

const pkgs = readdirSync('@powered-up').filter(pkg => !/^\./.test(pkg));

rules.all = {
  phony: true,
  prereqs: [
    ...pkgs.filter(pkg => pkg !== 'demo').map(pkg => `docs/packages/${pkg}`),
    '@powered-up/demo/lib'
  ]
};

rules.clean = {
  phony: true,
  prereqs: ['@powered-up/*/src/**/*.{ts,tsx}'],
  recipe: (_, newerPrereqs) => [
    ...newerPrereqs.map(touch),
    rm('@powered-up/*/lib'),
    touch('package.json')
  ]
};

for (const pkg of pkgs) {
  rules[`@powered-up/${pkg}/lib`] = {
    prereqs: [
      'node_modules',
      `@powered-up/${pkg}/src/**/*.{ts,tsx}`,
      `@powered-up/${pkg}/tsconfig.build.json`,
      `@powered-up/${pkg}/tslint.json`,
      ...findLocalDependencies(pkg).map(dependency => `${dependency}/lib`)
    ],
    recipe: (target, newerPrereqs) => [
      tslint(pkg, newerPrereqs),
      `yarn tsc --project @powered-up/${pkg}/tsconfig.build.json`,
      touch(target)
    ]
  };

  rules[`@powered-up/${pkg}/tsconfig.build.json`] = {
    prereqs: [`@powered-up/${pkg}/tsconfig.json`],
    recipe: target => [touch(target)]
  };

  rules[`@powered-up/${pkg}/tsconfig.json`] = {
    prereqs: ['tsconfig.json'],
    recipe: target => [touch(target)]
  };

  rules[`@powered-up/${pkg}/tslint.json`] = {
    prereqs: ['tslint.json'],
    recipe: target => [touch(target)]
  };

  rules[`docs/packages/${pkg}`] = {
    prereqs: [
      'typedoc.js',
      `@powered-up/${pkg}/README.md`,
      `@powered-up/${pkg}/lib`
    ],
    recipe: target => [
      rm(target),
      `yarn typedoc --out ${target} --readme @powered-up/${pkg}/README.md ./@powered-up/${pkg}`,
      touch(target)
    ]
  };
}

rules.node_modules = {
  prereqs: [
    'autosrc.js',
    'package.json',
    '@powered-up/*/package.json',
    'yarn.lock'
  ],
  recipe: target => ['yarn install --check-files', touch(target)]
};
