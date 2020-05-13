import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import _ from "lodash";
import MapboxGl from "mapbox-gl";
import { checkPropsChange, extractEventHandlers, getExactEventHandlerName } from "../../common/utils";
import MappedComponent from "../MappedComponent";

class MarkerLayer extends MappedComponent {
	componentDidMount() {
		const node = this.attachChildren(this.props);
		this.layer = new MapboxGl.Marker(node).setLngLat(this.props.coordinates).addTo(this.getMapInstance());
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.coordinates !== this.props.coordinates) {
			this.layer.setLngLat(prevProps.coordinates);
		}
		if (prevProps.children !== this.props.children || checkPropsChange(this.props, prevProps, ["style", "className"])) {
			this.attachChildren(prevProps);
		}
	}

	componentWillUnmount() {
		this.layer.remove();
		delete this.layer;
	}

	attachChildren(props = this.props) {
		const { children } = props;

		if (children) {
			if (!this.element) {
				this.element = document.createElement("div");
			} else {
				this._unbindEvents();
			}

			const style = this.getStyle(this.props);
			this.element.className = this.getContainerClassName(props);
			Object.keys(style).forEach(s => {
				this.element.style[s] = style[s];
			});
			this._bindEvents();

			const content = this.getContent(props);
			ReactDOM.render(content, this.element);
		}

		return this.element;
	}

	getContainerClassName(props) {
		return `mapboxgl-marker ${props.className}`;
	}

	getContent(props) {
		const { children } = props;
		return <div className="nio-marker-content f-width f-height">{children}</div>;
	}

	getProperties() {
		return this.props.properties;
	}

	getOffset() {
		return [0, 0];
	}

	getStyle(props) {
		return _.clone(props.style) || {};
	}

	_bindEvents() {
		const events = extractEventHandlers(this.props);
		this.realHandlers = {};
		_.forEach(events, (handler, name) => {
			const realHandler = this._generateEventHander(name);
			this.element.addEventListener(getExactEventHandlerName(name), realHandler);
			this.realHandlers[name] = realHandler;
		});
		this.element.addEventListener("mousedown", this._disableMapDragPan);
		this.element.addEventListener("mouseup", this._enableMapDragPan);
	}

	_disableMapDragPan = () => {
		const map = this.getMapInstance();
		if (map) {
			map.dragPan.disable();
		}
	};

	_enableMapDragPan = () => {
		const map = this.getMapInstance();
		if (map) {
			map.dragPan.enable();
		}
	};

	_generateEventHander = eventName => e => {
		const handler = this.props[eventName];
		if (_.isFunction(handler)) {
			const { coordinates } = this.props;
			const properties = this.getProperties();
			handler(properties, coordinates, this.getOffset(), e);
		}
	};

	_unbindEvents() {
		const events = extractEventHandlers(this.props);
		this.element.removeEventListener("mousedown", this._disableMapDragPan);
		this.element.removeEventListener("mouseup", this._enableMapDragPan);
		_.forEach(events, (handler, name) => {
			const realHandler = this.realHandlers[name];
			this.element.removeEventListener(getExactEventHandlerName(name), realHandler);
		});

		delete this.realHandlers;
	}

	render() {
		return null;
	}
}

MarkerLayer.displayName = "MarkerLayer";

MarkerLayer.propTypes = {
	/**
	 * (required): [number, number] Display the Marker at the given position
	 */
	coordinates: PropTypes.array.isRequired,

	/**
	 * Properties of each Marker, will be passed back when events trigged
	 */
	properties: PropTypes.oneOfType([
		PropTypes.array.isRequired,
		PropTypes.object.isRequired,
		PropTypes.string.isRequired
	]),

	/**
	 * Apply the className to the container of the Marker
	 */
	className: PropTypes.string,

	/**
	 * Apply style to the Marker container
	 */
	style: PropTypes.object,

	/**
	 * Child node(s) of the component, to be rendered as custom Marker
	 */
	children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),

	/**
	 * [Optional] The click event handler
	 */
	onClick: PropTypes.func,

	/**
	 * [Optional] The mouse down event handler
	 */
	onMouseDown: PropTypes.func,

	/**
	 * [Optional] The mouse enter event handler
	 */
	onMouseEnter: PropTypes.func,

	/**
	 * [Optional] The mouse leave event handler
	 */
	onMouseLeave: PropTypes.func,

	/**
	 * [Optional] The mouse move event handler
	 */
	onMouseMove: PropTypes.func,

	/**
	 * [Optional] The mouse out event handler
	 */
	onMouseOut: PropTypes.func,

	/**
	 * [Optional] The mouse over event handler
	 */
	onMouseOver: PropTypes.func,

	/**
	 * [Optional] The mouse up event handler
	 */
	onMouseUp: PropTypes.func
};

export default MarkerLayer;
