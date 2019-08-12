import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

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
var NormalTypes = [GeoJSONTypes.Point, GeoJSONTypes.MultiPoint, GeoJSONTypes.LineString, GeoJSONTypes.MultiLineString, GeoJSONTypes.Polygon, GeoJSONTypes.MultiPolygon];
var CollectionTypes = [GeoJSONTypes.GeometryCollection, GeoJSONTypes.FeatureCollection];
var ListKeysByType = (_ListKeysByType = {}, _defineProperty(_ListKeysByType, GeoJSONTypes.GeometryCollection, "geometries"), _defineProperty(_ListKeysByType, GeoJSONTypes.FeatureCollection, "features"), _ListKeysByType);
export { GeoJSONTypes, NormalTypes, CollectionTypes, ListKeysByType };