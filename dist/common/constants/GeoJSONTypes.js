"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NormalTypes = exports.ListKeysByType = exports.GeoJSONTypes = exports.CollectionTypes = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/defineProperty"));

var _ListKeysByType;

var GeoJSONTypes = {
  Point: "Point",
  MultiPoint: "MultiPoint",
  LineString: "LineString",
  MultiLineString: "MultiLineString",
  Polygon: "Polygon",
  MultiPolygon: "MultiPolygon",
  GeometryCollection: "GeometryCollection",
  FeatureCollection: "FeatureCollection"
};
exports.GeoJSONTypes = GeoJSONTypes;
var NormalTypes = [GeoJSONTypes.Point, GeoJSONTypes.MultiPoint, GeoJSONTypes.LineString, GeoJSONTypes.MultiLineString, GeoJSONTypes.Polygon, GeoJSONTypes.MultiPolygon];
exports.NormalTypes = NormalTypes;
var CollectionTypes = [GeoJSONTypes.GeometryCollection, GeoJSONTypes.FeatureCollection];
exports.CollectionTypes = CollectionTypes;
var ListKeysByType = (_ListKeysByType = {}, (0, _defineProperty2.default)(_ListKeysByType, GeoJSONTypes.GeometryCollection, "geometries"), (0, _defineProperty2.default)(_ListKeysByType, GeoJSONTypes.FeatureCollection, "features"), _ListKeysByType);
exports.ListKeysByType = ListKeysByType;