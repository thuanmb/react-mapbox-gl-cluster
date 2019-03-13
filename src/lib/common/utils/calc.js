/**
 * Calculate the next zoom level base on the current zoom
 * @param {number} currentZoom the current zoom level
 * @param {number} maxZoom the max zoom level of the map
 * @param {number} extraZoomLevels how many extra level more for each zoom
 */
const calculateNextZoomLevel = (
  currentZoom,
  maxZoom = 20,
  extraZoomLevels = 2
) => {
  if (currentZoom >= 14 && currentZoom < maxZoom - 2) {
    return maxZoom - 2;
  }

  if (currentZoom >= maxZoom - 2) {
    return maxZoom;
  }

  const delta = maxZoom - currentZoom;
  const percentage = delta / maxZoom;
  const zoom =
    currentZoom +
    extraZoomLevels * percentage +
    extraZoomLevels * Math.pow(percentage, 2) +
    extraZoomLevels * Math.pow(percentage, 3);

  return zoom;
};

export { calculateNextZoomLevel };
