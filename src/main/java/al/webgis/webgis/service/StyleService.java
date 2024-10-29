package al.webgis.webgis.service;

import al.webgis.webgis.model.StyleDTO;
import al.webgis.webgis.model.styles.CreateStyleDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


@Service
@Slf4j
public class StyleService {

    @Value("${geoserver.username}")
    private String username;

    @Value("${geoserver.password}")
    private String password;

    @Value("${geoserver.url}")
    private String geoServerUrl;


    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public StyleService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        // Add basic authentication
        this.restTemplate.getInterceptors().add(
                new BasicAuthenticationInterceptor("admin", "geoserver")
        );
    }

    public Page<StyleDTO> getAllStyles(Pageable pageable) {
        return null;
    }

    public StyleDTO getStyle(String styleName) {
        return null;
    }

    public CreateStyleDTO createStyle(CreateStyleDTO createStyleDTO) {
        return null;
    }

    public ResponseEntity<CreateStyleDTO> updateStyle(CreateStyleDTO styleDTO, String styleName) {
        return null;
    }

    public void deleteStyle(String styleName) {
    }
}
