"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = _interopRequireDefault(require("lodash"));

var _mapboxGl = _interopRequireDefault(require("mapbox-gl"));

var _utils = require("../../common/utils");

var _MappedComponent = _interopRequireDefault(require("../MappedComponent"));

class MarkerLayer extends _MappedComponent.default {
  constructor() {
    super(...arguments);

    this._disableMapDragPan = () => {
      const map = this.getMapInstance();

      if (map) {
        map.dragPan.disable();
      }
    };

    this._enableMapDragPan = () => {
      const map = this.getMapInstance();

      if (map) {
        map.dragPan.enable();
      }
    };

    this._generateEventHander = eventName => e => {
      const handler = this.props[eventName];

      if (_lodash.default.isFunction(handler)) {
        const {
          coordinates
        } = this.props;
        const properties = this.getProperties();
        handler(properties, coordinates, this.getOffset(), e);
      }
    };
  }

  componentDidMount() {
    const node = this.attachChildren(this.props);
    this.layer = new _mapboxGl.default.Marker(node).setLngLat(this.props.coordinates).addTo(this.getMapInstance());
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.coordinates !== this.props.coordinates) {
      this.layer.setLngLat(prevProps.coordinates);
    }

    if (prevProps.children !== this.props.children || (0, _utils.checkPropsChange)(this.props, prevProps, ["style", "className"])) {
      this.attachChildren(prevProps);
    }
  }

  componentWillUnmount() {
    if (!this.layer) {
      return;
    }

    this.layer.remove();
    delete this.layer;
  }

  attachChildren() {
    let props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
    const {
      children
    } = props;

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

      _reactDom.default.render(content, this.element);
    }

    return this.element;
  }

  getContainerClassName(props) {
    return `mapboxgl-marker ${props.className}`;
  }

  getContent(props) {
    const {
      children
    } = props;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "nio-marker-content f-width f-height"
    }, children);
  }

  getProperties() {
    return this.props.properties;
  }

  getOffset() {
    return [0, 0];
  }

  getStyle(props) {
    return _lodash.default.clone(props.style) || {};
  }

  _bindEvents() {
    const events = (0, _utils.extractEventHandlers)(this.props);
    this.realHandlers = {};

    _lodash.default.forEach(events, (handler, name) => {
      const realHandler = this._generateEventHander(name);

      this.element.addEventListener((0, _utils.getExactEventHandlerName)(name), realHandler);
      this.realHandlers[name] = realHandler;
    });

    this.element.addEventListener("mousedown", this._disableMapDragPan);
    this.element.addEventListener("mouseup", this._enableMapDragPan);
  }

  _unbindEvents() {
    const events = (0, _utils.extractEventHandlers)(this.props);
    this.element.removeEventListener("mousedown", this._disableMapDragPan);
    this.element.removeEventListener("mouseup", this._enableMapDragPan);

    _lodash.default.forEach(events, (handler, name) => {
      const realHandler = this.realHandlers[name];
      this.element.removeEventListener((0, _utils.getExactEventHandlerName)(name), realHandler);
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
  coordinates: _propTypes.default.array.isRequired,

  /**
   * Properties of each Marker, will be passed back when events trigged
   */
  properties: _propTypes.default.oneOfType([_propTypes.default.array.isRequired, _propTypes.default.object.isRequired, _propTypes.default.string.isRequired]),

  /**
   * Apply the className to the container of the Marker
   */
  className: _propTypes.default.string,

  /**
   * Apply style to the Marker container
   */
  style: _propTypes.default.object,

  /**
   * Child node(s) of the component, to be rendered as custom Marker
   */
  children: _propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.arrayOf(_propTypes.default.node)]),

  /**
   * [Optional] The click event handler
   */
  onClick: _propTypes.default.func,

  /**
   * [Optional] The mouse down event handler
   */
  onMouseDown: _propTypes.default.func,

  /**
   * [Optional] The mouse enter event handler
   */
  onMouseEnter: _propTypes.default.func,

  /**
   * [Optional] The mouse leave event handler
   */
  onMouseLeave: _propTypes.default.func,

  /**
   * [Optional] The mouse move event handler
   */
  onMouseMove: _propTypes.default.func,

  /**
   * [Optional] The mouse out event handler
   */
  onMouseOut: _propTypes.default.func,

  /**
   * [Optional] The mouse over event handler
   */
  onMouseOver: _propTypes.default.func,

  /**
   * [Optional] The mouse up event handler
   */
  onMouseUp: _propTypes.default.func
};
var _default = MarkerLayer;
exports.default = _default;