"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExactEventHandlerName = exports.extractEventHandlers = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

const EVENT_PREFIX = /^on(.+)$/i;

const extractEventHandlers = function (props) {
  let eventPrefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EVENT_PREFIX;
  return _lodash.default.reduce(Object.keys(props), (res, prop) => {
    const cb = props[prop];

    if (eventPrefix.test(prop) && _lodash.default.isFunction(cb)) {
      const key = prop.replace(eventPrefix, (match, p) => `on${p}`);
      res[key] = cb;
    }

    return res;
  }, {});
};

exports.extractEventHandlers = extractEventHandlers;

const getExactEventHandlerName = event => {
  if (!_lodash.default.isString(event)) {
    return event;
  }

  return event.replace("on", "").toLowerCase();
};

exports.getExactEventHandlerName = getExactEventHandlerName;