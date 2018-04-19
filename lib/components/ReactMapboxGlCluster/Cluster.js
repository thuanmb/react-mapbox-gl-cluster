"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _reactMapboxGl = require("react-mapbox-gl");

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OverridedCluster = function (_Cluster) {
  _inherits(OverridedCluster, _Cluster);

  function OverridedCluster() {
    _classCallCheck(this, OverridedCluster);

    return _possibleConstructorReturn(this, (OverridedCluster.__proto__ || Object.getPrototypeOf(OverridedCluster)).apply(this, arguments));
  }

  _createClass(OverridedCluster, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (_get(OverridedCluster.prototype.__proto__ || Object.getPrototypeOf(OverridedCluster.prototype), "componentWillUnmount", this)) {
        _get(OverridedCluster.prototype.__proto__ || Object.getPrototypeOf(OverridedCluster.prototype), "componentWillUnmount", this).call(this);
      }

      if (!map) {
        return;
      }

      var map = this.context.map;
      map.off("zoom", this.mapChange);
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      var map = this.context.map;

      if (!map) {
        return;
      }

      var children = this.props.children;

      if (children) {
        this.childrenChange(children);
      }
      map.on("zoom", this.mapChange);
      this.mapChange();
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var clusterPoints = this.state.clusterPoints;
      var nextClusterPoints = nextState.clusterPoints;


      return !_lodash2.default.isEqual(this.props, nextProps) || !_lodash2.default.isEqual(clusterPoints, nextClusterPoints);
    }
  }]);

  return OverridedCluster;
}(_reactMapboxGl.Cluster);

OverridedCluster.displayName = "Cluster";

exports.default = OverridedCluster;