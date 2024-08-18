package al.webgis.webgis.service;


import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;

@Service
public class GeoServerService {

    private final RestTemplate restTemplate;
    private final String geoServerUrl = "http://localhost:8080/geoserver";

    public GeoServerService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        // Add basic authentication
        this.restTemplate.getInterceptors().add(
                new BasicAuthenticationInterceptor("admin", "geoserver")
        );
    }

    public String getGeoServerInfo() {
        String url = geoServerUrl + "/rest/about/version";

        HttpHeaders headers = new HttpHeaders();
        String auth = "admin:geoserver";
        byte[] encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes()).getBytes();
        String authHeader = "Basic " + new String(encodedAuth);
        headers.set("Authorization", authHeader);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        return response.getBody();
    }
}
