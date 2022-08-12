export default MarkerLayer;
declare class MarkerLayer extends MappedComponent {
    componentDidMount(): void;
    layer: any;
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
    const displayName: string;
    namespace propTypes {
        const coordinates: any;
        const properties: any;
        const className: any;
        const style: any;
        const children: any;
        const onClick: any;
        const onMouseDown: any;
        const onMouseEnter: any;
        const onMouseLeave: any;
        const onMouseMove: any;
        const onMouseOut: any;
        const onMouseOver: any;
        const onMouseUp: any;
    }
}
import MappedComponent from "../MappedComponent";
