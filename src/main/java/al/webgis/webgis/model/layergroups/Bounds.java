package al.webgis.webgis.model.layergroups;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Bounds {
    private Double minX;
    private Double minY;
    private Double maxX;
    private Double maxY;
    private String crs;
}
