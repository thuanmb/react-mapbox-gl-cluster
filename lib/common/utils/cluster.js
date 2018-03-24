"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.groupNearestPointsByRadius = exports.findPointsWithSameLocation = exports.createClusters = undefined;

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _supercluster = require("supercluster");

var _supercluster2 = _interopRequireDefault(_supercluster);

var _invariant = require("@turf/invariant");

var _mapboxGl = require("mapbox-gl");

var _GeoJSONTypes = require("../constants/GeoJSONTypes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var checkCollectionGeoJSON = function checkCollectionGeoJSON(data) {
  return _GeoJSONTypes.CollectionTypes.indexOf(data.type) !== -1;
};

var createBoundsFromCoordinates = function createBoundsFromCoordinates(coordinates, bounds) {
  if (bounds == null) {
    return new _mapboxGl.LngLatBounds(coordinates, coordinates);
  }

  return bounds.extend(coordinates);
};

var isBoundaryOfSamePoint = function isBoundaryOfSamePoint(boundary) {
  var boundObj = new _mapboxGl.LngLatBounds(boundary);
  return _lodash2.default.isEqual(boundObj.getNorthWest(), boundObj.getSouthEast());
};

var extendBounds = function extendBounds(boundary) {
  var radius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

  var boundObj = new _mapboxGl.LngLatBounds(boundary);
  var nw = boundObj.getNorthWest();
  return _lodash2.default.flatten(nw.toBounds(radius).toArray());
};

var flattenCoordinates = function flattenCoordinates(coordinates, positionType) {
  var depth = void 0;

  switch (positionType) {
    case _GeoJSONTypes.GeoJSONTypes.MultiPoint:
    case _GeoJSONTypes.GeoJSONTypes.LineString:
      depth = 0;
      break;
    case _GeoJSONTypes.GeoJSONTypes.Polygon:
    case _GeoJSONTypes.GeoJSONTypes.MultiLineString:
      depth = 1;
      break;
    case _GeoJSONTypes.GeoJSONTypes.MultiPolygon:
      depth = 2;
      break;
    case _GeoJSONTypes.GeoJSONTypes.Point:
    default:
      depth = -1;
  }

  if (depth === -1) {
    return [coordinates];
  }

  return _lodash2.default.flattenDepth(coordinates, depth);
};

var getCoordinateForPosition = function getCoordinateForPosition(position) {
  var geoJSONType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _GeoJSONTypes.GeoJSONTypes.FeatureCollection;

  if (geoJSONType === _GeoJSONTypes.GeoJSONTypes.FeatureCollection) {
    return position.geometry.coordinates;
  }

  return position.coordinates;
};

var getFeatureList = function getFeatureList(geoJSON) {
  var type = geoJSON.type;

  var key = _GeoJSONTypes.ListKeysByType[type];

  return geoJSON[key];
};

var getTypeForPosition = function getTypeForPosition(position, geoJSONType) {
  if (geoJSONType === _GeoJSONTypes.GeoJSONTypes.FeatureCollection) {
    return position.geometry.type;
  }

  return position.type;
};

var roundCoords = function roundCoords(coords) {
  return [_lodash2.default.round(coords[0], 4), _lodash2.default.round(coords[1], 4)];
};

/**
 * Calculate the boundary of a geojson
 * @param {object} data a geojson in any format
 * @param? {*} totalBounds [Optional] if given, the boundary will be calculated base on the current "totalBounds"
 * @return {LngLatBounds} the total boundary
 */
var calculateBoundary = function calculateBoundary(data) {
  var totalBounds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var type = data.type;


  if (checkCollectionGeoJSON(data)) {
    var features = getFeatureList(data);
    features.forEach(function (feature) {
      var coordinates = getCoordinateForPosition(feature, type);
      var featureType = getTypeForPosition(feature, type);
      coordinates = flattenCoordinates(coordinates, featureType);

      if (!_lodash2.default.isArray(coordinates)) {
        return totalBounds;
      }

      if (!totalBounds) {
        totalBounds = new _mapboxGl.LngLatBounds(coordinates[0], coordinates[0]);
      }

      totalBounds = coordinates.reduce(function (bounds, coord) {
        return bounds.extend(coord);
      }, totalBounds);
    });

    return totalBounds;
  }

  var coordinates = (0, _invariant.getCoord)(data);
  return createBoundsFromCoordinates(coordinates, totalBounds);
};

/**
 * Find the list of point that inside a specific radius
 * @param {FeatureCollection<Point>} data Required. A FeatureCollection of Point type
 * @param {MapBox} mapBox Required. The mapbox instance
 * @param {number} zoom The zoom level, at which the points is clustered
 * @return {Array<Feature>} The list of feature
 */
var createClusters = function createClusters(data, mapBox) {
  var radius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60;
  var zoom = arguments[3];

  if (!data || !data.features || !_lodash2.default.isArray(data.features)) {
    throw new Error("Data cannot be empty");
  }

  if (!mapBox) {
    throw new Error("Mapbox instance must be provided");
  }

  var superC = (0, _supercluster2.default)({
    radius: radius,
    maxZoom: mapBox.getMaxZoom()
  });

  var featureList = getFeatureList(data);
  superC.load(featureList);
  if (!zoom) {
    zoom = mapBox.getZoom();
  }
  var boundary = _lodash2.default.isEmpty(featureList) ? [0, 0, 0, 0] : _lodash2.default.flatten(calculateBoundary(data).toArray());
  // in case of all points at the same location,
  // extends its coords by 100 meters radius to make superC work.
  if (isBoundaryOfSamePoint(boundary)) {
    boundary = extendBounds(boundary);
  }

  var clusters = featureList.length > 1 ? superC.getClusters(boundary, Math.round(zoom)) : featureList;

  return {
    superC: superC,
    clusters: clusters
  };
};

/**
 * Find the list of point that have a similar location (lngLat)
 * @param {FeatureCollection<Point>} data Required. A FeatureCollection of Point type
 * @param {Coordinate} lngLat Required. The coordinate follow format [longitude, latitude]
 * @param {MapBox} mapBox Required. The mapbox instance
 * @param {number} radius The radius of the cluster
 * @param {number} zoom The zoom level, at which the points is clustered
 * @return {Array<Feature>} The list of point at the same location. Null if cannot find the
 * similar points
 */
var findPointsWithSameLocation = function findPointsWithSameLocation(data, lngLat, mapBox) {
  var radius = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 5;
  var zoom = arguments[4];

  if (!data || !data.features || !_lodash2.default.isArray(data.features)) {
    throw new Error("Data cannot be empty");
  }

  if (!lngLat || !_lodash2.default.isArray(lngLat)) {
    throw new Error("Specific location cannot be empty");
  }

  if (!mapBox) {
    throw new Error("Mapbox instance must be provided");
  }

  var _createClusters = createClusters(data, mapBox, radius, zoom),
      clusters = _createClusters.clusters,
      superC = _createClusters.superC;

  var clusterAtLngLat = clusters.find(function (cluster) {
    return _lodash2.default.isEqual(roundCoords(cluster.geometry.coordinates), roundCoords(lngLat));
  });

  if (clusterAtLngLat) {
    var _clusterAtLngLat$prop = clusterAtLngLat.properties,
        cluster = _clusterAtLngLat$prop.cluster,
        cluster_id = _clusterAtLngLat$prop.cluster_id,
        point_count = _clusterAtLngLat$prop.point_count;

    if (cluster && point_count > 1) {
      return superC.getLeaves(cluster_id);
    }
  }

  return null;
};

/**
 * Group the list of point that inside a specific radius
 * @param {FeatureCollection<Point>} data Required. A FeatureCollection of Point type
 * @param {MapBox} mapBox Required. The mapbox instance
 * @param {number} radius Optional. The radius of the cluster
 * @return {Array<Array<Feature>>} The list of grouped feature
 */
var groupNearestPointsByRadius = function groupNearestPointsByRadius(data, mapBox) {
  var radius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60;

  if (!data || !data.features || !_lodash2.default.isArray(data.features)) {
    throw new Error("Data cannot be empty");
  }

  if (!mapBox) {
    throw new Error("Mapbox instance must be provided");
  }

  var zoom = mapBox.getMaxZoom() - 2;

  var _createClusters2 = createClusters(data, mapBox, radius, zoom),
      clusters = _createClusters2.clusters,
      superC = _createClusters2.superC;

  clusters = clusters.map(function (cluster) {
    var _cluster$properties = cluster.properties,
        isCluster = _cluster$properties.cluster,
        cluster_id = _cluster$properties.cluster_id;

    if (isCluster) {
      return superC.getLeaves(cluster_id, Infinity);
    }

    return [cluster];
  });

  return clusters;
};

exports.createClusters = createClusters;
exports.findPointsWithSameLocation = findPointsWithSameLocation;
exports.groupNearestPointsByRadius = groupNearestPointsByRadius;