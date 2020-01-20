module.exports = {
  nickName: /^[\u4e00-\u9fa5|\w{4,12}]/,
  account: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/,
  email: /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/,
}