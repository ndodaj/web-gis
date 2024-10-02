package al.webgis.webgis.model.layergroups;

import al.webgis.webgis.model.Styles;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class LayerGroupDetails {
    private String name;
    private String mode;
    private String title;
    private List<LayerDTO> layers;
    private Styles styles;
    private Bounds bounds; // @TODO fix doubles
    // metadata
    private String abstractTxt;
    private PublishedDto publishables;

}
