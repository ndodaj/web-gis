package al.webgis.webgis.model.styles.create;

import jakarta.xml.bind.annotation.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@XmlAccessorType(XmlAccessType.FIELD)
public class PropertyIsEqualTo {

    @XmlElement(name = "PropertyName")
    private String propertyName;

    @XmlElement(name = "Literal")
    private String literal;

}

