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

const NormalTypes = [
  GeoJSONTypes.Point,
  GeoJSONTypes.MultiPoint,
  GeoJSONTypes.LineString,
  GeoJSONTypes.MultiLineString,
  GeoJSONTypes.Polygon,
  GeoJSONTypes.MultiPolygon
];

const CollectionTypes = [
  GeoJSONTypes.GeometryCollection,
  GeoJSONTypes.FeatureCollection
];

const ListKeysByType = {
  [GeoJSONTypes.GeometryCollection]: "geometries",
  [GeoJSONTypes.FeatureCollection]: "features"
};

export { GeoJSONTypes, NormalTypes, CollectionTypes, ListKeysByType };
