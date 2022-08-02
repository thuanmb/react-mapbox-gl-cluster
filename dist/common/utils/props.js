"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkPropsChange = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

const checkPropsChange = function (props, nextProps, keys) {
  let equalityChecker = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _lodash.default.isEqual;

  const propsToCheck = _lodash.default.pick(props, keys);

  const nextPropsToCheck = _lodash.default.pick(nextProps, keys);

  if (_lodash.default.isFunction(equalityChecker)) {
    return equalityChecker(propsToCheck, nextPropsToCheck);
  }

  return propsToCheck === nextPropsToCheck;
};

exports.checkPropsChange = checkPropsChange;