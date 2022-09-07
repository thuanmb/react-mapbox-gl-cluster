"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = _interopRequireDefault(require("lodash"));

var _helpers = require("@turf/helpers");

var _utils = require("../utils");

var _ClusterOptions = require("../constants/ClusterOptions");

var _MappedComponent = _interopRequireDefault(require("../../components/MappedComponent"));

/**
 * @type Class
 */
const detectLocationHasOverlappedPoints = WrappedComponent => {
  class LayerWithOverlappedPointComponent extends _MappedComponent.default {
    constructor() {
      super(...arguments);

      this.onClick = (properties, lngLat, event, meta) => {
        const {
          onClick
        } = this.props;

        this._handleClick(properties, lngLat, event, meta, onClick);
      };

      this.onClusterClick = (properties, lngLat, event, meta) => {
        const {
          onClusterClick
        } = this.props;

        this._handleClick(properties, lngLat, event, meta, onClusterClick);
      };
    }

    _handleClick(properties, lngLat, event, meta, callback) {
      if (!_lodash.default.isArray(properties)) {
        if (_lodash.default.isFunction(callback)) {
          callback(properties, lngLat, event, meta);
        }

        return true;
      }

      const {
        onClickOverlappedPoints
      } = this.props;
      const map = this.getMapInstance();
      const features = properties.map(prop => (0, _helpers.point)(prop.coordinates, prop));
      const data = (0, _helpers.featureCollection)(features);
      const points = (0, _utils.findPointsWithSameLocation)(data, lngLat, map, _ClusterOptions.ClusterOptions.NearestPointsRadius, _ClusterOptions.ClusterOptions.ZoomLevel);

      if (points) {
        if (_lodash.default.isFunction(onClickOverlappedPoints)) {
          onClickOverlappedPoints(features, lngLat, event, meta);
          return false;
        }
      } else if (_lodash.default.isFunction(callback)) {
        callback(properties, lngLat, event, meta);
      }

      return true;
    }

    render() {
      const props = { ...this.props,
        onClick: this.onClick,
        onClusterClick: this.onClusterClick
      };
      return /*#__PURE__*/_react.default.createElement(WrappedComponent, props);
    }

  }

  LayerWithOverlappedPointComponent.propTypes = {
    /**
     * [Optional] Handle when user click on a location which has overlapped points
     */
    onClickOverlappedPoints: _propTypes.default.func
  };
  LayerWithOverlappedPointComponent.defaultProps = { ...WrappedComponent.defaultProps
  };
  return LayerWithOverlappedPointComponent;
};

var _default = detectLocationHasOverlappedPoints;
exports.default = _default;