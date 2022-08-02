"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = _interopRequireDefault(require("lodash"));

var _MappedComponent = _interopRequireDefault(require("../../components/MappedComponent"));

var _utils = require("../utils");

const doZoomingOnClick = WrappedComponent => {
  class ZoomableComponent extends _MappedComponent.default {
    constructor() {
      super(...arguments);

      this.onClusterClick = (properties, lngLat, event, meta) => {
        const {
          onClusterClick,
          clusterClickEnabled
        } = this.props;

        if (!clusterClickEnabled) {
          return;
        }

        const map = this.getMapInstance();
        const currentZoom = map.getZoom();
        const maxZoom = map.getMaxZoom();
        const zoom = (0, _utils.calculateNextZoomLevel)(currentZoom, maxZoom);
        map.flyTo({
          center: lngLat,
          zoom
        });

        this._handleClick(properties, lngLat, event, meta, onClusterClick);
      };
    }

    _handleClick(properties, lngLat, event, meta, callback) {
      if (_lodash.default.isFunction(callback)) {
        callback(properties, lngLat, event, meta);
      }
    }

    render() {
      const props = { ...this.props,
        onClusterClick: this.onClusterClick
      };
      return /*#__PURE__*/_react.default.createElement(WrappedComponent, props);
    }

  }

  ZoomableComponent.propTypes = {
    clusterClickEnabled: _propTypes.default.bool
  };
  ZoomableComponent.defaultProps = { ...WrappedComponent.defaultProps,
    clusterClickEnabled: true
  };
  return ZoomableComponent;
};

var _default = doZoomingOnClick;
exports.default = _default;