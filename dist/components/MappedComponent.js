import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _createSuper from "@babel/runtime/helpers/esm/createSuper";
import { Component } from "react";
import { MapContext } from "react-mapbox-gl/lib-esm/context";

var MappedComponent = /*#__PURE__*/function (_Component) {
  _inherits(MappedComponent, _Component);

  var _super = _createSuper(MappedComponent);

  function MappedComponent() {
    _classCallCheck(this, MappedComponent);

    return _super.apply(this, arguments);
  }

  _createClass(MappedComponent, [{
    key: "getMapInstance",
    value: function getMapInstance() {
      return this.context;
    }
  }]);

  return MappedComponent;
}(Component);

MappedComponent.contextType = MapContext;
export default MappedComponent;