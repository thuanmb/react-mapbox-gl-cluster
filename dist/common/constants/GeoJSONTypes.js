"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListKeysByType = exports.CollectionTypes = exports.NormalTypes = exports.GeoJSONTypes = void 0;
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
var ListKeysByType = {
  [GeoJSONTypes.GeometryCollection]: "geometries",
  [GeoJSONTypes.FeatureCollection]: "features"
};
exports.ListKeysByType = ListKeysByType;