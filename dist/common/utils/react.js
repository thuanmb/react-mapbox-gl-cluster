import React from "react";
import _ from "lodash";

var isFunctionComponent = function isFunctionComponent(component) {
  return component && _.isFunction(component.type) && String(component.type).includes("createElement");
};
/**
 * Check if a component is a custom class React component or native DOM elements (e.g. div, span)
 * @param {*} component
 * @return {bool} True if the input component is React component
 */


export var isReactComponent = function isReactComponent(component) {
  var isReactComponent = _.get(component, "type.prototype.isReactComponent");

  var isPureReactComponent = _.get(component, "type.prototype.isPureReactComponent");

  var isFunctionalComponent = isFunctionComponent(component);
  var isFragmentComponent = _.toString(_.get(component, "type")) === "Symbol(react.fragment)";
  var isReactMemoComponent = _.toString(_.get(component, "$$typeof")) === "Symbol(react.memo)";
  return isReactMemoComponent || React.isValidElement(component) && (isReactComponent || isPureReactComponent || isFunctionalComponent || isFragmentComponent);
};