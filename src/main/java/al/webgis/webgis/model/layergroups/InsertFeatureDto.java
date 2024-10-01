package al.webgis.webgis.model.layergroups;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InsertFeatureDto {

    private LayerType layerType;

    private String layerName;

    private String workspace;

    private String formattedCoordinates;
}
