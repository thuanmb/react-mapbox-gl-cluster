import _ from "lodash";
import supercluster from "supercluster";
import { getCoord } from "@turf/invariant";
import { LngLatBounds } from "mapbox-gl";
import {
  GeoJSONTypes,
  CollectionTypes,
  ListKeysByType
} from "../constants/GeoJSONTypes";

const RADIUS_TO_EXTENDS = 200;

const checkCollectionGeoJSON = data =>
  CollectionTypes.indexOf(data.type) !== -1;

const createBoundsFromCoordinates = (coordinates, bounds) => {
  if (bounds == null) {
    return new LngLatBounds(coordinates, coordinates);
  }

  return bounds.extend(coordinates);
};

const extendBounds = (boundary, radius = 100) => {
  const boundObj = new LngLatBounds(boundary);
  const ne = boundObj.getNorthEast();
  const neBound = ne.toBounds(radius / 2);
  const sw = boundObj.getSouthWest();
  const swBound = sw.toBounds(radius / 2);
  return _.flatten([
    swBound.getSouthWest().toArray(),
    neBound.getNorthEast().toArray()
  ]);
};

const flattenCoordinates = (coordinates, positionType) => {
  let depth;

  switch (positionType) {
    case GeoJSONTypes.MultiPoint:
    case GeoJSONTypes.LineString:
      depth = 0;
      break;
    case GeoJSONTypes.Polygon:
    case GeoJSONTypes.MultiLineString:
      depth = 1;
      break;
    case GeoJSONTypes.MultiPolygon:
      depth = 2;
      break;
    case GeoJSONTypes.Point:
    default:
      depth = -1;
  }

  if (depth === -1) {
    return [coordinates];
  }

  return _.flattenDepth(coordinates, depth);
};

const getCoordinateForPosition = (
  position,
  geoJSONType = GeoJSONTypes.FeatureCollection
) => {
  if (geoJSONType === GeoJSONTypes.FeatureCollection) {
    return position.geometry.coordinates;
  }

  return position.coordinates;
};

const getFeatureList = geoJSON => {
  const { type } = geoJSON;
  const key = ListKeysByType[type];

  return geoJSON[key];
};

const getTypeForPosition = (position, geoJSONType) => {
  if (geoJSONType === GeoJSONTypes.FeatureCollection) {
    return position.geometry.type;
  }

  return position.type;
};

const roundCoords = coords => [_.round(coords[0], 4), _.round(coords[1], 4)];

/**
 * Calculate the boundary of a geojson
 * @param {object} data a geojson in any format
 * @param? {*} totalBounds [Optional] if given, the boundary will be calculated base on the current "totalBounds"
 * @return {LngLatBounds} the total boundary
 */
const calculateBoundary = (data, totalBounds = null) => {
  const { type } = data;

  if (checkCollectionGeoJSON(data)) {
    const features = getFeatureList(data);
    features.forEach(feature => {
      let coordinates = getCoordinateForPosition(feature, type);
      let featureType = getTypeForPosition(feature, type);
      coordinates = flattenCoordinates(coordinates, featureType);

      if (!_.isArray(coordinates)) {
        return totalBounds;
      }

      if (!totalBounds) {
        totalBounds = new LngLatBounds(coordinates[0], coordinates[0]);
      }

      totalBounds = coordinates.reduce(function(bounds, coord) {
        return bounds.extend(coord);
      }, totalBounds);
    });

    return totalBounds;
  }

  const coordinates = getCoord(data);
  return createBoundsFromCoordinates(coordinates, totalBounds);
};

/**
 * Find the list of point that inside a specific radius
 * @param {FeatureCollection<Point>} data Required. A FeatureCollection of Point type
 * @param {MapBox} mapBox Required. The mapbox instance
 * @param {number} zoom The zoom level, at which the points is clustered
 * @return {Array<Feature>} The list of feature
 */
const createClusters = (data, mapBox, radius = 60, zoom) => {
  if (!data || !data.features || !_.isArray(data.features)) {
    throw new Error("Data cannot be empty");
  }

  if (!mapBox) {
    throw new Error("Mapbox instance must be provided");
  }

  const superC = supercluster({
    radius,
    maxZoom: mapBox.getMaxZoom()
  });

  const featureList = getFeatureList(data);
  superC.load(featureList);
  if (!zoom) {
    zoom = mapBox.getZoom();
  }
  let boundary = _.isEmpty(featureList)
    ? [0, 0, 0, 0]
    : _.flatten(calculateBoundary(data).toArray());
  // in case of all points at the same location,
  // extends its coords by 200 meters radius to make superC work.
  boundary = extendBounds(boundary, RADIUS_TO_EXTENDS);

  const clusters =
    featureList.length > 1
      ? superC.getClusters(boundary, Math.round(zoom))
      : featureList;

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
const findPointsWithSameLocation = (data, lngLat, mapBox, radius = 5, zoom) => {
  if (!data || !data.features || !_.isArray(data.features)) {
    throw new Error("Data cannot be empty");
  }

  if (!lngLat || !_.isArray(lngLat)) {
    throw new Error("Specific location cannot be empty");
  }

  if (!mapBox) {
    throw new Error("Mapbox instance must be provided");
  }

  const { clusters, superC } = createClusters(data, mapBox, radius, zoom);
  const clusterAtLngLat = clusters.find(cluster =>
    _.isEqual(roundCoords(cluster.geometry.coordinates), roundCoords(lngLat))
  );

  if (clusterAtLngLat) {
    const { cluster, cluster_id, point_count } = clusterAtLngLat.properties;
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
const groupNearestPointsByRadius = (data, mapBox, radius = 60) => {
  if (!data || !data.features || !_.isArray(data.features)) {
    throw new Error("Data cannot be empty");
  }

  if (!mapBox) {
    throw new Error("Mapbox instance must be provided");
  }

  const zoom = mapBox.getMaxZoom() - 2;
  let { clusters, superC } = createClusters(data, mapBox, radius, zoom);
  clusters = clusters.map(cluster => {
    const { cluster: isCluster, cluster_id } = cluster.properties;
    if (isCluster) {
      try {
        return superC.getLeaves(cluster_id, Infinity);
      } catch (e) {
        return null;
      }
    }

    return [cluster];
  });

  return _.filter(clusters);
};

export {
  createClusters,
  findPointsWithSameLocation,
  groupNearestPointsByRadius
};
