'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isReactComponent = exports.getExactEventHandlerName = exports.extractEventHandlers = exports.checkPropsChange = undefined;

var _event = require('./event');

var _props = require('./props');

var _react = require('./react');

exports.checkPropsChange = _props.checkPropsChange;
exports.extractEventHandlers = _event.extractEventHandlers;
exports.getExactEventHandlerName = _event.getExactEventHandlerName;
exports.isReactComponent = _react.isReactComponent;