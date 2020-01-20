# API

## 用户

### 验证注册用户信息是否重复

**URL**
`/api/user/validate`

**METHOD**
`POST`

**入参**
| 字段 | 类型 | 是否必传 | 含义 |
| --- | --- | --- | --- |
| nick_name | String | 否 | 昵称 |
| account | String | 否 | 账号 |
| email | String | 否 | 邮箱 |

根据传入的字段验证该字段是否有重复

**返回**

    {
      status: 0,
      message: 'nick_name参数不符合规范',
      type: 'PARAMS_ERROR',
      data: null,
    }

    {
      status: 1,
      message: '成功',
      type: 'SUCCESS',
      data: true,   //true ==> 没有重复信息   false ==>有重复信息
    }

### 注册用户

**URL**
`/api/user/sign`

**METHOD**
`POST`

**入参**
| 字段 | 类型 | 是否必传 | 含义 |
| --- | --- | --- | --- |
| nick_name | String | 是 | 昵称 |
| account | String | 是 | 账号 |
| email | String | 是 | 邮箱 |
| password | String | 是 | 密码(加密) |

**返回**

    {
      status: 0,
      message: 'nick_name参数不符合规范',
      type: 'PARAMS_ERROR',
      data: null,
    }

    {
      status: 1,
      message: '成功',
      type: 'SUCCESS',
      data: true,   //true ==> 注册成功
    }

### 用户登录

**URL**
`/api/user/login`

**METHOD**
`POST`

**入参**
| 字段 | 类型 | 是否必传 | 含义 |
| --- | --- | --- | --- |
| account | String | 是 | 账号 |
| password | String | 是 | 密码(加密) |

**返回**

    {
      status: 0,
      message: '该用户还未注册，请先注册!',
      type: 'NOT_REGISTER',
      data: null,
    }

    {
      status: 1,
      message: '成功',
      type: 'SUCCESS',
      data: true,   //true ==> 登录成功
    }

### 忘记密码

1. 输入邮箱，**向邮箱发送验证码**

2. 输入验证码，**校验验证码**

3. 输入新密码，**更新密码**