'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.isReactComponent = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isFunctionComponent = function isFunctionComponent(component) {
	return component && _lodash2.default.isFunction(component.type) && String(component.type).includes('createElement');
};

/**
 * Check if a component is a custom class React component or native DOM elements (e.g. div, span)
 * @param {*} component
 * @return {bool} True if the input component is React component
 */
var isReactComponent = exports.isReactComponent = function isReactComponent(component) {
	var isReactComponent = _lodash2.default.get(component, 'type.prototype.isReactComponent');
	var isPureReactComponent = _lodash2.default.get(component, 'type.prototype.isPureReactComponent');
	var isFunctionalComponent = isFunctionComponent(component);

	return _react2.default.isValidElement(component) && (isReactComponent || isPureReactComponent || isFunctionalComponent);
};