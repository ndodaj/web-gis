package al.webgis.webgis.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JwtDTO {
    private String token;
    private String refreshToken;

}
