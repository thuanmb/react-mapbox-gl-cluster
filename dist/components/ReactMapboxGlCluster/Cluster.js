import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _get from "@babel/runtime/helpers/esm/get";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Cluster } from "react-mapbox-gl/lib-esm/cluster";
import { withMap } from "react-mapbox-gl/lib-esm/context";
import _ from "lodash";

var OverridedCluster =
/*#__PURE__*/
function (_Cluster) {
  _inherits(OverridedCluster, _Cluster);

  function OverridedCluster() {
    _classCallCheck(this, OverridedCluster);

    return _possibleConstructorReturn(this, _getPrototypeOf(OverridedCluster).apply(this, arguments));
  }

  _createClass(OverridedCluster, [{
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
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this$props = this.props,
          children = _this$props.children,
          map = _this$props.map;

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