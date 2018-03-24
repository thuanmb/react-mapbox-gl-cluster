"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ListKeysByType;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

var NormalTypes = [GeoJSONTypes.Point, GeoJSONTypes.MultiPoint, GeoJSONTypes.LineString, GeoJSONTypes.MultiLineString, GeoJSONTypes.Polygon, GeoJSONTypes.MultiPolygon];

var CollectionTypes = [GeoJSONTypes.GeometryCollection, GeoJSONTypes.FeatureCollection];

var ListKeysByType = (_ListKeysByType = {}, _defineProperty(_ListKeysByType, GeoJSONTypes.GeometryCollection, "geometries"), _defineProperty(_ListKeysByType, GeoJSONTypes.FeatureCollection, "features"), _ListKeysByType);

exports.GeoJSONTypes = GeoJSONTypes;
exports.NormalTypes = NormalTypes;
exports.CollectionTypes = CollectionTypes;
exports.ListKeysByType = ListKeysByType;