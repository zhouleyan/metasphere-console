const Router = require('@koa/router');

const { renderView } = require('./controllers/view');

const router = new Router();

router
  .get('/api', (ctx) => {
    ctx.body = 'Hello, World!';
  })
  .all('(.*)', renderView);

module.exports = router;
