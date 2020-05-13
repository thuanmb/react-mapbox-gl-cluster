import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _createSuper from "@babel/runtime/helpers/esm/createSuper";
import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { checkPropsChange } from "../utils";
import { ReactMapboxGlSpiderifier } from "react-mapbox-gl-spiderifier";
import { getCoord } from "@turf/invariant";
import { findPointsWithSameLocation, groupNearestPointsByRadius } from "../utils";
import { ClusterOptions } from "../constants/ClusterOptions";
import MappedComponent from "../../components/MappedComponent";
import "./spiderifier.css";
var SPIDERIFIER_PROPS = ["coordinates", "circleSpiralSwitchover", "circleFootSeparation", "spiralFootSeparation", "spiralLengthStart", "spiralLengthFactor", "animate", "animationSpeed", "transformSpiderLeft", "transformSpiderTop", "showingLegs", "onClick", "onMouseDown", "onMouseEnter", "onMouseLeave", "onMouseMove", "onMouseOut", "onMouseOver", "onMouseUp"];
var MARKER_PROPS = ["data", "radius", "minZoom", "maxZoom", "extent", "nodeSize", "pointClassName", "pointStyles", "clusterClassName", "clusterClassName", "markerComponent", "onMouseLeave", "onClick", "onClusterClick", "onClusterMouseEnter", "onClusterMouseLeave"];

var connectWithSpiderifierPoint = function connectWithSpiderifierPoint(WrappedComponent) {
  var ConnectedWithSpiderifierComponent = /*#__PURE__*/function (_MappedComponent) {
    _inherits(ConnectedWithSpiderifierComponent, _MappedComponent);

    var _super = _createSuper(ConnectedWithSpiderifierComponent);

    function ConnectedWithSpiderifierComponent(props) {
      var _this;

      _classCallCheck(this, ConnectedWithSpiderifierComponent);

      _this = _super.call(this, props);

      _this.onClickOverlappedPoints = function (points, coordinates) {
        _this._updateSpiderifierProps([points], coordinates);
      };

      _this.onMapChange = function () {
        var onlySpiderifier = _this.props.onlySpiderifier;

        if (!onlySpiderifier && _.isArray(_this._spiderifieredLocations)) {
          var _this$props = _this.props,
              data = _this$props.data,
              radius = _this$props.radius;

          var map = _this.getMapInstance();

          _this._spiderifieredLocations.forEach(function (lngLat) {
            var points = findPointsWithSameLocation(data, lngLat, map, radius);

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
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        this._checkAndUpdatePoints(prevProps);

        this.bindEvents();
      }
    }, {
      key: "shouldComponentUpdate",
      value: function shouldComponentUpdate(nextProps, nextState) {
        return checkPropsChange(this.props, nextProps, ["data", "showInitialSpiderifier", "onlySpiderifier", "circleFootSeparation", "transformSpiderLeft", "showingLegs"], _.isEqual) || !_.isEqual(this.state, nextState);
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

        if (_.isArray(overlappedPointsGroup)) {
          var removedIndex = overlappedPointsGroup.findIndex(function (_ref) {
            var coordinates = _ref.coordinates;
            return _.isEqual(coordinates, lngLat);
          });

          if (removedIndex > -1) {
            var newGroup = [].concat(_toConsumableArray(overlappedPointsGroup.slice(0, removedIndex)), _toConsumableArray(overlappedPointsGroup.slice(removedIndex + 1)));
            this.setState({
              overlappedPointsGroup: newGroup
            });
          }
        }

        var onSpiderifierRemoved = this.props.onSpiderifierRemoved;

        if (_.isFunction(onSpiderifierRemoved)) {
          onSpiderifierRemoved(lngLat);
        }
      }
    }, {
      key: "_checkAndUpdatePoints",
      value: function _checkAndUpdatePoints(prevProps) {
        if (checkPropsChange(this.props, prevProps, ["data", "showInitialSpiderifier", "onlySpiderifier"], _.isEqual)) {
          this._updatePoints();
        }
      }
    }, {
      key: "_getComponentProps",
      value: function _getComponentProps(keys) {
        return _.pick(this.props, keys);
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
        var groupedPoints = groupNearestPointsByRadius(data, map, ClusterOptions.NearestPointsRadius);

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

        if (_.isFunction(spiderifyPropsProcessor)) {
          return spiderifyPropsProcessor(props);
        }

        return props;
      }
    }, {
      key: "_renderSpiderifierContent",
      value: function _renderSpiderifierContent(key, properties) {
        var SpiralComponent = this.props.spiralComponent;

        if (SpiralComponent) {
          return /*#__PURE__*/React.createElement(SpiralComponent, {
            key: key,
            properties: properties
          });
        }

        return /*#__PURE__*/React.createElement("div", {
          className: "spiderifier-marker-content",
          key: key,
          properties: properties
        }, /*#__PURE__*/React.createElement("div", null, properties.label));
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
            return /*#__PURE__*/React.createElement(ReactMapboxGlSpiderifier, Object.assign({
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
                coords = getCoord(points[0]);
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

            if (_.isFunction(onShowSpiderifier)) {
              onShowSpiderifier(coordinates, markers);
            }
          });
          this.setState({
            overlappedPointsGroup
          });
        }
      }
    }, {
      key: "render",
      value: function render() {
        var wrappedComponentProps = this._getWrappedComponentProps();

        return /*#__PURE__*/React.createElement("div", null, this._shouldRenderClusterLayer() && /*#__PURE__*/React.createElement(WrappedComponent, Object.assign({}, wrappedComponentProps, {
          onClickOverlappedPoints: this.onClickOverlappedPoints
        })), this._renderSpiderifier());
      }
    }]);

    return ConnectedWithSpiderifierComponent;
  }(MappedComponent);

  ConnectedWithSpiderifierComponent.propTypes = {
    /**
     * Indicate if the spiderifier should be shown for the first overlapped point onload
     */
    showInitialSpiderifier: PropTypes.bool,

    /**
     * Indicate if the spiderifier should be shown without wrapped component
     */
    onlySpiderifier: PropTypes.bool,

    /**
     * Handler to transform the properties of each point
     */
    spiderifyPropsProcessor: PropTypes.func,

    /**
     * Callback when a spiderifier shown
     */
    onShowSpiderifier: PropTypes.func,

    /**
     * [Optional] Handle when user do zoom/move to change the map and made the points
     * on the map changed and don't have overlapped points anymore
     */
    onSpiderifierRemoved: PropTypes.func,

    /**
     * Allow to customize the spiral component
     */
    spiralComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
  };
  ConnectedWithSpiderifierComponent.defaultProps = _objectSpread(_objectSpread({}, WrappedComponent.defaultProps), ReactMapboxGlSpiderifier.defaultProps);
  return ConnectedWithSpiderifierComponent;
};

export default connectWithSpiderifierPoint;