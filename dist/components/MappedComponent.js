"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _reactMapboxGl = require("react-mapbox-gl");

class MappedComponent extends _react.Component {
  getMapInstance() {
    return this.context;
  }

}

MappedComponent.contextType = _reactMapboxGl.MapContext;
var _default = MappedComponent;
exports.default = _default;