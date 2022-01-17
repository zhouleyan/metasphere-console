const { getTitle, getManifest } = require('../libs/utils');

const renderView = async (ctx) => {
  await renderIndex(ctx);
};

const renderIndex = async (ctx) => {
  const manifest = getManifest('main');
  await ctx.render('index', {
    manifest,
    isDev: global.MODE_DEV,
    title: getTitle(),
    hostname: ctx.hostname,
    favicon: '/assets/favicon.ico',
  });
};

module.exports = {
  renderView,
};
