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
var ListKeysByType = {
  [GeoJSONTypes.GeometryCollection]: "geometries",
  [GeoJSONTypes.FeatureCollection]: "features"
};
export { GeoJSONTypes, NormalTypes, CollectionTypes, ListKeysByType };