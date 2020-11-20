"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/objectSpread2"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/inherits"));

var _createSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/createSuper"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _invariant = require("@turf/invariant");

var _reactMapboxGl = require("react-mapbox-gl");

var _utils = require("../../common/utils");

var _MarkerLayer = require("../MarkerLayer");

require("./ClusterLayer.css");

var ClusterLayer = /*#__PURE__*/function (_PureComponent) {
  (0, _inherits2.default)(ClusterLayer, _PureComponent);

  var _super = (0, _createSuper2.default)(ClusterLayer);

  function ClusterLayer() {
    var _this;

    (0, _classCallCheck2.default)(this, ClusterLayer);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _this._clusterMarkerFactory = function (coordinates, pointCount, getLeaves) {
      var clusterClassName = _this.props.clusterClassName;
      var className = (0, _classnames.default)("cluster-layer--cluster", clusterClassName);
      var points = getLeaves();

      var pointsProps = _this._getPointsProps(points);

      var clusterEventHandlers = (0, _utils.extractEventHandlers)(_this.props, /^onCluster(.+)$/i);
      return /*#__PURE__*/_react.default.createElement(_MarkerLayer.MarkerLayer, Object.assign({
        key: coordinates.toString(),
        coordinates: coordinates,
        className: "cluster-layer-container",
        properties: pointsProps
      }, clusterEventHandlers), /*#__PURE__*/_react.default.createElement("div", {
        className: className
      }, /*#__PURE__*/_react.default.createElement("div", null, pointCount)));
    };

    return _this;
  }

  (0, _createClass2.default)(ClusterLayer, [{
    key: "_getClusterProps",
    value: function _getClusterProps() {
      var _this$props = this.props,
          radius = _this$props.radius,
          minZoom = _this$props.minZoom,
          maxZoom = _this$props.maxZoom,
          extent = _this$props.extent,
          nodeSize = _this$props.nodeSize;
      return {
        radius,
        minZoom,
        maxZoom,
        extent,
        nodeSize
      };
    }
  }, {
    key: "_getPointsProps",
    value: function _getPointsProps(points) {
      return points.map(function (point) {
        var feature = point.props["data-feature"];
        var properties = feature.properties;
        return (0, _objectSpread2.default)((0, _objectSpread2.default)({}, properties), {}, {
          coordinates: (0, _invariant.getCoord)(feature)
        });
      });
    }
  }, {
    key: "_renderMarkers",
    value: function _renderMarkers() {
      var _this2 = this;

      var _this$props2 = this.props,
          data = _this$props2.data,
          pointClassName = _this$props2.pointClassName,
          _this$props2$pointSty = _this$props2.pointStyles,
          pointStyles = _this$props2$pointSty === void 0 ? {} : _this$props2$pointSty,
          MarkerComponent = _this$props2.markerComponent;
      var markerClassName = (0, _classnames.default)("cluster-layer--point", pointClassName);
      return data.features.map(function (feature, key) {
        var coordinates = feature.geometry.coordinates,
            properties = feature.properties;
        var style = properties.style;
        var eventHandlers = (0, _utils.extractEventHandlers)(_this2.props);
        var cssObject = (0, _objectSpread2.default)((0, _objectSpread2.default)({}, pointStyles), style);
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
  }, {
    key: "render",
    value: function render() {
      var clusterProps = this._getClusterProps();

      return /*#__PURE__*/_react.default.createElement(_reactMapboxGl.Cluster, Object.assign({
        ClusterMarkerFactory: this._clusterMarkerFactory
      }, clusterProps), this._renderMarkers());
    }
  }]);
  return ClusterLayer;
}(_react.PureComponent);

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