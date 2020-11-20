"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkPropsChange = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var checkPropsChange = function checkPropsChange(props, nextProps, keys) {
  var equalityChecker = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _lodash.default.isEqual;

  var propsToCheck = _lodash.default.pick(props, keys);

  var nextPropsToCheck = _lodash.default.pick(nextProps, keys);

  if (_lodash.default.isFunction(equalityChecker)) {
    return equalityChecker(propsToCheck, nextPropsToCheck);
  }

  return propsToCheck === nextPropsToCheck;
};

exports.checkPropsChange = checkPropsChange;