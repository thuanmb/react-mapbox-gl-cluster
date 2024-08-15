export default MarkerLayer;
declare class MarkerLayer extends MappedComponent {
    componentDidMount(): void;
    layer: import("mapbox-gl").Marker | undefined;
    componentDidUpdate(prevProps: any, prevState: any): void;
    componentWillUnmount(): void;
    attachChildren(props?: any): HTMLDivElement | undefined;
    element: HTMLDivElement | undefined;
    getContainerClassName(props: any): string;
    getContent(props: any): any;
    getProperties(): any;
    getOffset(): number[];
    getStyle(props: any): any;
    _bindEvents(): void;
    realHandlers: {} | undefined;
    _disableMapDragPan: () => void;
    _enableMapDragPan: () => void;
    _generateEventHander: (eventName: any) => (e: any) => void;
    _unbindEvents(): void;
    render(): null;
}
declare namespace MarkerLayer {
    let displayName: string;
    namespace propTypes {
        let coordinates: any;
        let properties: any;
        let className: any;
        let style: any;
        let children: any;
        let onClick: any;
        let onMouseDown: any;
        let onMouseEnter: any;
        let onMouseLeave: any;
        let onMouseMove: any;
        let onMouseOut: any;
        let onMouseOver: any;
        let onMouseUp: any;
    }
}
import MappedComponent from "../MappedComponent";
