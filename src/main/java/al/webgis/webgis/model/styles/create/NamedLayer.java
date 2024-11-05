package al.webgis.webgis.model.styles.create;

import jakarta.xml.bind.annotation.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@XmlAccessorType(XmlAccessType.FIELD)
public class NamedLayer {

    @XmlElement(name = "Name")
    private String name;

    @XmlElement(name = "UserStyle")
    private UserStyle userStyle;

}

