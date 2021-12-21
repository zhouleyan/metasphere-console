const compress = require('koa-compress');
const { constants } = require('zlib');

// const { getServerConfig } = require('../libs/config');

// const serverConfig = getServerConfig();

module.exports = function (app) {
  app.use(
    compress({
      threshold: 2048,
      flush: constants.Z_SYNC_FLUSH
    })
  );

  // serve static files
  // const httpStatic = serverConfig.http.static[process.env.NODE_ENV];
};
