package al.webgis.webgis.model.layers;

import al.webgis.webgis.model.StyleDTO;
import al.webgis.webgis.model.Styles;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LayerDetails {
    private String name;
    private String path;
    private String type;
    private StyleDTO defaultStyle;
    private Styles styles;
    private ResourceDto resource;
    private AttributionDto attribution;



}
