package al.webgis.webgis.model;

public enum LayerType {
    LINESTRING("LineString"),
    POLYGON("Polygon"),
    POINT("Point");


    private final String layerType;

    LayerType(String layerType) {
        this.layerType = layerType;
    }
}
