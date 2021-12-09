"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/objectSpread2"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/inherits"));

var _createSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/createSuper"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = _interopRequireDefault(require("lodash"));

var _utils = require("../utils");

var _reactMapboxGlSpiderifier = require("react-mapbox-gl-spiderifier");

var _invariant = require("@turf/invariant");

var _ClusterOptions = require("../constants/ClusterOptions");

var _MappedComponent2 = _interopRequireDefault(require("../../components/MappedComponent"));

require("./spiderifier.css");

var SPIDERIFIER_PROPS = ["coordinates", "circleSpiralSwitchover", "circleFootSeparation", "spiralFootSeparation", "spiralLengthStart", "spiralLengthFactor", "animate", "animationSpeed", "transformSpiderLeft", "transformSpiderTop", "showingLegs", "onClick", "onMouseDown", "onMouseEnter", "onMouseLeave", "onMouseMove", "onMouseOut", "onMouseOver", "onMouseUp"];
var MARKER_PROPS = ["data", "radius", "minZoom", "maxZoom", "extent", "nodeSize", "pointClassName", "pointStyles", "clusterClassName", "clusterClassName", "markerComponent", "onMouseLeave", "onClick", "onClusterClick", "onClusterMouseEnter", "onClusterMouseLeave", "clusterClickEnabled"];

var connectWithSpiderifierPoint = function connectWithSpiderifierPoint(WrappedComponent) {
  var ConnectedWithSpiderifierComponent = /*#__PURE__*/function (_MappedComponent) {
    (0, _inherits2.default)(ConnectedWithSpiderifierComponent, _MappedComponent);

    var _super = (0, _createSuper2.default)(ConnectedWithSpiderifierComponent);

    function ConnectedWithSpiderifierComponent(props) {
      var _this;

      (0, _classCallCheck2.default)(this, ConnectedWithSpiderifierComponent);
      _this = _super.call(this, props);

      _this.onClickOverlappedPoints = function (points, coordinates) {
        _this._updateSpiderifierProps([points], coordinates);
      };

      _this.onMapChange = function () {
        var onlySpiderifier = _this.props.onlySpiderifier;

        if (!onlySpiderifier && _lodash.default.isArray(_this._spiderifieredLocations)) {
          var _this$props = _this.props,
              data = _this$props.data,
              radius = _this$props.radius;

          var map = _this.getMapInstance();

          _this._spiderifieredLocations.forEach(function (lngLat) {
            var points = (0, _utils.findPointsWithSameLocation)(data, lngLat, map, radius);

            if (!points) {
              _this.onSpiderifierRemoved(lngLat);
            }
          });
        }
      };

      _this.state = {
        overlappedPointsGroup: null
      };
      _this.registeredEvents = false;
      return _this;
    }

    (0, _createClass2.default)(ConnectedWithSpiderifierComponent, [{
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        this._checkAndUpdatePoints(prevProps);

        this.bindEvents();
      }
    }, {
      key: "shouldComponentUpdate",
      value: function shouldComponentUpdate(nextProps, nextState) {
        return (0, _utils.checkPropsChange)(this.props, nextProps, ["data", "showInitialSpiderifier", "onlySpiderifier", "circleFootSeparation", "transformSpiderLeft", "showingLegs"], _lodash.default.isEqual) || !_lodash.default.isEqual(this.state, nextState);
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.unbindEvents();
      }
    }, {
      key: "bindEvents",
      value: function bindEvents() {
        var map = this.getMapInstance();

        if (map && !this.registeredEvents) {
          map.on("zoomend", this.onMapChange);
          this.registeredEvents = true;
        }
      }
    }, {
      key: "unbindEvents",
      value: function unbindEvents() {
        var map = this.getMapInstance();

        if (map) {
          map.off("zoomend", this.onMapChange);
        }
      }
    }, {
      key: "onSpiderifierRemoved",
      value: function onSpiderifierRemoved(lngLat) {
        var overlappedPointsGroup = this.state.overlappedPointsGroup;

        if (_lodash.default.isArray(overlappedPointsGroup)) {
          var removedIndex = overlappedPointsGroup.findIndex(function (_ref) {
            var coordinates = _ref.coordinates;
            return _lodash.default.isEqual(coordinates, lngLat);
          });

          if (removedIndex > -1) {
            var newGroup = [].concat((0, _toConsumableArray2.default)(overlappedPointsGroup.slice(0, removedIndex)), (0, _toConsumableArray2.default)(overlappedPointsGroup.slice(removedIndex + 1)));
            this.setState({
              overlappedPointsGroup: newGroup
            });
          }
        }

        var onSpiderifierRemoved = this.props.onSpiderifierRemoved;

        if (_lodash.default.isFunction(onSpiderifierRemoved)) {
          onSpiderifierRemoved(lngLat);
        }
      }
    }, {
      key: "_checkAndUpdatePoints",
      value: function _checkAndUpdatePoints(prevProps) {
        if ((0, _utils.checkPropsChange)(this.props, prevProps, ["data", "showInitialSpiderifier", "onlySpiderifier"], _lodash.default.isEqual)) {
          this._updatePoints();
        }
      }
    }, {
      key: "_getComponentProps",
      value: function _getComponentProps(keys) {
        return _lodash.default.pick(this.props, keys);
      }
    }, {
      key: "_getWrappedComponentProps",
      value: function _getWrappedComponentProps() {
        return this._getComponentProps(MARKER_PROPS);
      }
    }, {
      key: "_getSpiderifierComponentProps",
      value: function _getSpiderifierComponentProps() {
        return this._getComponentProps(SPIDERIFIER_PROPS);
      }
    }, {
      key: "_groupNearestPoint",
      value: function _groupNearestPoint(props) {
        var data = props.data,
            showInitialSpiderifier = props.showInitialSpiderifier,
            onlySpiderifier = props.onlySpiderifier;
        var map = this.getMapInstance();
        var groupedPoints = (0, _utils.groupNearestPointsByRadius)(data, map, _ClusterOptions.ClusterOptions.NearestPointsRadius);

        if (groupedPoints.length > 0) {
          if (onlySpiderifier && groupedPoints.length === 1) {
            this._updateSpiderifierProps(groupedPoints);
          } else if (showInitialSpiderifier) {
            var firstGroup = groupedPoints.find(function (group) {
              return group.length > 1;
            });

            if (firstGroup == null) {
              firstGroup = groupedPoints[0];
            }

            this._updateSpiderifierProps([firstGroup]);
          }
        }
      }
    }, {
      key: "_processSpiderifyProperties",
      value: function _processSpiderifyProperties(props) {
        var spiderifyPropsProcessor = this.props.spiderifyPropsProcessor;

        if (_lodash.default.isFunction(spiderifyPropsProcessor)) {
          return spiderifyPropsProcessor(props);
        }

        return props;
      }
    }, {
      key: "_renderSpiderifierContent",
      value: function _renderSpiderifierContent(key, properties) {
        var SpiralComponent = this.props.spiralComponent;

        if (SpiralComponent) {
          return /*#__PURE__*/_react.default.createElement(SpiralComponent, {
            key: key,
            properties: properties
          });
        }

        return /*#__PURE__*/_react.default.createElement("div", {
          className: "spiderifier-marker-content",
          key: key,
          properties: properties
        }, /*#__PURE__*/_react.default.createElement("div", null, properties.label));
      }
    }, {
      key: "_renderSpiderifier",
      value: function _renderSpiderifier() {
        var _this2 = this;

        var overlappedPointsGroup = this.state.overlappedPointsGroup;

        if (overlappedPointsGroup && overlappedPointsGroup.length > 0) {
          var spiderifierComponentProps = this._getSpiderifierComponentProps();

          return overlappedPointsGroup.map(function (overlappedPoints, index) {
            var coordinates = overlappedPoints.coordinates,
                markers = overlappedPoints.markers;
            return /*#__PURE__*/_react.default.createElement(_reactMapboxGlSpiderifier.ReactMapboxGlSpiderifier, Object.assign({
              key: index
            }, spiderifierComponentProps, {
              coordinates: coordinates
            }), markers.map(function (marker, index) {
              return _this2._renderSpiderifierContent(index, marker);
            }));
          });
        }

        return null;
      }
    }, {
      key: "_shouldRenderClusterLayer",
      value: function _shouldRenderClusterLayer() {
        var _this$props2 = this.props,
            onlySpiderifier = _this$props2.onlySpiderifier,
            overlappedPointsGroup = _this$props2.overlappedPointsGroup;
        return !onlySpiderifier || !overlappedPointsGroup || overlappedPointsGroup.length > 1;
      }
    }, {
      key: "_updatePoints",
      value: function _updatePoints() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
        var data = props.data,
            showInitialSpiderifier = props.showInitialSpiderifier,
            onlySpiderifier = props.onlySpiderifier;

        if (data != null && (showInitialSpiderifier || onlySpiderifier)) {
          this._groupNearestPoint(props);
        }
      }
    }, {
      key: "_updateSpiderifierProps",
      value: function _updateSpiderifierProps(group, coordinates) {
        var _this3 = this;

        this._spiderifieredLocations = [];

        if (group.length > 0) {
          var overlappedPointsGroup = group.map(function (points) {
            if (points.length > 0) {
              var properties = points.map(function (feature) {
                return feature.properties;
              });
              var coords = coordinates;

              if (coords == null) {
                coords = (0, _invariant.getCoord)(points[0]);
              }

              return {
                markers: _this3._processSpiderifyProperties(properties),
                coordinates: coords
              };
            }

            return null;
          });
          var onShowSpiderifier = this.props.onShowSpiderifier;
          overlappedPointsGroup.forEach(function (group) {
            var coordinates = group.coordinates,
                markers = group.markers;

            _this3._spiderifieredLocations.push(coordinates);

            if (_lodash.default.isFunction(onShowSpiderifier)) {
              onShowSpiderifier(coordinates, markers);
            }
          });
          this.setState({
            overlappedPointsGroup: overlappedPointsGroup
          });
        }
      }
    }, {
      key: "render",
      value: function render() {
        var wrappedComponentProps = this._getWrappedComponentProps();

        return /*#__PURE__*/_react.default.createElement("div", null, this._shouldRenderClusterLayer() && /*#__PURE__*/_react.default.createElement(WrappedComponent, Object.assign({}, wrappedComponentProps, {
          onClickOverlappedPoints: this.onClickOverlappedPoints
        })), this._renderSpiderifier());
      }
    }]);
    return ConnectedWithSpiderifierComponent;
  }(_MappedComponent2.default);

  ConnectedWithSpiderifierComponent.propTypes = {
    /**
     * Indicate if the spiderifier should be shown for the first overlapped point onload
     */
    showInitialSpiderifier: _propTypes.default.bool,

    /**
     * Indicate if the spiderifier should be shown without wrapped component
     */
    onlySpiderifier: _propTypes.default.bool,

    /**
     * Handler to transform the properties of each point
     */
    spiderifyPropsProcessor: _propTypes.default.func,

    /**
     * Callback when a spiderifier shown
     */
    onShowSpiderifier: _propTypes.default.func,

    /**
     * [Optional] Handle when user do zoom/move to change the map and made the points
     * on the map changed and don't have overlapped points anymore
     */
    onSpiderifierRemoved: _propTypes.default.func,

    /**
     * Allow to customize the spiral component
     */
    spiralComponent: _propTypes.default.oneOfType([_propTypes.default.element, _propTypes.default.func])
  };
  ConnectedWithSpiderifierComponent.defaultProps = (0, _objectSpread2.default)((0, _objectSpread2.default)({}, WrappedComponent.defaultProps), _reactMapboxGlSpiderifier.ReactMapboxGlSpiderifier.defaultProps);
  return ConnectedWithSpiderifierComponent;
};

var _default = connectWithSpiderifierPoint;
exports.default = _default;