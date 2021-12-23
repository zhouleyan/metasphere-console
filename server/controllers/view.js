const { getTitle } = require('../libs/utils');

const renderView = async (ctx) => {
  await renderIndex(ctx);
};

const renderIndex = async (ctx) => {
  await ctx.render('index', {
    isDev: global.MODE_DEV,
    title: getTitle(),
    favicon: '/assets/favicon.ico'
  });
};

module.exports = {
  renderView
};
