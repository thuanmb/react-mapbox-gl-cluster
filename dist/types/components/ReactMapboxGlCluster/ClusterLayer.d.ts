export default ClusterLayer;
declare class ClusterLayer {
    _clusterMarkerFactory: (coordinates: any, pointCount: any, getLeaves: any) => any;
    _getClusterProps(): {
        radius: any;
        minZoom: any;
        maxZoom: any;
        extent: any;
        nodeSize: any;
    };
    _getPointsProps(points: any): any;
    _renderMarkers(): any;
    render(): any;
}
declare namespace ClusterLayer {
    let displayName: string;
    namespace propTypes {
        let data: any;
        let radius: any;
        let minZoom: any;
        let maxZoom: any;
        let extent: any;
        let nodeSize: any;
        let pointClassName: any;
        let pointStyles: any;
        let clusterClassName: any;
        let markerComponent: any;
        let onMouseLeave: any;
        let onClick: any;
        let onClusterClick: any;
        let onClusterMouseEnter: any;
        let onClusterMouseLeave: any;
    }
    namespace defaultProps {
        let radius_1: number;
        export { radius_1 as radius };
        let minZoom_1: number;
        export { minZoom_1 as minZoom };
        let maxZoom_1: number;
        export { maxZoom_1 as maxZoom };
        let extent_1: number;
        export { extent_1 as extent };
        let nodeSize_1: number;
        export { nodeSize_1 as nodeSize };
    }
}
