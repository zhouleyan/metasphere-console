const glob = require('glob');

const entries = glob.sync('../../src/**/intl/*.json');

console.log(entries);
