import { Cluster } from "react-mapbox-gl";
import _ from "lodash";

class OverridedCluster extends Cluster {
  componentWillUnmount() {
    if (super.componentWillUnmount) {
      super.componentWillUnmount();
    }

    if (!map) {
      return;
    }

    const map = this.context.map;
    map.off("zoom", this.mapChange);
  }

  componentWillMount() {
    const { map } = this.context;
    if (!map) {
      return;
    }

    const { children } = this.props;
    if (children) {
      this.childrenChange(children);
    }
    map.on("zoom", this.mapChange);
    this.mapChange();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { clusterPoints } = this.state;
    const { clusterPoints: nextClusterPoints } = nextState;

    return (
      !_.isEqual(this.props, nextProps) ||
      !_.isEqual(clusterPoints, nextClusterPoints)
    );
  }
}

OverridedCluster.displayName = "Cluster";

export default OverridedCluster;
