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

var _MappedComponent2 = _interopRequireDefault(require("../../components/MappedComponent"));

var _utils = require("../utils");

var doZoomingOnClick = function doZoomingOnClick(WrappedComponent) {
  var ZoomableComponent = /*#__PURE__*/function (_MappedComponent) {
    (0, _inherits2.default)(ZoomableComponent, _MappedComponent);

    var _super = (0, _createSuper2.default)(ZoomableComponent);

    function ZoomableComponent() {
      var _this;

      (0, _classCallCheck2.default)(this, ZoomableComponent);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _this.onClusterClick = function (properties, lngLat, event, meta) {
        var _this$props = _this.props,
            onClusterClick = _this$props.onClusterClick,
            clusterClickEnabled = _this$props.clusterClickEnabled;

        if (!clusterClickEnabled) {
          return;
        }

        var map = _this.getMapInstance();

        var currentZoom = map.getZoom();
        var maxZoom = map.getMaxZoom();
        var zoom = (0, _utils.calculateNextZoomLevel)(currentZoom, maxZoom);
        map.flyTo({
          center: lngLat,
          zoom: zoom
        });

        _this._handleClick(properties, lngLat, event, meta, onClusterClick);
      };

      return _this;
    }

    (0, _createClass2.default)(ZoomableComponent, [{
      key: "_handleClick",
      value: function _handleClick(properties, lngLat, event, meta, callback) {
        if (_lodash.default.isFunction(callback)) {
          callback(properties, lngLat, event, meta);
        }
      }
    }, {
      key: "render",
      value: function render() {
        var props = (0, _objectSpread2.default)((0, _objectSpread2.default)({}, this.props), {}, {
          onClusterClick: this.onClusterClick
        });
        return /*#__PURE__*/_react.default.createElement(WrappedComponent, props);
      }
    }]);
    return ZoomableComponent;
  }(_MappedComponent2.default);

  ZoomableComponent.propTypes = {
    clusterClickEnabled: _propTypes.default.bool
  };
  ZoomableComponent.defaultProps = (0, _objectSpread2.default)((0, _objectSpread2.default)({}, WrappedComponent.defaultProps), {}, {
    clusterClickEnabled: true
  });
  return ZoomableComponent;
};

var _default = doZoomingOnClick;
exports.default = _default;