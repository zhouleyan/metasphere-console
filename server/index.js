import Koa from 'koa';
import http from 'http';
import chalk from 'chalk';
import boxen from 'boxen';
import { info, warning, error } from './libs/logs.js';
import { registerShutdown } from './libs/sys.js';
import { getNetworkAddress } from './libs/net.js';
import { PORT, HTTP_MODE } from './libs/global.js';


global.MODE_DEV = process.env.NODE_ENV === 'development';

Koa.prototype.apply = function (module, ...rest) {
  module(this, ...rest);
  return this;
};

const app = new Koa();

const server = http.createServer(app.callback());

server.listen(PORT, (err) => {

  registerShutdown(() => server.close());

  const details = server.address();
  let localAddress = null;
  let networkAddress = null;

  if (typeof details === 'string') {
    localAddress = details;
  } else if (typeof details === 'object' && details.port) {
    const address = details.address === '::' ? 'localhost' : details.address;
    const ip = getNetworkAddress();

    localAddress = `${HTTP_MODE}://${address}:${details.port}`;
    networkAddress = ip ? `${HTTP_MODE}://${ip}:${details.port}` : null;
  }

  let message = chalk.green('Serving!');

  if (localAddress) {
    const prefix = networkAddress ? '- ' : '';
    const space = networkAddress ? '            ' : '  ';
    message += `\n\n${chalk.bold(`${prefix}Local:`)}${space}${localAddress}`;
  }

  if (networkAddress) {
    message += `\n${chalk.bold('- On Your Network:')}  ${networkAddress}`;
  }

  if (err) {
    return error(err);
  }
  /* eslint-disable no-console */
  console.log(boxen(message, {
    padding: 1,
    borderColor: 'green',
    margin: 1
  }));
});


(() => {
  registerShutdown(() => {
    console.log(`\n${info('Gracefully shutting down. Please wait...')}`);

    process.on('SIGINT', () => {
      console.log(`\n${warning('Force-closing all open sockets...')}`);
      process.exit(0);
    });
  });
})();
