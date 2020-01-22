# API

**通用错误返回**

    {
      stack: [errorStack],
      message: [errorMessage],
      name: [errorName],
      status: [errorCode],  //一般根据此来判断错误情况
    }

| 通用错误码 | name | 含义 |
| --- | --- | --- |
| 400 | PARAMS_NOT_CONFORM | 参数报错（多传参数或者格式不正确等）|
| 500 | - | 服务器内部错误 |

下面表格中 ~~ 即是通用规则

其中一些具体的错误分析需要区分 name

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

根据传入的字段验证该字段是否有重复,一次只能传入一个字段，多个字段会直接返回400

**无报错返回**

    {
      status: 200,
      message: '成功',
      name: 'SUCCESS',
      data: true,   //true ==> 没有重复信息   false ==>有重复信息
    }

**错误返回**

| 错误码 | name | 含义 |
| --- | --- | --- |
| 400 | ~~ | ~~ |


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

**无报错返回**

    {
      status: 200,
      message: '成功',
      name: 'SUCCESS',
      data: true,   //true ==> 注册成功，失败会直接走错误返回
    }

**错误返回**

| 错误码 | 含义 |
| --- | --- |
| 400 | PARAMS_EXIST | 参数重复 |
| 400 | ~~ | ~~ |


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

**无报错返回**

    {
      status: 200,
      message: '成功',
      name: 'SUCCESS',
      data: true,   //true ==> 登录成功，失败会直接走错误返回
    }

**错误返回**

| 错误码 | name | 含义 |
| --- | --- | --- |
| 403 | NOT_USER | 用户不存在 |
| 403 | PASSWORD_ERROR | 密码不正确 |
| 400 | ~~ | ~~ |

### 忘记密码

1. 输入邮箱，**向邮箱发送验证码**

2. 输入验证码，**校验验证码**

3. 输入新密码，**更新密码**