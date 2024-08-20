package al.webgis.webgis.model;

import java.util.List;

public record AuthenticationResponse(
        String username,
        List<String> roles
) {
}
