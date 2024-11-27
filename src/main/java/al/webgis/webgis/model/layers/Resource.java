package al.webgis.webgis.model.layers;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Resource {

    @JsonProperty("name")
    private String name;

    @JsonProperty("type")
    private String type;


}