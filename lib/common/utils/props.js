'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkPropsChange = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var checkPropsChange = exports.checkPropsChange = function checkPropsChange(props, nextProps, keys) {
  var equalityChecker = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _lodash2.default.isEqual;

  var propsToCheck = _lodash2.default.pick(props, keys);
  var nextPropsToCheck = _lodash2.default.pick(nextProps, keys);

  if (_lodash2.default.isFunction(equalityChecker)) {
    return equalityChecker(propsToCheck, nextPropsToCheck);
  }

  return propsToCheck === nextPropsToCheck;
};