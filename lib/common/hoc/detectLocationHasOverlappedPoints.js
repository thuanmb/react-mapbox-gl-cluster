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

var _helpers = require("@turf/helpers");

var _utils = require("../utils");

var _ClusterOptions = require("../constants/ClusterOptions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var detectLocationHasOverlappedPoints = function detectLocationHasOverlappedPoints(WrappedComponent) {
  var LayerWithOverlappedPointComponent = function (_PureComponent) {
    _inherits(LayerWithOverlappedPointComponent, _PureComponent);

    function LayerWithOverlappedPointComponent() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, LayerWithOverlappedPointComponent);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = LayerWithOverlappedPointComponent.__proto__ || Object.getPrototypeOf(LayerWithOverlappedPointComponent)).call.apply(_ref, [this].concat(args))), _this), _this.onClick = function (properties, lngLat, event, meta) {
        var onClick = _this.props.onClick;

        _this._handleClick(properties, lngLat, event, meta, onClick);
      }, _this.onClusterClick = function (properties, lngLat, event, meta) {
        var onClusterClick = _this.props.onClusterClick;

        _this._handleClick(properties, lngLat, event, meta, onClusterClick);
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(LayerWithOverlappedPointComponent, [{
      key: "_handleClick",
      value: function _handleClick(properties, lngLat, event, meta, callback) {
        var onClickOverlappedPoints = this.props.onClickOverlappedPoints;
        var map = this.context.map;

        var features = properties.map(function (prop) {
          return (0, _helpers.point)(prop.coordinates, prop);
        });
        var data = (0, _helpers.featureCollection)(features);
        var points = (0, _utils.findPointsWithSameLocation)(data, lngLat, map, _ClusterOptions.ClusterOptions.NearestPointsRadius, _ClusterOptions.ClusterOptions.ZoomLevel);
        if (points) {
          if (_lodash2.default.isFunction(onClickOverlappedPoints)) {
            onClickOverlappedPoints(features, lngLat, event, meta);
            return false;
          }
        } else if (_lodash2.default.isFunction(callback)) {
          callback(properties, lngLat, event, meta);
        }

        return true;
      }
    }, {
      key: "render",
      value: function render() {
        var props = _extends({}, this.props, {
          onClick: this.onClick,
          onClusterClick: this.onClusterClick
        });

        return _react2.default.createElement(WrappedComponent, props);
      }
    }]);

    return LayerWithOverlappedPointComponent;
  }(_react.PureComponent);

  LayerWithOverlappedPointComponent.contextTypes = {
    map: _propTypes2.default.object
  };


  LayerWithOverlappedPointComponent.propTypes = _extends({}, WrappedComponent.propTypes, {
    /**
     * [Optional] Handle when user click on a location which has overlapped points
     */
    onClickOverlappedPoints: _propTypes2.default.func
  });

  LayerWithOverlappedPointComponent.defaultProps = _extends({}, WrappedComponent.defaultProps);

  return LayerWithOverlappedPointComponent;
};

exports.default = detectLocationHasOverlappedPoints;