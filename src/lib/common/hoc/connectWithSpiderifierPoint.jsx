import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {checkPropsChange} from '../utils';
import {ReactMapboxGlSpiderifier} from 'react-mapbox-gl-spiderifier';
import {getCoord} from '@turf/invariant';
import {findPointsWithSameLocation, groupNearestPointsByRadius} from '../utils';
import {ClusterOptions} from '../constants/ClusterOptions';
import MappedComponent from '../../components/MappedComponent';
import './spiderifier.css';

const connectWithSpiderifierPoint = WrappedComponent => {
  class ConnectedWithSpiderifierComponent extends MappedComponent {
    constructor(props) {
      super(props);
      this.state = {
        overlappedPointsGroup: null,
      };
      this.registeredEvents = false;
    }

    componentWillMount() {
      this._updatePoints();
      this.bindEvents();
    }

    componentWillReceiveProps(nextProps) {
      this._checkAndUpdatePoints(nextProps);
      this.bindEvents();
    }

    shouldComponentUpdate(nextProps, nextState) {
      return (
        checkPropsChange(
          this.props,
          nextProps,
          [
            'data',
            'showInitialSpiderifier',
            'onlySpiderifier',
            'circleFootSeparation',
            'transformSpiderLeft',
            'showingLegs',
          ],
          _.isEqual,
        ) || !_.isEqual(this.state, nextState)
      );
    }

    componentWillUnmount() {
      this.unbindEvents();
    }

    bindEvents() {
      const map = this.getMapInstance();
      if (map && !this.registeredEvents) {
        map.on('zoomend', this.onMapChange);
        this.registeredEvents = true;
      }
    }
    unbindEvents() {
      const map = this.getMapInstance();
      if (map) {
        map.off('zoomend', this.onMapChange);
      }
    }

    onClickOverlappedPoints = (points, coordinates) => {
      this._updateSpiderifierProps([points], coordinates);
    };

    onSpiderifierRemoved(lngLat) {
      const {overlappedPointsGroup} = this.state;
      if (_.isArray(overlappedPointsGroup)) {
        const removedIndex = overlappedPointsGroup.findIndex(({coordinates}) => _.isEqual(coordinates, lngLat));

        if (removedIndex > -1) {
          const newGroup = [
            ...overlappedPointsGroup.slice(0, removedIndex),
            ...overlappedPointsGroup.slice(removedIndex + 1),
          ];
          this.setState({overlappedPointsGroup: newGroup});
        }
      }

      const {onSpiderifierRemoved} = this.props;
      if (_.isFunction(onSpiderifierRemoved)) {
        onSpiderifierRemoved(lngLat);
      }
    }

    onMapChange = () => {
      const {onlySpiderifier} = this.props;
      if (!onlySpiderifier && _.isArray(this._spiderifieredLocations)) {
        const {data, radius} = this.props;
        const map = this.getMapInstance();
        this._spiderifieredLocations.forEach(lngLat => {
          const points = findPointsWithSameLocation(data, lngLat, map, radius);

          if (!points) {
            this.onSpiderifierRemoved(lngLat);
          }
        });
      }
    };

    _checkAndUpdatePoints(nextProps) {
      if (checkPropsChange(this.props, nextProps, ['data', 'showInitialSpiderifier', 'onlySpiderifier'], _.isEqual)) {
        this._updatePoints(nextProps);
      }
    }

    _getComponentProps(propTypes) {
      const keys = _.map(propTypes, (value, propKey) => propKey);
      return _.pick(this.props, keys);
    }

    _getWrappedComponentProps() {
      return this._getComponentProps(WrappedComponent.propTypes);
    }

    _getSpiderifierComponentProps() {
      return this._getComponentProps(ReactMapboxGlSpiderifier.propTypes);
    }

    _groupNearestPoint(props) {
      const {data, showInitialSpiderifier, onlySpiderifier} = props;
      const map = this.getMapInstance();
      const groupedPoints = groupNearestPointsByRadius(data, map, ClusterOptions.NearestPointsRadius);

      if (groupedPoints.length > 0) {
        if (onlySpiderifier && groupedPoints.length === 1) {
          this._updateSpiderifierProps(groupedPoints);
        } else if (showInitialSpiderifier) {
          let firstGroup = groupedPoints.find(group => group.length > 1);

          if (firstGroup == null) {
            firstGroup = groupedPoints[0];
          }

          this._updateSpiderifierProps([firstGroup]);
        }
      }
    }

    _processSpiderifyProperties(props) {
      const {spiderifyPropsProcessor} = this.props;
      if (_.isFunction(spiderifyPropsProcessor)) {
        return spiderifyPropsProcessor(props);
      }

      return props;
    }

    _renderSpiderifierContent(key, properties) {
      const {spiralComponent: SpiralComponent} = this.props;
      if (SpiralComponent) {
        return <SpiralComponent key={key} properties={properties} />;
      }
      return (
        <div className="spiderifier-marker-content" key={key} properties={properties}>
          <div>{properties.label}</div>
        </div>
      );
    }

    _renderSpiderifier() {
      const {overlappedPointsGroup} = this.state;

      if (overlappedPointsGroup && overlappedPointsGroup.length > 0) {
        const spiderifierComponentProps = this._getSpiderifierComponentProps();

        return overlappedPointsGroup.map((overlappedPoints, index) => {
          const {coordinates, markers} = overlappedPoints;

          return (
            <ReactMapboxGlSpiderifier key={index} {...spiderifierComponentProps} coordinates={coordinates}>
              {markers.map((marker, index) => this._renderSpiderifierContent(index, marker))}
            </ReactMapboxGlSpiderifier>
          );
        });
      }

      return null;
    }

    _shouldRenderClusterLayer() {
      const {onlySpiderifier, overlappedPointsGroup} = this.props;
      return !onlySpiderifier || !overlappedPointsGroup || overlappedPointsGroup.length > 1;
    }

    _updatePoints(props = this.props) {
      const {data, showInitialSpiderifier, onlySpiderifier} = props;

      if (data != null && (showInitialSpiderifier || onlySpiderifier)) {
        this._groupNearestPoint(props);
      }
    }

    _updateSpiderifierProps(group, coordinates) {
      this._spiderifieredLocations = [];
      if (group.length > 0) {
        const overlappedPointsGroup = group.map(points => {
          if (points.length > 0) {
            const properties = points.map(feature => feature.properties);
            let coords = coordinates;

            if (coords == null) {
              coords = getCoord(points[0]);
            }
            return {
              markers: this._processSpiderifyProperties(properties),
              coordinates: coords,
            };
          }

          return null;
        });

        const {onShowSpiderifier} = this.props;
        overlappedPointsGroup.forEach(group => {
          const {coordinates, markers} = group;

          this._spiderifieredLocations.push(coordinates);
          if (_.isFunction(onShowSpiderifier)) {
            onShowSpiderifier(coordinates, markers);
          }
        });

        this.setState({
          overlappedPointsGroup,
        });
      }
    }

    render() {
      const wrappedComponentProps = this._getWrappedComponentProps();

      return (
        <div>
          {this._shouldRenderClusterLayer() && (
            <WrappedComponent {...wrappedComponentProps} onClickOverlappedPoints={this.onClickOverlappedPoints} />
          )}
          {this._renderSpiderifier()}
        </div>
      );
    }
  }

  const spiderifierPropTypes = _.pickBy(
    ReactMapboxGlSpiderifier.propTypes,
    (value, props) => props !== 'markers' && props !== 'coordinates',
  );
  ConnectedWithSpiderifierComponent.propTypes = {
    ...WrappedComponent.propTypes,
    ...spiderifierPropTypes,

    /**
     * Indicate if the spiderifier should be shown for the first overlapped point onload
     */
    showInitialSpiderifier: PropTypes.bool,

    /**
     * Indicate if the spiderifier should be shown without wrapped component
     */
    onlySpiderifier: PropTypes.bool,

    /**
     * Handler to transform the properties of each point
     */
    spiderifyPropsProcessor: PropTypes.func,

    /**
     * Callback when a spiderifier shown
     */
    onShowSpiderifier: PropTypes.func,

    /**
     * [Optional] Handle when user do zoom/move to change the map and made the points
     * on the map changed and don't have overlapped points anymore
     */
    onSpiderifierRemoved: PropTypes.func,

    /**
     * Allow to customize the spiral component
     */
    spiralComponent: PropTypes.element,
  };

  ConnectedWithSpiderifierComponent.defaultProps = {
    ...WrappedComponent.defaultProps,
    ...ReactMapboxGlSpiderifier.defaultProps,
  };

  return ConnectedWithSpiderifierComponent;
};

export default connectWithSpiderifierPoint;
