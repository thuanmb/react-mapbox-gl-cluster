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
    const displayName: string;
    namespace propTypes {
        const data: any;
        const radius: any;
        const minZoom: any;
        const maxZoom: any;
        const extent: any;
        const nodeSize: any;
        const pointClassName: any;
        const pointStyles: any;
        const clusterClassName: any;
        const markerComponent: any;
        const onMouseLeave: any;
        const onClick: any;
        const onClusterClick: any;
        const onClusterMouseEnter: any;
        const onClusterMouseLeave: any;
    }
    namespace defaultProps {
        const radius_1: number;
        export { radius_1 as radius };
        const minZoom_1: number;
        export { minZoom_1 as minZoom };
        const maxZoom_1: number;
        export { maxZoom_1 as maxZoom };
        const extent_1: number;
        export { extent_1 as extent };
        const nodeSize_1: number;
        export { nodeSize_1 as nodeSize };
    }
}
