import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import {
  featureCollection as createFeatureCollection,
  point as createPoint
} from "@turf/helpers";
import { findPointsWithSameLocation } from "../utils";
import { ClusterOptions } from "../constants/ClusterOptions";
import MappedComponent from "../../components/MappedComponent";

const detectLocationHasOverlappedPoints = WrappedComponent => {
  class LayerWithOverlappedPointComponent extends MappedComponent {
    static contextTypes = {
      map: PropTypes.object
    };

    onClick = (properties, lngLat, event, meta) => {
      const { onClick } = this.props;
      this._handleClick(properties, lngLat, event, meta, onClick);
    };

    onClusterClick = (properties, lngLat, event, meta) => {
      const { onClusterClick } = this.props;
      this._handleClick(properties, lngLat, event, meta, onClusterClick);
    };

    _handleClick(properties, lngLat, event, meta, callback) {
      if (!_.isArray(properties)) {
        if (_.isFunction(callback)) {
          callback(properties, lngLat, event, meta);
        }

        return true;
      }
      const { onClickOverlappedPoints } = this.props;
      const map = this.getMapInstance();
      const features = properties.map(prop =>
        createPoint(prop.coordinates, prop)
      );
      const data = createFeatureCollection(features);
      const points = findPointsWithSameLocation(
        data,
        lngLat,
        map,
        ClusterOptions.NearestPointsRadius,
        ClusterOptions.ZoomLevel
      );
      if (points) {
        if (_.isFunction(onClickOverlappedPoints)) {
          onClickOverlappedPoints(features, lngLat, event, meta);
          return false;
        }
      } else if (_.isFunction(callback)) {
        callback(properties, lngLat, event, meta);
      }

      return true;
    }

    render() {
      const props = {
        ...this.props,
        onClick: this.onClick,
        onClusterClick: this.onClusterClick
      };

      return <WrappedComponent {...props} />;
    }
  }

  LayerWithOverlappedPointComponent.propTypes = {
    ...WrappedComponent.propTypes,
    /**
     * [Optional] Handle when user click on a location which has overlapped points
     */
    onClickOverlappedPoints: PropTypes.func
  };

  LayerWithOverlappedPointComponent.defaultProps = {
    ...WrappedComponent.defaultProps
  };

  return LayerWithOverlappedPointComponent;
};

export default detectLocationHasOverlappedPoints;
