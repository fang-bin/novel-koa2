const apiUser = require('./api-users');

module.exports = (app) => {
  app.use(apiUser.routes(), apiUser.allowedMethods());
}
