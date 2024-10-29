package al.webgis.webgis.model.layers;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateUpdateLayerDto {
    private String workspace;
    private String dataStore;
    private String layerName;
    private String nativeName;
    private String srs;
}
