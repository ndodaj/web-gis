package al.webgis.webgis.model.styles.create;

import jakarta.xml.bind.annotation.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
@XmlAccessorType(XmlAccessType.FIELD)
public class Fill {

    @XmlElement(name = "CssParameter")
    private List<CssParameter> cssParameters;

}

