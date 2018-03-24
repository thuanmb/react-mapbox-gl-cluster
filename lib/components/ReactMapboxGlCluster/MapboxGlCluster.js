"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hoc = require("../../common/hoc");

var _ClusterLayer = require("./ClusterLayer");

var _ClusterLayer2 = _interopRequireDefault(_ClusterLayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ClusterLayerWithOverlappedPoints = (0, _hoc.detectLocationHasOverlappedPoints)(_ClusterLayer2.default);

var ZoomableClusterLayer = (0, _hoc.doZoomingOnClick)(ClusterLayerWithOverlappedPoints);

var MapboxGlCluster = (0, _hoc.connectWithSpiderifierPoint)(ZoomableClusterLayer);

exports.default = MapboxGlCluster;