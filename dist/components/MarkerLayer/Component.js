import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _createSuper from "@babel/runtime/helpers/esm/createSuper";
import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import _ from "lodash";
import MapboxGl from "mapbox-gl";
import { checkPropsChange, extractEventHandlers, getExactEventHandlerName } from "../../common/utils";
import MappedComponent from "../MappedComponent";

var MarkerLayer = /*#__PURE__*/function (_MappedComponent) {
  _inherits(MarkerLayer, _MappedComponent);

  var _super = _createSuper(MarkerLayer);

  function MarkerLayer() {
    var _this;

    _classCallCheck(this, MarkerLayer);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _this._disableMapDragPan = function () {
      var map = _this.getMapInstance();

      if (map) {
        map.dragPan.disable();
      }
    };

    _this._enableMapDragPan = function () {
      var map = _this.getMapInstance();

      if (map) {
        map.dragPan.enable();
      }
    };

    _this._generateEventHander = function (eventName) {
      return function (e) {
        var handler = _this.props[eventName];

        if (_.isFunction(handler)) {
          var coordinates = _this.props.coordinates;

          var properties = _this.getProperties();

          handler(properties, coordinates, _this.getOffset(), e);
        }
      };
    };

    return _this;
  }

  _createClass(MarkerLayer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var node = this.attachChildren(this.props);
      this.layer = new MapboxGl.Marker(node).setLngLat(this.props.coordinates).addTo(this.getMapInstance());
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (prevProps.coordinates !== this.props.coordinates) {
        this.layer.setLngLat(prevProps.coordinates);
      }

      if (prevProps.children !== this.props.children || checkPropsChange(this.props, prevProps, ["style", "className"])) {
        this.attachChildren(prevProps);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.layer.remove();
      delete this.layer;
    }
  }, {
    key: "attachChildren",
    value: function attachChildren() {
      var _this2 = this;

      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
      var children = props.children;

      if (children) {
        if (!this.element) {
          this.element = document.createElement("div");
        } else {
          this._unbindEvents();
        }

        var style = this.getStyle(this.props);
        this.element.className = this.getContainerClassName(props);
        Object.keys(style).forEach(function (s) {
          _this2.element.style[s] = style[s];
        });

        this._bindEvents();

        var content = this.getContent(props);
        ReactDOM.render(content, this.element);
      }

      return this.element;
    }
  }, {
    key: "getContainerClassName",
    value: function getContainerClassName(props) {
      return "mapboxgl-marker ".concat(props.className);
    }
  }, {
    key: "getContent",
    value: function getContent(props) {
      var children = props.children;
      return /*#__PURE__*/React.createElement("div", {
        className: "nio-marker-content f-width f-height"
      }, children);
    }
  }, {
    key: "getProperties",
    value: function getProperties() {
      return this.props.properties;
    }
  }, {
    key: "getOffset",
    value: function getOffset() {
      return [0, 0];
    }
  }, {
    key: "getStyle",
    value: function getStyle(props) {
      return _.clone(props.style) || {};
    }
  }, {
    key: "_bindEvents",
    value: function _bindEvents() {
      var _this3 = this;

      var events = extractEventHandlers(this.props);
      this.realHandlers = {};

      _.forEach(events, function (handler, name) {
        var realHandler = _this3._generateEventHander(name);

        _this3.element.addEventListener(getExactEventHandlerName(name), realHandler);

        _this3.realHandlers[name] = realHandler;
      });

      this.element.addEventListener("mousedown", this._disableMapDragPan);
      this.element.addEventListener("mouseup", this._enableMapDragPan);
    }
  }, {
    key: "_unbindEvents",
    value: function _unbindEvents() {
      var _this4 = this;

      var events = extractEventHandlers(this.props);
      this.element.removeEventListener("mousedown", this._disableMapDragPan);
      this.element.removeEventListener("mouseup", this._enableMapDragPan);

      _.forEach(events, function (handler, name) {
        var realHandler = _this4.realHandlers[name];

        _this4.element.removeEventListener(getExactEventHandlerName(name), realHandler);
      });

      delete this.realHandlers;
    }
  }, {
    key: "render",
    value: function render() {
      return null;
    }
  }]);

  return MarkerLayer;
}(MappedComponent);

MarkerLayer.displayName = "MarkerLayer";
MarkerLayer.propTypes = {
  /**
   * (required): [number, number] Display the Marker at the given position
   */
  coordinates: PropTypes.array.isRequired,

  /**
   * Properties of each Marker, will be passed back when events trigged
   */
  properties: PropTypes.oneOfType([PropTypes.array.isRequired, PropTypes.object.isRequired, PropTypes.string.isRequired]),

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