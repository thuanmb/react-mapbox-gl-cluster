import { Cluster } from "react-mapbox-gl/lib-esm/cluster";
import { withMap } from "react-mapbox-gl/lib-esm/context";
import _ from "lodash";

class OverridedCluster extends Cluster {
	componentWillUnmount() {
		if (super.componentWillUnmount) {
			super.componentWillUnmount();
		}

		const { map } = this.props;
		if (!map) {
			return;
		}

		map.off("zoom", this.mapChange);
	}

	componentDidUpdate() {
		const { children, map } = this.props;
		if (!map) {
			return;
		}

		if (children) {
			this.childrenChange(children);
		}
		map.on("zoom", this.mapChange);
		this.mapChange();
	}

	shouldComponentUpdate(nextProps, nextState) {
		const { clusterPoints } = this.state;
		const { clusterPoints: nextClusterPoints } = nextState;

		return !_.isEqual(this.props, nextProps) || !_.isEqual(clusterPoints, nextClusterPoints);
	}
}

OverridedCluster.displayName = "Cluster";

export default withMap(OverridedCluster);
