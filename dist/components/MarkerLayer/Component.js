"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/inherits"));

var _createSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/createSuper"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = _interopRequireDefault(require("lodash"));

var _mapboxGl = _interopRequireDefault(require("mapbox-gl"));

var _utils = require("../../common/utils");

var _MappedComponent2 = _interopRequireDefault(require("../MappedComponent"));

var MarkerLayer = /*#__PURE__*/function (_MappedComponent) {
  (0, _inherits2.default)(MarkerLayer, _MappedComponent);

  var _super = (0, _createSuper2.default)(MarkerLayer);

  function MarkerLayer() {
    var _this;

    (0, _classCallCheck2.default)(this, MarkerLayer);

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

        if (_lodash.default.isFunction(handler)) {
          var coordinates = _this.props.coordinates;

          var properties = _this.getProperties();

          handler(properties, coordinates, _this.getOffset(), e);
        }
      };
    };

    return _this;
  }

  (0, _createClass2.default)(MarkerLayer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var node = this.attachChildren(this.props);
      this.layer = new _mapboxGl.default.Marker(node).setLngLat(this.props.coordinates).addTo(this.getMapInstance());
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (prevProps.coordinates !== this.props.coordinates) {
        this.layer.setLngLat(prevProps.coordinates);
      }

      if (prevProps.children !== this.props.children || (0, _utils.checkPropsChange)(this.props, prevProps, ["style", "className"])) {
        this.attachChildren(prevProps);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (!this.layer) {
        return;
      }

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

        _reactDom.default.render(content, this.element);
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
      return /*#__PURE__*/_react.default.createElement("div", {
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
      return _lodash.default.clone(props.style) || {};
    }
  }, {
    key: "_bindEvents",
    value: function _bindEvents() {
      var _this3 = this;

      var events = (0, _utils.extractEventHandlers)(this.props);
      this.realHandlers = {};

      _lodash.default.forEach(events, function (handler, name) {
        var realHandler = _this3._generateEventHander(name);

        _this3.element.addEventListener((0, _utils.getExactEventHandlerName)(name), realHandler);

        _this3.realHandlers[name] = realHandler;
      });

      this.element.addEventListener("mousedown", this._disableMapDragPan);
      this.element.addEventListener("mouseup", this._enableMapDragPan);
    }
  }, {
    key: "_unbindEvents",
    value: function _unbindEvents() {
      var _this4 = this;

      var events = (0, _utils.extractEventHandlers)(this.props);
      this.element.removeEventListener("mousedown", this._disableMapDragPan);
      this.element.removeEventListener("mouseup", this._enableMapDragPan);

      _lodash.default.forEach(events, function (handler, name) {
        var realHandler = _this4.realHandlers[name];

        _this4.element.removeEventListener((0, _utils.getExactEventHandlerName)(name), realHandler);
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
}(_MappedComponent2.default);

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