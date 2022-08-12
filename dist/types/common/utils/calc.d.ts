/**
 * Calculate the next zoom level base on the current zoom
 * @param {number} currentZoom the current zoom level
 * @param {number} maxZoom the max zoom level of the map
 * @param {number} extraZoomLevels how many extra level more for each zoom
 */
export function calculateNextZoomLevel(currentZoom: number, maxZoom?: number, extraZoomLevels?: number): number;
