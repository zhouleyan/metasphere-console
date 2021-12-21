const Koa = require('koa');
const http = require('http');
const boxen = require('boxen');
const { info, warning, error, green, bold } =  require('./libs/logs');
const { registerShutdown } = require('./libs/sys');
const { getNetworkAddress } = require('./libs/net');
const { PORT, HTTP_MODE } = require('./libs/config');

const boot = require('./components/boot');


global.MODE_DEV = process.env.NODE_ENV === 'development';

Koa.prototype.apply = function (module, ...rest) {
  module(this, ...rest);
  return this;
};

const app = new Koa();

app.keys = ['ms->_<'];

app
  .apply(boot);

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

  let message = green('Serving!');

  if (localAddress) {
    const prefix = networkAddress ? '- ' : '';
    const space = networkAddress ? '            ' : '  ';
    message += `\n\n${bold(`${prefix}Local:`)}${space}${localAddress}`;
  }

  if (networkAddress) {
    message += `\n${bold('- On Your Network:')}  ${networkAddress}`;
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
