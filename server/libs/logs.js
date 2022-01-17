const chalk = require('chalk');

const info = (message) => chalk.magenta(message);
const warning = (message) => chalk.yellow(message);
const error = (message) => chalk.red(message);
const green = (message) => chalk.green(message);
const bold = (message) => chalk.bold(message);

module.exports = {
  warning,
  info,
  error,
  green,
  bold,
};
