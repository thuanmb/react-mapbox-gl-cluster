"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateNextZoomLevel = void 0;

/**
 * Calculate the next zoom level base on the current zoom
 * @param {number} currentZoom the current zoom level
 * @param {number} maxZoom the max zoom level of the map
 * @param {number} extraZoomLevels how many extra level more for each zoom
 */
const calculateNextZoomLevel = function (currentZoom) {
  let maxZoom = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;
  let extraZoomLevels = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;

  if (currentZoom >= 14 && currentZoom < maxZoom - 2) {
    return maxZoom - 2;
  }

  if (currentZoom >= maxZoom - 2) {
    return maxZoom;
  }

  const delta = maxZoom - currentZoom;
  const percentage = delta / maxZoom;
  const zoom = currentZoom + extraZoomLevels * percentage + extraZoomLevels * Math.pow(percentage, 2) + extraZoomLevels * Math.pow(percentage, 3);
  return zoom;
};

exports.calculateNextZoomLevel = calculateNextZoomLevel;