package al.webgis.webgis.model.layers;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public class LayerRequest {

    @JsonProperty("layer")
    private Layer layer;

    public LayerRequest() {
        // Default constructor
    }

    public Layer getLayer() {
        return layer;
    }

    public void setLayer(Layer layer) {
        this.layer = layer;
    }

    public static class Layer {
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

        // Getters and setters

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getAbstractText() {
            return abstractText;
        }

        public void setAbstractText(String abstractText) {
            this.abstractText = abstractText;
        }

        public String getDefaultStyle() {
            return defaultStyle;
        }

        public void setDefaultStyle(String defaultStyle) {
            this.defaultStyle = defaultStyle;
        }

        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }

        public Resource getResource() {
            return resource;
        }

        public void setResource(Resource resource) {
            this.resource = resource;
        }
    }

    public static class Resource {
        @JsonProperty("name")
        private String name;

        @JsonProperty("type")
        private String type;

        // Getters and setters

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }
    }
}
