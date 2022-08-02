"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _invariant = require("@turf/invariant");

var _reactMapboxGl = require("react-mapbox-gl");

var _utils = require("../../common/utils");

var _MarkerLayer = require("../MarkerLayer");

require("./ClusterLayer.css");

class ClusterLayer extends _react.PureComponent {
  constructor() {
    super(...arguments);

    this._clusterMarkerFactory = (coordinates, pointCount, getLeaves) => {
      const {
        clusterClassName
      } = this.props;
      const className = (0, _classnames.default)("cluster-layer--cluster", clusterClassName);
      const points = getLeaves();

      const pointsProps = this._getPointsProps(points);

      const clusterEventHandlers = (0, _utils.extractEventHandlers)(this.props, /^onCluster(.+)$/i);
      return /*#__PURE__*/_react.default.createElement(_MarkerLayer.MarkerLayer, Object.assign({
        key: coordinates.toString(),
        coordinates: coordinates,
        className: "cluster-layer-container",
        properties: pointsProps
      }, clusterEventHandlers), /*#__PURE__*/_react.default.createElement("div", {
        className: className
      }, /*#__PURE__*/_react.default.createElement("div", null, pointCount)));
    };
  }

  _getClusterProps() {
    const {
      radius,
      minZoom,
      maxZoom,
      extent,
      nodeSize
    } = this.props;
    return {
      radius,
      minZoom,
      maxZoom,
      extent,
      nodeSize
    };
  }

  _getPointsProps(points) {
    return points.map(point => {
      const feature = point.props["data-feature"];
      const {
        properties
      } = feature;
      return { ...properties,
        coordinates: (0, _invariant.getCoord)(feature)
      };
    });
  }

  _renderMarkers() {
    const {
      data,
      pointClassName,
      pointStyles = {},
      markerComponent: MarkerComponent
    } = this.props;
    const markerClassName = (0, _classnames.default)("cluster-layer--point", pointClassName);
    return data.features.map((feature, key) => {
      const {
        geometry: {
          coordinates
        },
        properties
      } = feature;
      const {
        style
      } = properties;
      const eventHandlers = (0, _utils.extractEventHandlers)(this.props);
      const cssObject = { ...pointStyles,
        ...style
      };
      return /*#__PURE__*/_react.default.createElement(_MarkerLayer.MarkerLayer, Object.assign({
        key: "cluster-layer-point".concat(key),
        coordinates: coordinates,
        "data-feature": feature,
        properties: properties
      }, eventHandlers), MarkerComponent ? /*#__PURE__*/_react.default.createElement(MarkerComponent, {
        properties: properties,
        className: markerClassName,
        style: cssObject
      }) : /*#__PURE__*/_react.default.createElement("div", {
        className: markerClassName,
        style: cssObject
      }));
    });
  }

  render() {
    const clusterProps = this._getClusterProps();

    return /*#__PURE__*/_react.default.createElement(_reactMapboxGl.Cluster, Object.assign({
      ClusterMarkerFactory: this._clusterMarkerFactory
    }, clusterProps), this._renderMarkers());
  }

}

ClusterLayer.displayName = "ClusterLayer";
ClusterLayer.defaultProps = {
  radius: 60,
  minZoom: 0,
  maxZoom: 20,
  extent: 512,
  nodeSize: 64
};
var _default = ClusterLayer;
exports.default = _default;