package al.webgis.webgis.model.layers;

import al.webgis.webgis.model.StyleDTO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class LayerDefaultStyle {
    private List<StyleDTO> defaultStyle;
}
