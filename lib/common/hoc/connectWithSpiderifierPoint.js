"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require("../utils");

var _reactMapboxGlSpiderifier = require("react-mapbox-gl-spiderifier");

var _invariant = require("@turf/invariant");

var _ClusterOptions = require("../constants/ClusterOptions");

require("./spiderifier.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var connectWithSpiderifierPoint = function connectWithSpiderifierPoint(WrappedComponent) {
  var ConnectedWithSpiderifierComponent = function (_Component) {
    _inherits(ConnectedWithSpiderifierComponent, _Component);

    function ConnectedWithSpiderifierComponent(props) {
      _classCallCheck(this, ConnectedWithSpiderifierComponent);

      var _this = _possibleConstructorReturn(this, (ConnectedWithSpiderifierComponent.__proto__ || Object.getPrototypeOf(ConnectedWithSpiderifierComponent)).call(this, props));

      _this.onClickOverlappedPoints = function (points, coordinates) {
        _this._updateSpiderifierProps([points], coordinates);
      };

      _this.onMapChange = function () {
        var onlySpiderifier = _this.props.onlySpiderifier;

        if (!onlySpiderifier && _lodash2.default.isArray(_this._spiderifieredLocations)) {
          var _this$props = _this.props,
              data = _this$props.data,
              radius = _this$props.radius;
          var map = _this.context.map;

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

    _createClass(ConnectedWithSpiderifierComponent, [{
      key: "componentWillMount",
      value: function componentWillMount() {
        this._updatePoints();
        this.bindEvents();
      }
    }, {
      key: "componentWillReceiveProps",
      value: function componentWillReceiveProps(nextProps) {
        this._checkAndUpdatePoints(nextProps);
        this.bindEvents();
      }
    }, {
      key: "shouldComponentUpdate",
      value: function shouldComponentUpdate(nextProps, nextState) {
        return (0, _utils.checkPropsChange)(this.props, nextProps, ["data", "showInitialSpiderifier", "onlySpiderifier", "circleFootSeparation", "transformSpiderLeft", "showingLegs"], _lodash2.default.isEqual) || !_lodash2.default.isEqual(this.state, nextState);
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.unbindEvents();
      }
    }, {
      key: "bindEvents",
      value: function bindEvents() {
        var map = this.context.map;

        if (map && !this.registeredEvents) {
          map.on("zoomend", this.onMapChange);
          this.registeredEvents = true;
        }
      }
    }, {
      key: "unbindEvents",
      value: function unbindEvents() {
        var map = this.context.map;

        if (map) {
          map.off("zoomend", this.onMapChange);
        }
      }
    }, {
      key: "onSpiderifierRemoved",
      value: function onSpiderifierRemoved(lngLat) {
        var overlappedPointsGroup = this.state.overlappedPointsGroup;

        if (_lodash2.default.isArray(overlappedPointsGroup)) {
          var removedIndex = overlappedPointsGroup.findIndex(function (_ref) {
            var coordinates = _ref.coordinates;
            return _lodash2.default.isEqual(coordinates, lngLat);
          });

          if (removedIndex > -1) {
            var newGroup = [].concat(_toConsumableArray(overlappedPointsGroup.slice(0, removedIndex)), _toConsumableArray(overlappedPointsGroup.slice(removedIndex + 1)));
            this.setState({ overlappedPointsGroup: newGroup });
          }
        }

        var onSpiderifierRemoved = this.props.onSpiderifierRemoved;

        if (_lodash2.default.isFunction(onSpiderifierRemoved)) {
          onSpiderifierRemoved(lngLat);
        }
      }
    }, {
      key: "_checkAndUpdatePoints",
      value: function _checkAndUpdatePoints(nextProps) {
        if ((0, _utils.checkPropsChange)(this.props, nextProps, ["data", "showInitialSpiderifier", "onlySpiderifier"], _lodash2.default.isEqual)) {
          this._updatePoints(nextProps);
        }
      }
    }, {
      key: "_getComponentProps",
      value: function _getComponentProps(propTypes) {
        var keys = _lodash2.default.map(propTypes, function (value, propKey) {
          return propKey;
        });
        return _lodash2.default.pick(this.props, keys);
      }
    }, {
      key: "_getWrappedComponentProps",
      value: function _getWrappedComponentProps() {
        return this._getComponentProps(WrappedComponent.propTypes);
      }
    }, {
      key: "_getSpiderifierComponentProps",
      value: function _getSpiderifierComponentProps() {
        return this._getComponentProps(_reactMapboxGlSpiderifier.ReactMapboxGlSpiderifier.propTypes);
      }
    }, {
      key: "_groupNearestPoint",
      value: function _groupNearestPoint(props) {
        var data = props.data,
            showInitialSpiderifier = props.showInitialSpiderifier,
            onlySpiderifier = props.onlySpiderifier;
        var map = this.context.map;

        var groupedPoints = (0, _utils.groupNearestPointsByRadius)(data, map, _ClusterOptions.ClusterOptions.NearestPointsRadius);

        if (groupedPoints.length > 0) {
          if (onlySpiderifier) {
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

        if (_lodash2.default.isFunction(spiderifyPropsProcessor)) {
          return spiderifyPropsProcessor(props);
        }

        return props;
      }
    }, {
      key: "_renderSpiderifierContent",
      value: function _renderSpiderifierContent(key, properties) {
        return _react2.default.createElement(
          "div",
          {
            className: "spiderifier-marker-content",
            key: key,
            properties: properties
          },
          _react2.default.createElement(
            "div",
            null,
            properties.label
          )
        );
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


            return _react2.default.createElement(
              _reactMapboxGlSpiderifier.ReactMapboxGlSpiderifier,
              _extends({
                key: index
              }, spiderifierComponentProps, {
                coordinates: coordinates
              }),
              markers.map(function (marker, index) {
                return _this2._renderSpiderifierContent(index, marker);
              })
            );
          });
        }

        return null;
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
            if (_lodash2.default.isFunction(onShowSpiderifier)) {
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
        var onlySpiderifier = this.props.onlySpiderifier;

        var wrappedComponentProps = this._getWrappedComponentProps();

        return _react2.default.createElement(
          "div",
          null,
          !onlySpiderifier && _react2.default.createElement(WrappedComponent, _extends({}, wrappedComponentProps, {
            onClickOverlappedPoints: this.onClickOverlappedPoints
          })),
          this._renderSpiderifier()
        );
      }
    }]);

    return ConnectedWithSpiderifierComponent;
  }(_react.Component);

  ConnectedWithSpiderifierComponent.contextTypes = {
    map: _propTypes2.default.object
  };


  var spiderifierPropTypes = _lodash2.default.pickBy(_reactMapboxGlSpiderifier.ReactMapboxGlSpiderifier.propTypes, function (value, props) {
    return props !== "markers" && props !== "coordinates";
  });
  ConnectedWithSpiderifierComponent.propTypes = _extends({}, WrappedComponent.propTypes, spiderifierPropTypes, {

    /**
     * Indicate if the spiderifier should be shown for the first overlapped point onload
     */
    showInitialSpiderifier: _propTypes2.default.bool,

    /**
     * Indicate if the spiderifier should be shown without wrapped component
     */
    onlySpiderifier: _propTypes2.default.bool,

    /**
     * Handler to transform the properties of each point
     */
    spiderifyPropsProcessor: _propTypes2.default.func,

    /**
     * Callback when a spiderifier shown
     */
    onShowSpiderifier: _propTypes2.default.func,

    /**
     * [Optional] Handle when user do zoom/move to change the map and made the points
     * on the map changed and don't have overlapped points anymore
     */
    onSpiderifierRemoved: _propTypes2.default.func
  });

  ConnectedWithSpiderifierComponent.defaultProps = _extends({}, WrappedComponent.defaultProps, _reactMapboxGlSpiderifier.ReactMapboxGlSpiderifier.defaultProps);

  return ConnectedWithSpiderifierComponent;
};

exports.default = connectWithSpiderifierPoint;