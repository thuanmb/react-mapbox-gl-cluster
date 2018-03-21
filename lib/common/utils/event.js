'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getExactEventHandlerName = exports.extractEventHandlers = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EVENT_PREFIX = /^on(.+)$/i;

var extractEventHandlers = exports.extractEventHandlers = function extractEventHandlers(props) {
	return _lodash2.default.reduce(Object.keys(props), function (res, prop) {
		var cb = props[prop];
		if (EVENT_PREFIX.test(prop) && _lodash2.default.isFunction(cb)) {
			var key = prop.replace(EVENT_PREFIX, function (match, p) {
				return 'on' + p;
			});
			res[key] = cb;
		}
		return res;
	}, {});
};

var getExactEventHandlerName = exports.getExactEventHandlerName = function getExactEventHandlerName(event) {
	if (!_lodash2.default.isString(event)) {
		return event;
	}

	return event.replace('on', '').toLowerCase();
};