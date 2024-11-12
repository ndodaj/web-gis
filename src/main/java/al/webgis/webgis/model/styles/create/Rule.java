package al.webgis.webgis.model.styles.create;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
public class Rule {

    private String name;

    private String title;

    private Filter filter;

    private PolygonSymbolizer polygonSymbolizer;

}

