const path = require('path');
const cwd = process.cwd();
const p = path.resolve(cwd, __dirname);
console.log(p);

console.log(path.resolve(__dirname, '../'));
