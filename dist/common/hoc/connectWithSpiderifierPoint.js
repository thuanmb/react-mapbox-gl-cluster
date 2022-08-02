"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = _interopRequireDefault(require("lodash"));

var _utils = require("../utils");

var _reactMapboxGlSpiderifier = require("react-mapbox-gl-spiderifier");

var _invariant = require("@turf/invariant");

var _ClusterOptions = require("../constants/ClusterOptions");

var _MappedComponent = _interopRequireDefault(require("../../components/MappedComponent"));

require("./spiderifier.css");

const SPIDERIFIER_PROPS = ["coordinates", "circleSpiralSwitchover", "circleFootSeparation", "spiralFootSeparation", "spiralLengthStart", "spiralLengthFactor", "animate", "animationSpeed", "transformSpiderLeft", "transformSpiderTop", "showingLegs", "onClick", "onMouseDown", "onMouseEnter", "onMouseLeave", "onMouseMove", "onMouseOut", "onMouseOver", "onMouseUp"];
const MARKER_PROPS = ["data", "radius", "minZoom", "maxZoom", "extent", "nodeSize", "pointClassName", "pointStyles", "clusterClassName", "clusterClassName", "markerComponent", "onMouseLeave", "onClick", "onClusterClick", "onClusterMouseEnter", "onClusterMouseLeave", "clusterClickEnabled"];

const connectWithSpiderifierPoint = WrappedComponent => {
  class ConnectedWithSpiderifierComponent extends _MappedComponent.default {
    constructor(props) {
      super(props);

      this.onClickOverlappedPoints = (points, coordinates) => {
        this._updateSpiderifierProps([points], coordinates);
      };

      this.onMapChange = () => {
        const {
          onlySpiderifier
        } = this.props;

        if (!onlySpiderifier && _lodash.default.isArray(this._spiderifieredLocations)) {
          const {
            data,
            radius
          } = this.props;
          const map = this.getMapInstance();

          this._spiderifieredLocations.forEach(lngLat => {
            const points = (0, _utils.findPointsWithSameLocation)(data, lngLat, map, radius);

            if (!points) {
              this.onSpiderifierRemoved(lngLat);
            }
          });
        }
      };

      this.state = {
        overlappedPointsGroup: null
      };
      this.registeredEvents = false;
    }

    componentDidUpdate(prevProps) {
      this._checkAndUpdatePoints(prevProps);

      this.bindEvents();
    }

    shouldComponentUpdate(nextProps, nextState) {
      return (0, _utils.checkPropsChange)(this.props, nextProps, ["data", "showInitialSpiderifier", "onlySpiderifier", "circleFootSeparation", "transformSpiderLeft", "showingLegs"], _lodash.default.isEqual) || !_lodash.default.isEqual(this.state, nextState);
    }

    componentWillUnmount() {
      this.unbindEvents();
    }

    bindEvents() {
      const map = this.getMapInstance();

      if (map && !this.registeredEvents) {
        map.on("zoomend", this.onMapChange);
        this.registeredEvents = true;
      }
    }

    unbindEvents() {
      const map = this.getMapInstance();

      if (map) {
        map.off("zoomend", this.onMapChange);
      }
    }

    onSpiderifierRemoved(lngLat) {
      const {
        overlappedPointsGroup
      } = this.state;

      if (_lodash.default.isArray(overlappedPointsGroup)) {
        const removedIndex = overlappedPointsGroup.findIndex(_ref => {
          let {
            coordinates
          } = _ref;
          return _lodash.default.isEqual(coordinates, lngLat);
        });

        if (removedIndex > -1) {
          const newGroup = [...overlappedPointsGroup.slice(0, removedIndex), ...overlappedPointsGroup.slice(removedIndex + 1)];
          this.setState({
            overlappedPointsGroup: newGroup
          });
        }
      }

      const {
        onSpiderifierRemoved
      } = this.props;

      if (_lodash.default.isFunction(onSpiderifierRemoved)) {
        onSpiderifierRemoved(lngLat);
      }
    }

    _checkAndUpdatePoints(prevProps) {
      if ((0, _utils.checkPropsChange)(this.props, prevProps, ["data", "showInitialSpiderifier", "onlySpiderifier"], _lodash.default.isEqual)) {
        this._updatePoints();
      }
    }

    _getComponentProps(keys) {
      return _lodash.default.pick(this.props, keys);
    }

    _getWrappedComponentProps() {
      return this._getComponentProps(MARKER_PROPS);
    }

    _getSpiderifierComponentProps() {
      return this._getComponentProps(SPIDERIFIER_PROPS);
    }

    _groupNearestPoint(props) {
      const {
        data,
        showInitialSpiderifier,
        onlySpiderifier
      } = props;
      const map = this.getMapInstance();
      const groupedPoints = (0, _utils.groupNearestPointsByRadius)(data, map, _ClusterOptions.ClusterOptions.NearestPointsRadius);

      if (groupedPoints.length > 0) {
        if (onlySpiderifier && groupedPoints.length === 1) {
          this._updateSpiderifierProps(groupedPoints);
        } else if (showInitialSpiderifier) {
          let firstGroup = groupedPoints.find(group => group.length > 1);

          if (firstGroup == null) {
            firstGroup = groupedPoints[0];
          }

          this._updateSpiderifierProps([firstGroup]);
        }
      }
    }

    _processSpiderifyProperties(props) {
      const {
        spiderifyPropsProcessor
      } = this.props;

      if (_lodash.default.isFunction(spiderifyPropsProcessor)) {
        return spiderifyPropsProcessor(props);
      }

      return props;
    }

    _renderSpiderifierContent(key, properties) {
      const {
        spiralComponent: SpiralComponent
      } = this.props;

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

    _renderSpiderifier() {
      const {
        overlappedPointsGroup
      } = this.state;

      if (overlappedPointsGroup && overlappedPointsGroup.length > 0) {
        const spiderifierComponentProps = this._getSpiderifierComponentProps();

        return overlappedPointsGroup.map((overlappedPoints, index) => {
          const {
            coordinates,
            markers
          } = overlappedPoints;
          return /*#__PURE__*/_react.default.createElement(_reactMapboxGlSpiderifier.ReactMapboxGlSpiderifier, Object.assign({
            key: index
          }, spiderifierComponentProps, {
            coordinates: coordinates
          }), markers.map((marker, index) => this._renderSpiderifierContent(index, marker)));
        });
      }

      return null;
    }

    _shouldRenderClusterLayer() {
      const {
        onlySpiderifier,
        overlappedPointsGroup
      } = this.props;
      return !onlySpiderifier || !overlappedPointsGroup || overlappedPointsGroup.length > 1;
    }

    _updatePoints() {
      let props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
      const {
        data,
        showInitialSpiderifier,
        onlySpiderifier
      } = props;

      if (data != null && (showInitialSpiderifier || onlySpiderifier)) {
        this._groupNearestPoint(props);
      }
    }

    _updateSpiderifierProps(group, coordinates) {
      this._spiderifieredLocations = [];

      if (group.length > 0) {
        const overlappedPointsGroup = group.map(points => {
          if (points.length > 0) {
            const properties = points.map(feature => feature.properties);
            let coords = coordinates;

            if (coords == null) {
              coords = (0, _invariant.getCoord)(points[0]);
            }

            return {
              markers: this._processSpiderifyProperties(properties),
              coordinates: coords
            };
          }

          return null;
        });
        const {
          onShowSpiderifier
        } = this.props;
        overlappedPointsGroup.forEach(group => {
          const {
            coordinates,
            markers
          } = group;

          this._spiderifieredLocations.push(coordinates);

          if (_lodash.default.isFunction(onShowSpiderifier)) {
            onShowSpiderifier(coordinates, markers);
          }
        });
        this.setState({
          overlappedPointsGroup
        });
      }
    }

    render() {
      const wrappedComponentProps = this._getWrappedComponentProps();

      return /*#__PURE__*/_react.default.createElement("div", null, this._shouldRenderClusterLayer() && /*#__PURE__*/_react.default.createElement(WrappedComponent, Object.assign({}, wrappedComponentProps, {
        onClickOverlappedPoints: this.onClickOverlappedPoints
      })), this._renderSpiderifier());
    }

  }

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
  ConnectedWithSpiderifierComponent.defaultProps = { ...WrappedComponent.defaultProps,
    ..._reactMapboxGlSpiderifier.ReactMapboxGlSpiderifier.defaultProps
  };
  return ConnectedWithSpiderifierComponent;
};

var _default = connectWithSpiderifierPoint;
exports.default = _default;