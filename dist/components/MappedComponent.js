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

var _react = require("react");

var _reactMapboxGl = require("react-mapbox-gl");

var MappedComponent = /*#__PURE__*/function (_Component) {
  (0, _inherits2.default)(MappedComponent, _Component);

  var _super = (0, _createSuper2.default)(MappedComponent);

  function MappedComponent() {
    (0, _classCallCheck2.default)(this, MappedComponent);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(MappedComponent, [{
    key: "getMapInstance",
    value: function getMapInstance() {
      return this.context;
    }
  }]);
  return MappedComponent;
}(_react.Component);

MappedComponent.contextType = _reactMapboxGl.MapContext;
var _default = MappedComponent;
exports.default = _default;