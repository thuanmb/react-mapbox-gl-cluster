# react-mapbox-gl-cluster

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/thuanmb/react-mapbox-gl-cluster/blob/master/LICENSE)
[![npm downloads](https://img.shields.io/npm/dm/react-mapbox-gl-cluster.svg)](https://www.npmjs.com/package/react-mapbox-gl-cluster)

The `React` component of cluster layer in `mapbox-gl`.

The cluster layer has some build-in actions:

1.  Zoom in when click on a cluster.
2.  Show spiderifier when clicked on a cluster which contains the points at same location.

This layer must be rendered inside `react-mapbox-gl` map.

## Examples:

- https://github.com/thuanmb/react-mapbox-gl-cluster/blob/master/src/App.js

![Demo Cluster.](./demo/demo.gif)

Please note that the `ReactMapboxGlCluster` should be used together with the `React` wrapper of `mapbox-gl` e.g. `react-mapbox-gl`.
https://github.com/alex3165/react-mapbox-gl

```js
import React, {Component} from 'react';
import ReactMapboxGl from 'react-mapbox-gl';
import {ReactMapboxGlCluster} from 'react-mapbox-gl-cluster';
import {data} from './data';

const Map = ReactMapboxGl({
  accessToken: process.env.MAPBOX_GL_TOKEN,
});

const mapProps = {
  center: [-95.7129, 37.0902],
  zoom: [3],
  style: 'mapbox://styles/mapbox/streets-v8',
};

class App extends Component {
  getEventHandlers() {
    return {
      onClick: (properties, coords, offset) =>
        console.log(`Receive event onClick at properties: ${properties}, coords: ${coords}, offset: ${offset}`),
      onMouseEnter: (properties, coords, offset) =>
        console.log(`Receive event onMouseEnter at properties: ${properties}, coords: ${coords}, offset: ${offset}`),
      onMouseLeave: (properties, coords, offset) =>
        console.log(`Receive event onMouseLeave at properties: ${properties}, coords: ${coords}, offset: ${offset}`),
      onClusterClick: (properties, coords, offset) =>
        console.log(`Receive event onClusterClick at properties: ${properties}, coords: ${coords}, offset: ${offset}`),
    };
  }

  render() {
    return (
      <div className="App">
        <Map {...mapProps} onStyleLoad={this.onStyleLoad}>
          <ReactMapboxGlCluster data={data} {...this.getEventHandlers()} />
        </Map>
      </div>
    );
  }
}
```

## Doc

#### Properties

- `data (object)`
  Data source for layer. It must to follow FeatureCollection geojson format

- `radius (number)`
  [Optional] Cluster radius, in pixels.

- `minZoom (number)`
  [Optional] Minimum zoom level at which clusters are generated.

- `maxZoom (number)`
  [Optional] Maximum zoom level at which clusters are generated.

- `extent (number)`
  [Optional](Tiles) Tile extent. Radius is calculated relative to this value.

- `nodeSize (number)`
  [Optional] Size of the KD-tree leaf node. Affects performance.

- `pointClassName (string)`
  [Optional] The class name of each point.

- `pointStyles (object)`
  [Optional] The class name of each cluster.

- `clusterClassName (string)`
  [Optional] The class name of each cluster.

- `spiralComponent (element)`
  [Optional] The custom component for the spiral. For example:

- `markerComponent (element)`
  [Optional] The custom component for marker

#### Events

- `onClick (function)`
  [Optional] Handler for when user on marker

- `onMouseEnter (function)`
  [Optional] Handle when user move the mouse enter a point

- `onMouseLeave (function)`
  [Optional] Handle when user move the mouse leave a point

- `onClusterClick (function)`
  [Optional] Handle when user click on cluster

- `onClusterMouseEnter (function)`
  [Optional] Handle when user move the mouse enter a cluster

- `onClusterMouseLeave (function)`
  [Optional] Handle when user move the mouse leave a cluster

## ChangeLog:

### 1.2.0

- Support custom marker.

  ```
  const CustomeMarkerComponent = ({properties, className, cssObject}) => {
    const onClick = e => {
      console.log(`Receive event onClick in marker at properties: ${JSON.stringify(properties)}`);
    };
    return <div className={className} style={cssObject} onClick={onClick} />;
  };
  ...
  <Map {...mapProps} onStyleLoad={this.onStyleLoad}>
    <ReactMapboxGlCluster data={data} {...this.getEventHandlers()} markerComponent={CustomMarkerComponent} />
  </Map>
  ```

### 1.1.0

- Support custom spiral.

  ```
  const CustomSpiralComponent = ({properties, ...restProps}) => {
    const onClick = e => {
      console.log(`Receive event onClick in spiral at properties: ${JSON.stringify(properties)}`);
    };
    return <div className="spiderifier-marker-content" onClick={onClick}></div>;
  };

  ...
  <Map {...mapProps} onStyleLoad={this.onStyleLoad}>
    <ReactMapboxGlCluster data={data} {...this.getEventHandlers()} spiralComponent={CustomSpiralComponent} />
  </Map>
  ```

### 1.0.0

- Upgrading depedencies to latest version.

### 0.2.0 [BREAKING CHANGES]

- Upgrade all packages to latest version. These packages include: `react`, `mapbox-gl`, `react-mapbox-gl`, `react-mapbox-gl-spiderifier`...

### 0.1.7

- Fix JS error when click on a marker
