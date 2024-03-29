"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.groupNearestPointsByRadius = exports.findPointsWithSameLocation = exports.createClusters = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _supercluster = _interopRequireDefault(require("supercluster"));

var _invariant = require("@turf/invariant");

var _mapboxGl = require("mapbox-gl");

var _GeoJSONTypes = require("../constants/GeoJSONTypes");

const RADIUS_TO_EXTENDS = 200;

const checkCollectionGeoJSON = data => _GeoJSONTypes.CollectionTypes.indexOf(data.type) !== -1;

const createBoundsFromCoordinates = (coordinates, bounds) => {
  if (bounds == null) {
    return new _mapboxGl.LngLatBounds(coordinates, coordinates);
  }

  return bounds.extend(coordinates);
};

const extendBounds = function (boundary) {
  let radius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
  const boundObj = new _mapboxGl.LngLatBounds(boundary);
  const ne = boundObj.getNorthEast();
  const neBound = ne.toBounds(radius / 2);
  const sw = boundObj.getSouthWest();
  const swBound = sw.toBounds(radius / 2);
  return _lodash.default.flatten([swBound.getSouthWest().toArray(), neBound.getNorthEast().toArray()]);
};

const flattenCoordinates = (coordinates, positionType) => {
  let depth;

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

  return _lodash.default.flattenDepth(coordinates, depth);
};

const getCoordinateForPosition = function (position) {
  let geoJSONType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _GeoJSONTypes.GeoJSONTypes.FeatureCollection;

  if (geoJSONType === _GeoJSONTypes.GeoJSONTypes.FeatureCollection) {
    return position.geometry.coordinates;
  }

  return position.coordinates;
};

const getFeatureList = geoJSON => {
  const {
    type
  } = geoJSON;
  const key = _GeoJSONTypes.ListKeysByType[type];
  return geoJSON[key];
};

const getTypeForPosition = (position, geoJSONType) => {
  if (geoJSONType === _GeoJSONTypes.GeoJSONTypes.FeatureCollection) {
    return position.geometry.type;
  }

  return position.type;
};

const roundCoords = coords => [_lodash.default.round(coords[0], 4), _lodash.default.round(coords[1], 4)];
/**
 * Calculate the boundary of a geojson
 * @param {object} data a geojson in any format
 * @param? {*} totalBounds [Optional] if given, the boundary will be calculated base on the current "totalBounds"
 * @return {LngLatBounds} the total boundary
 */


const calculateBoundary = function (data) {
  let totalBounds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  const {
    type
  } = data;

  if (checkCollectionGeoJSON(data)) {
    const features = getFeatureList(data);
    features.forEach(feature => {
      let coordinates = getCoordinateForPosition(feature, type);
      let featureType = getTypeForPosition(feature, type);
      coordinates = flattenCoordinates(coordinates, featureType);

      if (!_lodash.default.isArray(coordinates)) {
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

  const coordinates = (0, _invariant.getCoord)(data);
  return createBoundsFromCoordinates(coordinates, totalBounds);
};
/**
 * Find the list of point that inside a specific radius
 * @param {FeatureCollection<Point>} data Required. A FeatureCollection of Point type
 * @param {MapBox} mapBox Required. The mapbox instance
 * @param {number} zoom The zoom level, at which the points is clustered
 * @return {Array<Feature>} The list of feature
 */


const createClusters = function (data, mapBox) {
  let radius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60;
  let zoom = arguments.length > 3 ? arguments[3] : undefined;

  if (!data || !data.features || !_lodash.default.isArray(data.features)) {
    throw new Error("Data cannot be empty");
  }

  if (!mapBox) {
    throw new Error("Mapbox instance must be provided");
  }

  const superC = new _supercluster.default({
    radius,
    maxZoom: mapBox.getMaxZoom()
  });
  const featureList = getFeatureList(data);
  superC.load(featureList);

  if (!zoom) {
    zoom = mapBox.getZoom();
  }

  let boundary = _lodash.default.isEmpty(featureList) ? [0, 0, 0, 0] : _lodash.default.flatten(calculateBoundary(data).toArray()); // in case of all points at the same location,
  // extends its coords by 200 meters radius to make superC work.

  boundary = extendBounds(boundary, RADIUS_TO_EXTENDS);
  const clusters = featureList.length > 1 ? superC.getClusters(boundary, Math.round(zoom)) : featureList;
  return {
    superC,
    clusters
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


exports.createClusters = createClusters;

const findPointsWithSameLocation = function (data, lngLat, mapBox) {
  let radius = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 5;
  let zoom = arguments.length > 4 ? arguments[4] : undefined;

  if (!data || !data.features || !_lodash.default.isArray(data.features)) {
    throw new Error("Data cannot be empty");
  }

  if (!lngLat || !_lodash.default.isArray(lngLat)) {
    throw new Error("Specific location cannot be empty");
  }

  if (!mapBox) {
    throw new Error("Mapbox instance must be provided");
  }

  const {
    clusters,
    superC
  } = createClusters(data, mapBox, radius, zoom);
  const clusterAtLngLat = clusters.find(cluster => _lodash.default.isEqual(roundCoords(cluster.geometry.coordinates), roundCoords(lngLat)));

  if (clusterAtLngLat) {
    const {
      cluster,
      cluster_id,
      point_count
    } = clusterAtLngLat.properties;

    if (cluster && point_count > 1) {
      try {
        return superC.getLeaves(cluster_id, Infinity);
      } catch (e) {
        return null;
      }
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


exports.findPointsWithSameLocation = findPointsWithSameLocation;

const groupNearestPointsByRadius = function (data, mapBox) {
  let radius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60;

  if (!data || !data.features || !_lodash.default.isArray(data.features)) {
    throw new Error("Data cannot be empty");
  }

  if (!mapBox) {
    throw new Error("Mapbox instance must be provided");
  }

  const zoom = mapBox.getMaxZoom() - 2;
  let {
    clusters,
    superC
  } = createClusters(data, mapBox, radius, zoom);
  clusters = clusters.map(cluster => {
    const {
      cluster: isCluster,
      cluster_id
    } = cluster.properties;

    if (isCluster) {
      try {
        return superC.getLeaves(cluster_id, Infinity);
      } catch (e) {
        return null;
      }
    }

    return [cluster];
  });
  return _lodash.default.filter(clusters);
};

exports.groupNearestPointsByRadius = groupNearestPointsByRadius;