package al.webgis.webgis.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PublishedDto {
    private List<LayerDTO> published;
}
