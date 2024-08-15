export default MappedComponent;
declare class MappedComponent {
    static contextType: React.Context<import("mapbox-gl").Map | undefined>;
    getMapInstance(): any;
}
