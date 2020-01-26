const router = require('koa-router')();
const user = require('../controller/user');

router.prefix('/api/user');

// 验证注册用户信息是否重复
router.post('/validate', user.validateUser)

// 注册用户
router.post('/sign', user.signInUser);

// 登录
router.post('/login', user.loginInUser);

// 获取加密的公钥
router.get('/key', user.getKey);

module.exports = router
