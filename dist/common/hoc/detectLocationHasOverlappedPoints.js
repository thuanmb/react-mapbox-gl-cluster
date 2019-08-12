import _defineProperty from "/Users/thuanbui/source_code/react-mapbox-gl-cluster/node_modules/@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "/Users/thuanbui/source_code/react-mapbox-gl-cluster/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/thuanbui/source_code/react-mapbox-gl-cluster/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/thuanbui/source_code/react-mapbox-gl-cluster/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/thuanbui/source_code/react-mapbox-gl-cluster/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/thuanbui/source_code/react-mapbox-gl-cluster/node_modules/@babel/runtime/helpers/esm/inherits";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { featureCollection as createFeatureCollection, point as createPoint } from "@turf/helpers";
import { findPointsWithSameLocation } from "../utils";
import { ClusterOptions } from "../constants/ClusterOptions";
import MappedComponent from "../../components/MappedComponent";

var detectLocationHasOverlappedPoints = function detectLocationHasOverlappedPoints(WrappedComponent) {
  var LayerWithOverlappedPointComponent =
  /*#__PURE__*/
  function (_MappedComponent) {
    _inherits(LayerWithOverlappedPointComponent, _MappedComponent);

    function LayerWithOverlappedPointComponent() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, LayerWithOverlappedPointComponent);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(LayerWithOverlappedPointComponent)).call.apply(_getPrototypeOf2, [this].concat(args)));

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

    _createClass(LayerWithOverlappedPointComponent, [{
      key: "_handleClick",
      value: function _handleClick(properties, lngLat, event, meta, callback) {
        if (!_.isArray(properties)) {
          if (_.isFunction(callback)) {
            callback(properties, lngLat, event, meta);
          }

          return true;
        }

        var onClickOverlappedPoints = this.props.onClickOverlappedPoints;
        var map = this.getMapInstance();
        var features = properties.map(function (prop) {
          return createPoint(prop.coordinates, prop);
        });
        var data = createFeatureCollection(features);
        var points = findPointsWithSameLocation(data, lngLat, map, ClusterOptions.NearestPointsRadius, ClusterOptions.ZoomLevel);

        if (points) {
          if (_.isFunction(onClickOverlappedPoints)) {
            onClickOverlappedPoints(features, lngLat, event, meta);
            return false;
          }
        } else if (_.isFunction(callback)) {
          callback(properties, lngLat, event, meta);
        }

        return true;
      }
    }, {
      key: "render",
      value: function render() {
        var props = _objectSpread({}, this.props, {
          onClick: this.onClick,
          onClusterClick: this.onClusterClick
        });

        return React.createElement(WrappedComponent, props);
      }
    }]);

    return LayerWithOverlappedPointComponent;
  }(MappedComponent);

  LayerWithOverlappedPointComponent.contextTypes = {
    map: PropTypes.object
  };
  LayerWithOverlappedPointComponent.propTypes = _objectSpread({}, WrappedComponent.propTypes, {
    /**
     * [Optional] Handle when user click on a location which has overlapped points
     */
    onClickOverlappedPoints: PropTypes.func
  });
  LayerWithOverlappedPointComponent.defaultProps = _objectSpread({}, WrappedComponent.defaultProps);
  return LayerWithOverlappedPointComponent;
};

export default detectLocationHasOverlappedPoints;