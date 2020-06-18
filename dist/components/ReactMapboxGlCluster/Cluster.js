import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _get from "@babel/runtime/helpers/esm/get";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _createSuper from "@babel/runtime/helpers/esm/createSuper";
import { Cluster } from "react-mapbox-gl/lib-esm/cluster";
import { withMap } from "react-mapbox-gl/lib-esm/context";
import _ from "lodash";

var OverridedCluster = /*#__PURE__*/function (_Cluster) {
  _inherits(OverridedCluster, _Cluster);

  var _super = _createSuper(OverridedCluster);

  function OverridedCluster() {
    _classCallCheck(this, OverridedCluster);

    return _super.apply(this, arguments);
  }

  _createClass(OverridedCluster, [{
    key: "UNSAFE_componentWillMount",
    value: function UNSAFE_componentWillMount() {
      var _this$props = this.props,
          children = _this$props.children,
          map = _this$props.map;

      if (children) {
        this.childrenChange(children);
      }

      if (!map) {
        return;
      }

      map.on("move", this.mapChange);
      map.on("zoom", this.mapChange);
      this.mapChange();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (_get(_getPrototypeOf(OverridedCluster.prototype), "componentWillUnmount", this)) {
        _get(_getPrototypeOf(OverridedCluster.prototype), "componentWillUnmount", this).call(this);
      }

      var map = this.props.map;

      if (!map) {
        return;
      }

      map.off("zoom", this.mapChange);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var _this$props2 = this.props,
          children = _this$props2.children,
          map = _this$props2.map;

      if (!map) {
        return;
      }

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
      return !_.isEqual(this.props, nextProps) || !_.isEqual(clusterPoints, nextClusterPoints);
    }
  }]);

  return OverridedCluster;
}(Cluster);

OverridedCluster.displayName = "Cluster";
export default withMap(OverridedCluster);