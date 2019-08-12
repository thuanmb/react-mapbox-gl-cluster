import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import MappedComponent from "../../components/MappedComponent";
import { calculateNextZoomLevel } from "../utils";

var doZoomingOnClick = function doZoomingOnClick(WrappedComponent) {
  var ZoomableComponent =
  /*#__PURE__*/
  function (_MappedComponent) {
    _inherits(ZoomableComponent, _MappedComponent);

    function ZoomableComponent() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, ZoomableComponent);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ZoomableComponent)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _this.onClusterClick = function (properties, lngLat, event, meta) {
        var onClusterClick = _this.props.onClusterClick;

        var map = _this.getMapInstance();

        var currentZoom = map.getZoom();
        var maxZoom = map.getMaxZoom();
        var zoom = calculateNextZoomLevel(currentZoom, maxZoom);
        map.flyTo({
          center: lngLat,
          zoom: zoom
        });

        _this._handleClick(properties, lngLat, event, meta, onClusterClick);
      };

      return _this;
    }

    _createClass(ZoomableComponent, [{
      key: "_handleClick",
      value: function _handleClick(properties, lngLat, event, meta, callback) {
        if (_.isFunction(callback)) {
          callback(properties, lngLat, event, meta);
        }
      }
    }, {
      key: "render",
      value: function render() {
        var props = _objectSpread({}, this.props, {
          onClusterClick: this.onClusterClick
        });

        return React.createElement(WrappedComponent, props);
      }
    }]);

    return ZoomableComponent;
  }(MappedComponent);

  ZoomableComponent.contextTypes = {
    map: PropTypes.object
  };
  ZoomableComponent.propTypes = _objectSpread({}, WrappedComponent.propTypes);
  ZoomableComponent.defaultProps = _objectSpread({}, WrappedComponent.defaultProps);
  return ZoomableComponent;
};

export default doZoomingOnClick;