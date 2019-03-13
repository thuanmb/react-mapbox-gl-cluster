import { connectWithSpiderifierPoint, detectLocationHasOverlappedPoints, doZoomingOnClick } from "../../common/hoc";
import ClusterLayer from "./ClusterLayer";
var ClusterLayerWithOverlappedPoints = detectLocationHasOverlappedPoints(ClusterLayer);
var ZoomableClusterLayer = doZoomingOnClick(ClusterLayerWithOverlappedPoints);
var MapboxGlCluster = connectWithSpiderifierPoint(ZoomableClusterLayer);
export default MapboxGlCluster;