import { Component } from "react";
import { MapContext } from "react-mapbox-gl";

class MappedComponent extends Component {
	static contextType = MapContext;

	getMapInstance() {
		return this.context;
	}
}

export default MappedComponent;
