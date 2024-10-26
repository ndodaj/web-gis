package al.webgis.webgis.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserDetailsResponse {
    private String email;
    private List<String> roles;

    public UserDetailsResponse(String email, List<String> roles) {
        this.email = email;
        this.roles = roles;
    }
}
