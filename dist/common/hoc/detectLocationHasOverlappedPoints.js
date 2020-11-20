"use strict";

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

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = _interopRequireDefault(require("lodash"));

var _helpers = require("@turf/helpers");

var _utils = require("../utils");

var _ClusterOptions = require("../constants/ClusterOptions");

var _MappedComponent2 = _interopRequireDefault(require("../../components/MappedComponent"));

var detectLocationHasOverlappedPoints = function detectLocationHasOverlappedPoints(WrappedComponent) {
  var LayerWithOverlappedPointComponent = /*#__PURE__*/function (_MappedComponent) {
    (0, _inherits2.default)(LayerWithOverlappedPointComponent, _MappedComponent);

    var _super = (0, _createSuper2.default)(LayerWithOverlappedPointComponent);

    function LayerWithOverlappedPointComponent() {
      var _this;

      (0, _classCallCheck2.default)(this, LayerWithOverlappedPointComponent);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _this.onClick = function (properties, lngLat, event, meta) {
        var onClick = _this.props.onClick;

        _this._handleClick(properties, lngLat, event, meta, onClick);
      };

      _this.onClusterClick = function (properties, lngLat, event, meta) {
        var onClusterClick = _this.props.onClusterClick;

        _this._handleClick(properties, lngLat, event, meta, onClusterClick);
      };

      return _this;
    }

    (0, _createClass2.default)(LayerWithOverlappedPointComponent, [{
      key: "_handleClick",
      value: function _handleClick(properties, lngLat, event, meta, callback) {
        if (!_lodash.default.isArray(properties)) {
          if (_lodash.default.isFunction(callback)) {
            callback(properties, lngLat, event, meta);
          }

          return true;
        }

        var onClickOverlappedPoints = this.props.onClickOverlappedPoints;
        var map = this.getMapInstance();
        var features = properties.map(function (prop) {
          return (0, _helpers.point)(prop.coordinates, prop);
        });
        var data = (0, _helpers.featureCollection)(features);
        var points = (0, _utils.findPointsWithSameLocation)(data, lngLat, map, _ClusterOptions.ClusterOptions.NearestPointsRadius, _ClusterOptions.ClusterOptions.ZoomLevel);

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
    }, {
      key: "render",
      value: function render() {
        var props = (0, _objectSpread2.default)((0, _objectSpread2.default)({}, this.props), {}, {
          onClick: this.onClick,
          onClusterClick: this.onClusterClick
        });
        return /*#__PURE__*/_react.default.createElement(WrappedComponent, props);
      }
    }]);
    return LayerWithOverlappedPointComponent;
  }(_MappedComponent2.default);

  LayerWithOverlappedPointComponent.propTypes = {
    /**
     * [Optional] Handle when user click on a location which has overlapped points
     */
    onClickOverlappedPoints: _propTypes.default.func
  };
  LayerWithOverlappedPointComponent.defaultProps = (0, _objectSpread2.default)({}, WrappedComponent.defaultProps);
  return LayerWithOverlappedPointComponent;
};

var _default = detectLocationHasOverlappedPoints;
exports.default = _default;