#!/bin/sh

set -e

echo "//registry.npmjs.org/:_authToken=\${NPM_TOKEN}" > .npmrc

npx lerna publish from-git --yes
