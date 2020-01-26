const NodeRSA = require('node-rsa');
const key = new NodeRSA({ b: 1024, });
key.setOptions({encryptionScheme: 'pkcs1'}); // 必须加上，加密方式问题。

var publicKey = key.exportKey('public');
var privateKey = key.exportKey('private');

module.exports = {
  key,
  publicKey,
  privateKey,
};