const getType = data => Object.prototype.toString.call(data).slice(8, -1);

const isArray = data => getType(data) === 'Array';

const isUndefined = data => getType(data) === 'Undefined';

const isNull = data => getType(data) === 'Null';

const isFunction = data => getType(data) === 'Function';

const isObject = data => getType(data) === 'Object';

module.exports = {
  getType,
  isArray,
  isUndefined,
  isNull,
  isFunction,
  isObject,
}