'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('../../common/utils');

var _MarkerLayer2 = require('../MarkerLayer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SpiderifierElement = function (_MarkerLayer) {
	_inherits(SpiderifierElement, _MarkerLayer);

	function SpiderifierElement(props) {
		_classCallCheck(this, SpiderifierElement);

		var _this = _possibleConstructorReturn(this, (SpiderifierElement.__proto__ || Object.getPrototypeOf(SpiderifierElement)).call(this, props));

		_this.setChildRef = function (childRef) {
			return _this.childRef = _this.childRef || childRef;
		};

		_this.state = {
			animateClass: ''
		};
		return _this;
	}

	_createClass(SpiderifierElement, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			var animate = this.props.animate;

			this.setState({
				animateClass: (0, _classnames2.default)({ 'animate initial': animate })
			});
		}
	}, {
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(nextProps, nextState) {
			return !_lodash2.default.isEqual(this.props, nextProps) || !_lodash2.default.isEqual(this.state, nextState);
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this2 = this;

			_get(SpiderifierElement.prototype.__proto__ || Object.getPrototypeOf(SpiderifierElement.prototype), 'componentDidMount', this).call(this);
			if (this._animationEnabled()) {
				_lodash2.default.delay(function () {
					return _this2.setState({ animateClass: 'animate' });
				}, 0);
			}
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate() {
			this.attachChildren();
		}
	}, {
		key: 'getStyle',
		value: function getStyle(props) {
			var shouldRenderLeg = props.shouldRenderLeg,
			    x = props.x,
			    y = props.y,
			    style = props.style;


			var marginLeft = '';
			var marginTop = '';
			var transitionDelay = '';
			if (shouldRenderLeg) {
				marginLeft = x + 'px';
				marginTop = y + 'px';
				transitionDelay = this._getTransitionDelay(props);
			}

			return _extends({}, style, {
				marginLeft: marginLeft,
				marginTop: marginTop,
				transitionDelay: transitionDelay
			});
		}
	}, {
		key: 'getContainerClassName',
		value: function getContainerClassName(props) {
			var animateClass = this.state.animateClass;
			var className = props.className,
			    y = props.y;

			return (0, _classnames2.default)('spidered-marker', className, animateClass, {
				top: y <= 0,
				bottom: y > 0
			});
		}
	}, {
		key: 'getContent',
		value: function getContent(props) {
			var shouldRenderLeg = props.shouldRenderLeg;

			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					'div',
					{ className: 'icon-div' },
					this._getDecorateChildren(props)
				),
				shouldRenderLeg && _react2.default.createElement('div', {
					className: 'line-div',
					style: this._getLegStyles(props)
				})
			);
		}
	}, {
		key: 'getOffset',
		value: function getOffset() {
			var _props = this.props,
			    shouldRenderLeg = _props.shouldRenderLeg,
			    x = _props.x,
			    y = _props.y;

			return shouldRenderLeg ? [x, y] : [0, 0];
		}
	}, {
		key: 'getProperties',
		value: function getProperties() {
			if (this.props.children) {
				return this.props.children.props.properties;
			}

			return {};
		}
	}, {
		key: '_animationEnabled',
		value: function _animationEnabled() {
			var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
			var animate = props.animate;

			return animate;
		}
	}, {
		key: '_getDecorateChildren',
		value: function _getDecorateChildren(props) {
			var _this3 = this;

			var children = props.children,
			    coordinates = props.coordinates;

			return _react2.default.Children.map(children, function (child) {
				if ((0, _utils.isReactComponent)(child)) {
					return _react2.default.cloneElement(child, {
						coordinates: coordinates,
						offset: _this3.getOffset(),
						ref: _this3.setChildRef,
						mapBox: _this3.context.map
					});
				}

				return child;
			});
		}
	}, {
		key: '_getLegStyles',
		value: function _getLegStyles(props) {
			var legLength = props.legLength,
			    angle = props.angle,
			    legStyles = props.legStyles;


			return _extends({}, legStyles, {
				height: legLength,
				transform: 'rotate(' + (angle - Math.PI / 2) + 'rad)',
				transitionDelay: this._getTransitionDelay(props)
			});
		}
	}, {
		key: '_getTransitionDelay',
		value: function _getTransitionDelay(props) {
			var animate = props.animate,
			    transitionDelay = props.transitionDelay;


			return animate ? transitionDelay + 's' : '';
		}
	}]);

	return SpiderifierElement;
}(_MarkerLayer2.MarkerLayer);

SpiderifierElement.displayName = 'SpiderifierElement';
SpiderifierElement.propTypes = _extends({}, _MarkerLayer2.MarkerLayer.propTypes, {
	angle: _propTypes2.default.number,
	animate: _propTypes2.default.bool,
	legLength: _propTypes2.default.number,
	legStyles: _propTypes2.default.object,
	index: _propTypes2.default.number,
	shouldRenderLeg: _propTypes2.default.bool,
	transitionDelay: _propTypes2.default.number,
	x: _propTypes2.default.number,
	y: _propTypes2.default.number
});

SpiderifierElement.defaultProps = {
	animate: true,
	transitionDelay: 200
};

exports.default = SpiderifierElement;