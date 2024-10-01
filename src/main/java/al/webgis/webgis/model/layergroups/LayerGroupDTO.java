package al.webgis.webgis.model.layergroups;

import al.webgis.webgis.model.Styles;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class LayerGroupDTO {
    private String name;
    private String mode;
    private String title;
    private List<LayerDTO> layers;
    private Styles styles;
    // bounds
    // metadata
    // abstractTxt
    private PublishedDto publishables;

}
