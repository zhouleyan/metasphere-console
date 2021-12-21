import chalk from 'chalk';

const info = (message) => chalk.magenta(message);
const warning = (message) => chalk.yellow(message);
const error = (message) => chalk.red(message);

export {
  warning,
  info,
  error
};
