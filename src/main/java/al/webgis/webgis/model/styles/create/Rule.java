package al.webgis.webgis.model.styles.create;

import jakarta.xml.bind.annotation.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@XmlAccessorType(XmlAccessType.FIELD)
public class Rule {

    @XmlElement(name = "Name")
    private String name;

    @XmlElement(name = "Title")
    private String title;

    @XmlElement(name = "Filter")
    private Filter filter;

    @XmlElement(name = "PolygonSymbolizer")
    private PolygonSymbolizer polygonSymbolizer;

}

