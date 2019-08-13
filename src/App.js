import React, {Component} from 'react';
import ReactMapboxGl from 'react-mapbox-gl';
import {ReactMapboxGlCluster} from './lib';
import {data} from './data';
import './App.css';

const Map = ReactMapboxGl({
  accessToken: process.env.REACT_APP_MAPBOX_GL_TOKEN,
});

const mapProps = {
  center: [-95.7129, 37.0902],
  zoom: [3],
  style: 'mapbox://styles/mapbox/streets-v8',
};

const CustomSpiralComponent = ({properties, ...restProps}) => {
  const onClick = e => {
    console.log(`Receive event onClick in spiral at properties: ${JSON.stringify(properties)}`);
  };
  return <div className="spiderifier-marker-content" onClick={onClick}></div>;
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
      onClusterMouseEnter: (properties, coords, offset) =>
        console.log(
          `Receive event onClusterMouseEnter at properties: ${properties}, coords: ${coords}, offset: ${offset}`,
        ),
      onClusterMouseLeave: (properties, coords, offset) =>
        console.log(
          `Receive event onClusterMouseLeave at properties: ${properties}, coords: ${coords}, offset: ${offset}`,
        ),
    };
  }

  render() {
    return (
      <div className="App">
        <Map {...mapProps} onStyleLoad={this.onStyleLoad}>
          <ReactMapboxGlCluster data={data} {...this.getEventHandlers()} spiralComponent={CustomSpiralComponent} />
        </Map>
      </div>
    );
  }
}

export default App;
