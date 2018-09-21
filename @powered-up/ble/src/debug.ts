import createDebug from 'debug';

// tslint:disable-next-line:no-require-imports no-var-requires
const pkg = require('../package');

export const debug = createDebug(`${pkg.name}`);
