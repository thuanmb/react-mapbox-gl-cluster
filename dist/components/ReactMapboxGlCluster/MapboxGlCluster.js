"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _hoc = require("../../common/hoc");

var _ClusterLayer = _interopRequireDefault(require("./ClusterLayer"));

var ClusterLayerWithOverlappedPoints = (0, _hoc.detectLocationHasOverlappedPoints)(_ClusterLayer.default);
var ZoomableClusterLayer = (0, _hoc.doZoomingOnClick)(ClusterLayerWithOverlappedPoints);
var MapboxGlCluster = (0, _hoc.connectWithSpiderifierPoint)(ZoomableClusterLayer);
var _default = MapboxGlCluster;
exports.default = _default;