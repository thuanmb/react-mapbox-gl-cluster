'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _mapboxGl = require('mapbox-gl');

var _mapboxGl2 = _interopRequireDefault(_mapboxGl);

var _utils = require('../../common/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MarkerLayer = function (_Component) {
	_inherits(MarkerLayer, _Component);

	function MarkerLayer() {
		var _ref;

		var _temp, _this, _ret;

		_classCallCheck(this, MarkerLayer);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = MarkerLayer.__proto__ || Object.getPrototypeOf(MarkerLayer)).call.apply(_ref, [this].concat(args))), _this), _this._disableMapDragPan = function () {
			var map = _this.context.map;

			if (map) {
				map.dragPan.disable();
			}
		}, _this._enableMapDragPan = function () {
			var map = _this.context.map;

			if (map) {
				map.dragPan.enable();
			}
		}, _this._generateEventHander = function (eventName) {
			return function (e) {
				var handler = _this.props[eventName];
				if (_lodash2.default.isFunction(handler)) {
					var coordinates = _this.props.coordinates;

					var properties = _this.getProperties();
					handler(properties, coordinates, _this.getOffset(), e);
				}
			};
		}, _temp), _possibleConstructorReturn(_this, _ret);
	}

	_createClass(MarkerLayer, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var node = this.attachChildren(this.props);
			this.layer = new _mapboxGl2.default.Marker(node).setLngLat(this.props.coordinates).addTo(this.context.map);
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			if (nextProps.coordinates !== this.props.coordinates) {
				this.layer.setLngLat(nextProps.coordinates);
			}
			if (nextProps.children !== this.props.children || (0, _utils.checkPropsChange)(this.props, nextProps, ['style', 'className'])) {
				this.attachChildren(nextProps);
			}
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			this.layer.remove();
			delete this.layer;
		}
	}, {
		key: 'attachChildren',
		value: function attachChildren() {
			var _this2 = this;

			var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
			var children = props.children;


			if (children) {
				if (!this.element) {
					this.element = document.createElement('div');
				} else {
					this._unbindEvents();
				}

				var style = this.getStyle(this.props);
				this.element.className = this.getContainerClassName(props);
				Object.keys(style).forEach(function (s) {
					_this2.element.style[s] = style[s];
				});
				this._bindEvents();

				var content = this.getContent(props);
				_reactDom2.default.render(content, this.element);
			}

			return this.element;
		}
	}, {
		key: 'getContainerClassName',
		value: function getContainerClassName(props) {
			return 'mapboxgl-marker ' + props.className;
		}
	}, {
		key: 'getContent',
		value: function getContent(props) {
			var children = props.children;

			return _react2.default.createElement(
				'div',
				{ className: 'nio-marker-content f-width f-height' },
				children
			);
		}
	}, {
		key: 'getProperties',
		value: function getProperties() {
			return this.props.properties;
		}
	}, {
		key: 'getOffset',
		value: function getOffset() {
			return [0, 0];
		}
	}, {
		key: 'getStyle',
		value: function getStyle(props) {
			return _lodash2.default.clone(props.style) || {};
		}
	}, {
		key: '_bindEvents',
		value: function _bindEvents() {
			var _this3 = this;

			var events = (0, _utils.extractEventHandlers)(this.props);
			this.realHandlers = {};
			_lodash2.default.forEach(events, function (handler, name) {
				var realHandler = _this3._generateEventHander(name);
				_this3.element.addEventListener((0, _utils.getExactEventHandlerName)(name), realHandler);
				_this3.realHandlers[name] = realHandler;
			});
			this.element.addEventListener('mousedown', this._disableMapDragPan);
			this.element.addEventListener('mouseup', this._enableMapDragPan);
		}
	}, {
		key: '_unbindEvents',
		value: function _unbindEvents() {
			var _this4 = this;

			var events = (0, _utils.extractEventHandlers)(this.props);
			this.element.removeEventListener('mousedown', this._disableMapDragPan);
			this.element.removeEventListener('mouseup', this._enableMapDragPan);
			_lodash2.default.forEach(events, function (handler, name) {
				var realHandler = _this4.realHandlers[name];
				_this4.element.removeEventListener((0, _utils.getExactEventHandlerName)(name), realHandler);
			});

			delete this.realHandlers;
		}
	}, {
		key: 'render',
		value: function render() {
			return null;
		}
	}]);

	return MarkerLayer;
}(_react.Component);

MarkerLayer.contextTypes = {
	map: _propTypes2.default.object
};


MarkerLayer.displayName = 'MarkerLayer';

MarkerLayer.propTypes = {
	/**
  * (required): [number, number] Display the Marker at the given position
  */
	coordinates: _propTypes2.default.array.isRequired,

	/**
  * Properties of each Marker, will be passed back when events trigged
  */
	properties: _propTypes2.default.oneOfType([_propTypes2.default.array.isRequired, _propTypes2.default.object.isRequired, _propTypes2.default.string.isRequired]),

	/**
  * Apply the className to the container of the Marker
  */
	className: _propTypes2.default.string,

	/**
  * Apply style to the Marker container
  */
	style: _propTypes2.default.object,

	/**
  * Child node(s) of the component, to be rendered as custom Marker
  */
	children: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.arrayOf(_propTypes2.default.node)]),

	/**
  * [Optional] The click event handler
  */
	onClick: _propTypes2.default.func,

	/**
  * [Optional] The mouse down event handler
  */
	onMouseDown: _propTypes2.default.func,

	/**
  * [Optional] The mouse enter event handler
  */
	onMouseEnter: _propTypes2.default.func,

	/**
  * [Optional] The mouse leave event handler
  */
	onMouseLeave: _propTypes2.default.func,

	/**
  * [Optional] The mouse move event handler
  */
	onMouseMove: _propTypes2.default.func,

	/**
  * [Optional] The mouse out event handler
  */
	onMouseOut: _propTypes2.default.func,

	/**
  * [Optional] The mouse over event handler
  */
	onMouseOver: _propTypes2.default.func,

	/**
  * [Optional] The mouse up event handler
  */
	onMouseUp: _propTypes2.default.func
};

exports.default = MarkerLayer;