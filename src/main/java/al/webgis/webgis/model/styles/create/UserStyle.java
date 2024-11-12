package al.webgis.webgis.model.styles.create;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
public class UserStyle {

    private String name;

    private String title;

    private String abstractText;

    private FeatureTypeStyle featureTypeStyle;

}
