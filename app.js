const Koa = require('koa');
const app = new Koa();
const json = require('koa-json');
// const onerror = require('koa-onerror');
const onerror = require('koa-json-error');
const body = require('koa-body');
const logger = require('koa-logger');
const routes = require('./routes');
const cors = require('koa2-cors');
const contextUtils = require('./utils/context');

global.Promise = require('bluebird');

// 扩展context方法
Object.keys(contextUtils).forEach(key => {
  app.context[key] = contextUtils[key];
});

// error handler
app.use(onerror({
  postFormat: (e, {
    stack,
    ...rest
  }) => (process.env.NODE_ENV !== 'development' ? rest : {
    stack,
    ...rest
  }),
}))

app.use(cors({
  origin: function (ctx){
    const { origin, Origin, referer, Referer, } = ctx.request.headers;
    return origin || Origin || referer || Referer || '*';
  },
  credentials: true,
  allowMethods: ['PUT', 'POST', 'GET', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(async (ctx, next) => {
  ctx.response.set('X-Powered-By', 'Koa2');
  ctx.response.set('Server', 'Node8+');
  if (ctx.method === 'OPTIONS'){
    ctx.status = 200;
  }else {
    await next();
  }
});

// middlewares
app.use(body({
  multipart: true,
  formidable: {
    keepExtensions: true, // 保持文件的后缀
    maxFileSize: 2000 * 1024 * 1024 // 设置上传文件大小最大限制，默认20M
  },
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/static'));

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
