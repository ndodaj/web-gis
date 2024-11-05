package al.webgis.webgis.model.styles.create;


import jakarta.xml.bind.annotation.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@XmlAccessorType(XmlAccessType.FIELD)
public class PolygonSymbolizer {

    @XmlElement(name = "Fill")
    private Fill fill;

    @XmlElement(name = "Stroke")
    private Stroke stroke;

}

