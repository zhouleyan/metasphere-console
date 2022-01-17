const compress = require('koa-compress');
const mount = require('koa-mount');
const render = require('koa-ejs');
const serve = require('koa-static');
const { constants } = require('zlib');

const { getHttpStatic, root, HTTP_MODE } = require('../libs/utils');

module.exports = function (app) {
  app.use(
    compress({
      threshold: 2048,
      flush: constants.Z_SYNC_FLUSH,
    })
  );

  // serve static files
  const httpStatic = getHttpStatic()[process.env.NODE_ENV] || {};
  for (const [k, v] of Object.entries(httpStatic)) {
    app.use(mount(k, serve(root(v), { index: false, maxage: 604800000 })));
  }

  if (global.MODE_DEV) {
    app.use(async (ctx, next) => {
      if (
        /(\.hot-update\.)|(\.(ttf|otf|eot|woff2?)(\?.+)?$)|(\.js$)/.test(
          ctx.url
        )
      ) {
        ctx.redirect(`${HTTP_MODE}://${ctx.hostname}:8001${ctx.url}`);
      } else {
        await next();
      }
    });
  }

  render(app, {
    root: root('server/views'),
    cache: !global.MODE_DEV,
    layout: false,
    viewExt: 'ejs',
  });
};
