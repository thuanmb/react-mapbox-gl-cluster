"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isReactComponent = void 0;

var _react = _interopRequireDefault(require("react"));

var _lodash = _interopRequireDefault(require("lodash"));

var isFunctionComponent = function isFunctionComponent(component) {
  return component && _lodash.default.isFunction(component.type) && String(component.type).includes("createElement");
};
/**
 * Check if a component is a custom class React component or native DOM elements (e.g. div, span)
 * @param {*} component
 * @return {bool} True if the input component is React component
 */


var isReactComponent = function isReactComponent(component) {
  var isReactComponent = _lodash.default.get(component, "type.prototype.isReactComponent");

  var isPureReactComponent = _lodash.default.get(component, "type.prototype.isPureReactComponent");

  var isFunctionalComponent = isFunctionComponent(component);
  var isFragmentComponent = _lodash.default.toString(_lodash.default.get(component, "type")) === "Symbol(react.fragment)";
  var isReactMemoComponent = _lodash.default.toString(_lodash.default.get(component, "$$typeof")) === "Symbol(react.memo)";
  return isReactMemoComponent || /*#__PURE__*/_react.default.isValidElement(component) && (isReactComponent || isPureReactComponent || isFunctionalComponent || isFragmentComponent);
};

exports.isReactComponent = isReactComponent;