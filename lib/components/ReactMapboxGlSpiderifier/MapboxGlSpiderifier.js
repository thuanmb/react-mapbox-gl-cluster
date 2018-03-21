'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('../../common/utils');

var _SpiderifierElement = require('./SpiderifierElement');

var _SpiderifierElement2 = _interopRequireDefault(_SpiderifierElement);

var _constants = require('./constants');

require('./MapboxGlSpiderifier.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MapboxGlSpiderifier = function (_Component) {
	_inherits(MapboxGlSpiderifier, _Component);

	function MapboxGlSpiderifier(props) {
		_classCallCheck(this, MapboxGlSpiderifier);

		var _this = _possibleConstructorReturn(this, (MapboxGlSpiderifier.__proto__ || Object.getPrototypeOf(MapboxGlSpiderifier)).call(this, props));

		_this.state = {
			spiderParams: null
		};
		return _this;
	}

	_createClass(MapboxGlSpiderifier, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			this.setState({ spiderParams: this._generateSpiderParams() });
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			this._updateSpiderParams(nextProps);
		}
	}, {
		key: '_generateCircleParams',
		value: function _generateCircleParams(props) {
			var _this2 = this;

			var count = this._getMarkersCount(props);
			var circleFootSeparation = props.circleFootSeparation;

			var circumference = circleFootSeparation * (2 + count);
			var legLength = circumference / _constants.TwoPi; // = radius from circumference
			var angleStep = _constants.TwoPi / count;

			return _lodash2.default.times(count, function (index) {
				var angle = index * angleStep;
				return _extends({}, _this2._getSpiderPosition(props, legLength, angle), {
					index: index,
					transitionDelay: _this2._getTransitionDelay(props, index)
				});
			});
		}
	}, {
		key: '_generateSpiderParams',
		value: function _generateSpiderParams() {
			var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
			var circleSpiralSwitchover = props.circleSpiralSwitchover,
			    animate = props.animate,
			    animationSpeed = props.animationSpeed,
			    showingLegs = props.showingLegs;

			var count = this._getMarkersCount(props);
			if (!count) {
				return null;
			}

			var shouldRenderLeg = count > 1 || showingLegs;
			var markersProps = count >= circleSpiralSwitchover ? this._generateSpiralParams(props) : this._generateCircleParams(props);

			return markersProps.map(function (markerProp) {
				return _extends({}, markerProp, {
					animate: animate,
					animationSpeed: animationSpeed,
					shouldRenderLeg: shouldRenderLeg
				});
			});
		}
	}, {
		key: '_generateSpiralParams',
		value: function _generateSpiralParams(props) {
			var _this3 = this;

			var count = this._getMarkersCount(props);
			var spiralFootSeparation = props.spiralFootSeparation,
			    spiralLengthFactor = props.spiralLengthFactor,
			    spiralLengthStart = props.spiralLengthStart;


			var angle = 0;
			var legLength = spiralLengthStart;
			return _lodash2.default.times(count, function (index) {
				angle = angle + (spiralFootSeparation / legLength + index * 0.0005);
				legLength = legLength + _constants.TwoPi * spiralLengthFactor / angle;
				return _extends({}, _this3._getSpiderPosition(props, legLength, angle), {
					index: index,
					transitionDelay: _this3._getTransitionDelay(props, index),
					style: {
						zIndex: count - index
					}
				});
			});
		}
	}, {
		key: '_getNotNullChildren',
		value: function _getNotNullChildren() {
			var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
			var children = props.children;

			return _react.Children.toArray(children).filter(function (child) {
				return child !== null;
			});
		}
	}, {
		key: '_getMarkersCount',
		value: function _getMarkersCount(props) {
			var children = this._getNotNullChildren(props);
			return children.length;
		}
	}, {
		key: '_getSpiderifierMarkers',
		value: function _getSpiderifierMarkers() {
			var spiderParams = this.state.spiderParams;

			if (!spiderParams) {
				return null;
			}

			var coordinates = this.props.coordinates;

			var eventHanders = (0, _utils.extractEventHandlers)(this.props);
			return this._getNotNullChildren().map(function (child, index) {
				var params = spiderParams[index];
				var legStyles = child.props.legStyles;

				if (params) {
					return _react2.default.createElement(
						_SpiderifierElement2.default,
						_extends({
							key: index,
							coordinates: coordinates,
							legStyles: legStyles
						}, params, eventHanders),
						child
					);
				}

				return null;
			});
		}
	}, {
		key: '_getSpiderPosition',
		value: function _getSpiderPosition(props, legLength, angle) {
			var transformSpiderLeft = props.transformSpiderLeft,
			    transformSpiderTop = props.transformSpiderTop;

			return {
				angle: angle,
				legLength: legLength - transformSpiderLeft,
				x: legLength * Math.cos(angle) + transformSpiderLeft,
				y: legLength * Math.sin(angle) + transformSpiderTop
			};
		}
	}, {
		key: '_getTransitionDelay',
		value: function _getTransitionDelay(props, index) {
			var markersCount = this._getMarkersCount(props);
			var animationSpeed = props.animationSpeed;

			return animationSpeed / 1000 / markersCount * index;
		}
	}, {
		key: '_updateSpiderParams',
		value: function _updateSpiderParams(nextProps) {
			if ((0, _utils.checkPropsChange)(this.props, nextProps, ['children', 'circleFootSeparation', 'circleSpiralSwitchover', 'spiralFootSeparation', 'spiralLengthStart', 'spiralLengthFactor', 'transformSpiderLeft', 'showingLegs'], _lodash2.default.isEqual)) {
				this.setState({
					spiderParams: this._generateSpiderParams(nextProps)
				});
			}
		}
	}, {
		key: 'render',
		value: function render() {
			return this._getSpiderifierMarkers();
		}
	}]);

	return MapboxGlSpiderifier;
}(_react.Component);

MapboxGlSpiderifier.displayName = 'MapboxGlSpiderifier';
MapboxGlSpiderifier.propTypes = {
	/**
  * (required): [number, number] Display the Spiderifier at the given position
  */
	coordinates: _propTypes2.default.array.isRequired,

	/**
  * Show spiral instead of circle from this marker count upwards
  * 0 -> always spiral; Infinity -> always circle
  */
	circleSpiralSwitchover: _propTypes2.default.number,

	/**
  * Related to circumference of circle
  */
	circleFootSeparation: _propTypes2.default.number,

	/**
  * Related to size of spiral
  */
	spiralFootSeparation: _propTypes2.default.number,

	/**
  * Related to size of spiral
  */
	spiralLengthStart: _propTypes2.default.number,
	/**
  * Related to size of spiral
  */
	spiralLengthFactor: _propTypes2.default.number,

	/**
  * To enable animate the spiral
  */
	animate: _propTypes2.default.bool,

	/**
  * Animation speed in milliseconds
  */
	animationSpeed: _propTypes2.default.number,

	/**
  * [Optional] The margin in left side of each spider
  */
	transformSpiderLeft: _propTypes2.default.number,

	/**
  * [Optional] The margin in top of each spider
  */
	transformSpiderTop: _propTypes2.default.number,

	/**
  * [Optional] Indicate if the legs should be shown even when the spiderifier only have one spider element
  */
	showingLegs: _propTypes2.default.bool,

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

MapboxGlSpiderifier.defaultProps = {
	circleSpiralSwitchover: 9,
	circleFootSeparation: 90,
	spiralFootSeparation: 80,
	spiralLengthStart: 60,
	spiralLengthFactor: 5,
	animate: true,
	animationSpeed: 500,
	transformSpiderLeft: 0,
	transformSpiderTop: 0,
	showingLegs: false
};

exports.default = MapboxGlSpiderifier;