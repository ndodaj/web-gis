package al.webgis.webgis.model.styles.create;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlAttribute;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@XmlRootElement(name = "StyledLayerDescriptor")
@XmlAccessorType(XmlAccessType.FIELD)
public class StyledLayerDescriptor {

    @XmlAttribute
    private String version;

    @XmlElement(name = "NamedLayer")
    private NamedLayer namedLayer;
}

