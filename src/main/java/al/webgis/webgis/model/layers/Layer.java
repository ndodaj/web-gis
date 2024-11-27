package al.webgis.webgis.model.layers;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Layer {

    @JsonProperty("name")
    private String name;

    @JsonProperty("title")
    private String title;

    @JsonProperty("abstract")
    private String abstractText;

    @JsonProperty("defaultStyle")
    private String defaultStyle;

    @JsonProperty("enabled")
    private boolean enabled;

    @JsonProperty("resource")
    private Resource resource;

    @JsonProperty("attributes")
    private List<Attribute> attributes;


}