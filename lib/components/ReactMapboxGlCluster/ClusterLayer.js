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

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _invariant = require("@turf/invariant");

var _utils = require("../../common/utils");

var _Cluster = require("./Cluster");

var _Cluster2 = _interopRequireDefault(_Cluster);

var _MarkerLayer = require("../MarkerLayer");

require("./ClusterLayer.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ClusterLayer = function (_PureComponent) {
  _inherits(ClusterLayer, _PureComponent);

  function ClusterLayer() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ClusterLayer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ClusterLayer.__proto__ || Object.getPrototypeOf(ClusterLayer)).call.apply(_ref, [this].concat(args))), _this), _this._clusterMarkerFactory = function (coordinates, pointCount, getLeaves) {
      var clusterClassName = _this.props.clusterClassName;

      var className = (0, _classnames2.default)("cluster-layer--cluster", clusterClassName);
      var points = getLeaves();
      var pointsProps = _this._getPointsProps(points);
      var clusterEventHandlers = (0, _utils.extractEventHandlers)(_this.props, /^onCluster(.+)$/i);

      return _react2.default.createElement(
        _MarkerLayer.MarkerLayer,
        _extends({
          key: coordinates.toString(),
          coordinates: coordinates,
          className: "cluster-layer-container",
          properties: pointsProps
        }, clusterEventHandlers),
        _react2.default.createElement(
          "div",
          { className: className },
          _react2.default.createElement(
            "div",
            null,
            pointCount
          )
        )
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ClusterLayer, [{
    key: "_getClusterProps",
    value: function _getClusterProps() {
      var _props = this.props,
          radius = _props.radius,
          minZoom = _props.minZoom,
          maxZoom = _props.maxZoom,
          extent = _props.extent,
          nodeSize = _props.nodeSize;


      return {
        radius: radius,
        minZoom: minZoom,
        maxZoom: maxZoom,
        extent: extent,
        nodeSize: nodeSize
      };
    }
  }, {
    key: "_getPointsProps",
    value: function _getPointsProps(points) {
      return points.map(function (point) {
        var feature = point.props["data-feature"];
        var properties = feature.properties;

        return _extends({}, properties, {
          coordinates: (0, _invariant.getCoord)(feature)
        });
      });
    }
  }, {
    key: "_renderMarkers",
    value: function _renderMarkers() {
      var _this2 = this;

      var _props2 = this.props,
          data = _props2.data,
          pointClassName = _props2.pointClassName,
          _props2$pointStyles = _props2.pointStyles,
          pointStyles = _props2$pointStyles === undefined ? {} : _props2$pointStyles;

      var markerClassName = (0, _classnames2.default)("cluster-layer--point", pointClassName);

      return data.features.map(function (feature, key) {
        var coordinates = feature.geometry.coordinates,
            properties = feature.properties;
        var style = properties.style;

        var eventHandlers = (0, _utils.extractEventHandlers)(_this2.props);
        var cssObject = _extends({}, pointStyles, style);

        return _react2.default.createElement(
          _MarkerLayer.MarkerLayer,
          _extends({
            key: "cluster-layer-point" + key,
            coordinates: coordinates,
            "data-feature": feature,
            properties: properties
          }, eventHandlers),
          _react2.default.createElement("div", { className: markerClassName, style: cssObject })
        );
      });
    }
  }, {
    key: "render",
    value: function render() {
      var clusterProps = this._getClusterProps();

      return _react2.default.createElement(
        _Cluster2.default,
        _extends({
          ClusterMarkerFactory: this._clusterMarkerFactory
        }, clusterProps),
        this._renderMarkers()
      );
    }
  }]);

  return ClusterLayer;
}(_react.PureComponent);

ClusterLayer.displayName = "ClusterLayer";

ClusterLayer.propTypes = {
  /**
   * Data source for layer. It must to follow FeatureCollection geojson format
   */
  data: _propTypes2.default.shape({
    type: _propTypes2.default.oneOf(["FeatureCollection"]).isRequired,
    features: _propTypes2.default.arrayOf(_propTypes2.default.shape({
      type: _propTypes2.default.oneOf(["Feature"]).isRequired,
      geometry: _propTypes2.default.shape({
        type: _propTypes2.default.string.isRequired,
        coordinates: _propTypes2.default.array.isRequired
      }).isRequired,
      properties: _propTypes2.default.object.isRequired
    })).isRequired
  }),

  /**
   * [Optional] Cluster radius, in pixels.
   */
  radius: _propTypes2.default.number,

  /**
   * [Optional] Minimum zoom level at which clusters are generated.
   */
  minZoom: _propTypes2.default.number,

  /**
   * [Optional] Maximum zoom level at which clusters are generated.
   */
  maxZoom: _propTypes2.default.number,

  /**
   * [Optional] (Tiles) Tile extent. Radius is calculated relative to this value.
   */
  extent: _propTypes2.default.number,

  /**
   * [Optional] Size of the KD-tree leaf node. Affects performance.
   */
  nodeSize: _propTypes2.default.number,

  /**
   * [Optional] The class name of each point.
   */
  pointClassName: _propTypes2.default.string,

  /**
   * [Optional] The styles name of each point.
   */
  pointStyles: _propTypes2.default.object,

  /**
   * [Optional] The class name of each cluster.
   */
  clusterClassName: _propTypes2.default.string,

  /**
   * [Optional] Handle when user move the mouse enter a point
   */
  onMouseEnter: _propTypes2.default.func,

  /**
   * [Optional] Handle when user move the mouse leave a point
   */
  onMouseLeave: _propTypes2.default.func,

  /**
   * [Optional] Handler for when user on marker
   **/
  onClick: _propTypes2.default.func,

  /**
   * [Optional] Handle when user click on cluster
   */
  onClusterClick: _propTypes2.default.func,

  /**
   * [Optional] Handle when user move the mouse enter a cluster
   */
  onClusterMouseEnter: _propTypes2.default.func,

  /**
   * [Optional] Handle when user move the mouse leave a cluster
   */
  onClusterMouseLeave: _propTypes2.default.func
};

ClusterLayer.defaultProps = {
  radius: 60,
  minZoom: 0,
  maxZoom: 20,
  extent: 512,
  nodeSize: 64
};

exports.default = ClusterLayer;