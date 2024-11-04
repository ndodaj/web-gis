package al.webgis.webgis.model.layers;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LayerDto {
    private String layerName;
    private String styleName;
    private String workspace;
    private String sldBody;
}