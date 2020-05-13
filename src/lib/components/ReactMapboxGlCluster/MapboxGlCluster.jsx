import { connectWithSpiderifierPoint, detectLocationHasOverlappedPoints, doZoomingOnClick } from "../../common/hoc";
import ClusterLayer from "./ClusterLayer";

const ClusterLayerWithOverlappedPoints = detectLocationHasOverlappedPoints(ClusterLayer);

const ZoomableClusterLayer = doZoomingOnClick(ClusterLayerWithOverlappedPoints);

const MapboxGlCluster = connectWithSpiderifierPoint(ZoomableClusterLayer);

export default MapboxGlCluster;
