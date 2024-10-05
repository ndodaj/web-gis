package al.webgis.webgis.model.layers;


import al.webgis.webgis.model.layergroups.LayerDTO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class LayerWrapper {
    private List<LayerDTO> layer;
}
