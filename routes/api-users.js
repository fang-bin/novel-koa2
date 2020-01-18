const router = require('koa-router')()

router.prefix('/api/users');

// 添加用户
router.post('/add', function (ctx, next) {
  console.log(ctx.request.body);
})


module.exports = router
