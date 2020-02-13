import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
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