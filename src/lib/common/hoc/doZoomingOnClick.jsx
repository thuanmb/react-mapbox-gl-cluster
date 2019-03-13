import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import MappedComponent from "../../components/MappedComponent";
import { calculateNextZoomLevel } from "../utils";

const doZoomingOnClick = WrappedComponent => {
  class ZoomableComponent extends MappedComponent {
    static contextTypes = {
      map: PropTypes.object
    };

    onClusterClick = (properties, lngLat, event, meta) => {
      const { onClusterClick } = this.props;
      const map = this.getMapInstance();
      const currentZoom = map.getZoom();
      const maxZoom = map.getMaxZoom();
      const zoom = calculateNextZoomLevel(currentZoom, maxZoom);

      map.flyTo({ center: lngLat, zoom });

      this._handleClick(properties, lngLat, event, meta, onClusterClick);
    };

    _handleClick(properties, lngLat, event, meta, callback) {
      if (_.isFunction(callback)) {
        callback(properties, lngLat, event, meta);
      }
    }

    render() {
      const props = {
        ...this.props,
        onClusterClick: this.onClusterClick
      };

      return <WrappedComponent {...props} />;
    }
  }

  ZoomableComponent.propTypes = {
    ...WrappedComponent.propTypes
  };

  ZoomableComponent.defaultProps = {
    ...WrappedComponent.defaultProps
  };

  return ZoomableComponent;
};

export default doZoomingOnClick;
