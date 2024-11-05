package al.webgis.webgis.model.styles.create;

import jakarta.xml.bind.annotation.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@XmlAccessorType(XmlAccessType.FIELD)
public class UserStyle {

    @XmlElement(name = "Name")
    private String name;

    @XmlElement(name = "Title")
    private String title;

    @XmlElement(name = "Abstract")
    private String abstractText;

    @XmlElement(name = "FeatureTypeStyle")
    private FeatureTypeStyle featureTypeStyle;

}
