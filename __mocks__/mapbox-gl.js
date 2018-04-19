"use strict";

const MapboxGlMock = require("mapbox-gl-js-mock");
const MapboxGl = {};

MapboxGl.Map = MapboxGlMock.Map;
MapboxGl.LngLat = MapboxGlMock.LngLat;
MapboxGl.LngLatBounds = MapboxGlMock.LngLatBounds;
MapboxGl.NavigationControl = MapboxGlMock.NavigationControl;
MapboxGl.ScaleControl = MapboxGlMock.ScaleControl;
MapboxGl.AttributionControl = MapboxGlMock.AttributionControl;
MapboxGl.GeolocateControl = MapboxGlMock.GeolocateControl;

module.exports = MapboxGl;
