package al.webgis.webgis.model.layers;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class LayerRequest {

    private String name;
    private String title;
    private String layerAbstract;
    private String srs;
    private String nativeCrs;
    private List<Attribute> attributes;


}
