package al.webgis.webgis.model.styles;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RetrieveSingleStyleDto {
    private String name;
    private String format;
    private LanguageVersion languageVersion;
    private String filename;

    @Getter
    @Setter
    public static class LanguageVersion {
        private String version;
    }
}


