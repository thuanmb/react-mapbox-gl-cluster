import React, { Component } from "react";
import ReactMapboxGl from "react-mapbox-gl";
import _ from "lodash";
import MapboxGl from "mapbox-gl";
import { ReactMapboxGlCluster } from "./node_modules";
import "./App.css";

const Map = ReactMapboxGl({
  accessToken: process.env.MAPBOX_GL_TOKEN
});

const mapProps = {
  style: "mapbox://styles/mapbox/streets-v8"
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.getRandomData()
    };
  }

  getEventHandlers() {
    return {
      onClick: (properties, coords, offset) =>
        this.renderPopup(properties, coords, offset),
      onMouseDown: (properties, coords, offset) =>
        console.log(
          `Receive event onMouseDown at properties: ${properties}, coords: ${coords}, offset: ${offset}`
        ),
      onMouseEnter: (properties, coords, offset) =>
        console.log(
          `Receive event onMouseEnter at properties: ${properties}, coords: ${coords}, offset: ${offset}`
        ),
      onMouseLeave: (properties, coords, offset) =>
        console.log(
          `Receive event onMouseLeave at properties: ${properties}, coords: ${coords}, offset: ${offset}`
        ),
      onMouseMove: (properties, coords, offset) =>
        console.log(
          `Receive event onMouseMove at properties: ${properties}, coords: ${coords}, offset: ${offset}`
        ),
      onMouseOut: (properties, coords, offset) =>
        console.log(
          `Receive event onMouseOut at properties: ${properties}, coords: ${coords}, offset: ${offset}`
        ),
      onMouseOver: (properties, coords, offset) =>
        console.log(
          `Receive event onMouseOver at properties: ${properties}, coords: ${coords}, offset: ${offset}`
        ),
      onMouseUp: (properties, coords, offset) =>
        console.log(
          `Receive event at onMouseUp properties: ${properties}, coords: ${coords}, offset: ${offset}`
        )
    };
  }

  getRandomData() {
    const n = this.randomNumber(5, 30);
    console.log(`Rendering new spiral with ${n} elements`);
    return _.times(n, index => this.randomNumber(100, 10000));
  }

  onStyleLoad = map => {
    this.map = map;
  };

  randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  renderPopup(properties, coordinates, offset) {
    if (this.currentPopup) {
      this.currentPopup.remove();
    }

    setTimeout(() => {
      this.currentPopup = new MapboxGl.Popup({ offset })
        .setLngLat(coordinates)
        .setHTML(`Some description for node ${properties.value}`)
        .addTo(this.map);
    });
  }

  renderSpiderifierContent(key, value) {
    return (
      <div
        className="spiderifier-marker-content"
        key={key}
        properties={{ value }}
      >
        <div>{value}</div>
      </div>
    );
  }

  render() {
    return (
      <div className="App">
        <Map {...mapProps} onStyleLoad={this.onStyleLoad}>
          <ReactMapboxGlCluster
            coordinates={[-0.2268, 51.5361]}
            {...this.getEventHandlers()}
          >
            {this.state.data.map((n, index) =>
              this.renderSpiderifierContent(index, n)
            )}
          </ReactMapboxGlCluster>
        </Map>
      </div>
    );
  }
}

export default App;
