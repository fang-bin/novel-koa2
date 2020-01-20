const Koa = require('koa');
const app = new Koa();
const json = require('koa-json');
const onerror = require('koa-onerror');
const body = require('koa-body');
const logger = require('koa-logger');
const routes = require('./routes');

global.Promise = require('bluebird');

// const index = require('./routes/index')
// const users = require('./routes/users')

// error handler
onerror(app)

app.use(async (ctx, next) => {
  const { origin, Origin, referer, Referer, } = ctx.request.headers;
  const allowOrigin = origin || Origin || referer || Referer || '*';
  ctx.response.set('Access-Control-Allow-Origin', allowOrigin);
  ctx.response.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  ctx.response.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  ctx.response.set('Access-Control-Allow-Credentials', true);
  ctx.response.set('X-Powered-By', 'Koa2');
  if (ctx.method === 'OPTIONS'){
    ctx.status = 200;
  }else {
    await next();
  }
});

// middlewares
app.use(body({
  multipart: true,
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/static'));

// app.use(views(__dirname + '/views', {
//   extension: 'pug'
// }))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
routes(app);

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
