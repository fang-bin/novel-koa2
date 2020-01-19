class Api {
  constructor() {}
  fail (message, type) {
    return {
      status: 0,
      message,
      type,
      data: null,
    };
  }
  success (data = null) {
    return {
      status: 1,
      message: '成功',
      type: 'SUCCESS',
      data,
    };
  }
}

module.exports = Api;