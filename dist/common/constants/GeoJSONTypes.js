"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NormalTypes = exports.ListKeysByType = exports.GeoJSONTypes = exports.CollectionTypes = void 0;
const GeoJSONTypes = {
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
const NormalTypes = [GeoJSONTypes.Point, GeoJSONTypes.MultiPoint, GeoJSONTypes.LineString, GeoJSONTypes.MultiLineString, GeoJSONTypes.Polygon, GeoJSONTypes.MultiPolygon];
exports.NormalTypes = NormalTypes;
const CollectionTypes = [GeoJSONTypes.GeometryCollection, GeoJSONTypes.FeatureCollection];
exports.CollectionTypes = CollectionTypes;
const ListKeysByType = {
  [GeoJSONTypes.GeometryCollection]: "geometries",
  [GeoJSONTypes.FeatureCollection]: "features"
};
exports.ListKeysByType = ListKeysByType;