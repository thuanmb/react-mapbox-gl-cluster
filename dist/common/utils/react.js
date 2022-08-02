"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isReactComponent = void 0;

var _react = _interopRequireDefault(require("react"));

var _lodash = _interopRequireDefault(require("lodash"));

const isFunctionComponent = component => component && _lodash.default.isFunction(component.type) && String(component.type).includes("createElement");
/**
 * Check if a component is a custom class React component or native DOM elements (e.g. div, span)
 * @param {*} component
 * @return {bool} True if the input component is React component
 */


const isReactComponent = component => {
  const isReactComponent = _lodash.default.get(component, "type.prototype.isReactComponent");

  const isPureReactComponent = _lodash.default.get(component, "type.prototype.isPureReactComponent");

  const isFunctionalComponent = isFunctionComponent(component);
  const isFragmentComponent = _lodash.default.toString(_lodash.default.get(component, "type")) === "Symbol(react.fragment)";
  const isReactMemoComponent = _lodash.default.toString(_lodash.default.get(component, "$$typeof")) === "Symbol(react.memo)";
  return isReactMemoComponent || /*#__PURE__*/_react.default.isValidElement(component) && (isReactComponent || isPureReactComponent || isFunctionalComponent || isFragmentComponent);
};

exports.isReactComponent = isReactComponent;