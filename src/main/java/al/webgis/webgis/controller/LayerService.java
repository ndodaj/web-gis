package al.webgis.webgis.controller;

import al.webgis.webgis.model.layergroups.LayerGroupsList;
import al.webgis.webgis.model.layers.LayerWrapper;
import al.webgis.webgis.model.layers.LayersResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;

@Service
@Slf4j
public class LayerService {

    @Value("${geoserver.username}")
    private String username;

    @Value("${geoserver.password}")
    private String password;

    @Value("${geoserver.url}")
    private String geoServerUrl;


    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public LayerService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        // Add basic authentication
        this.restTemplate.getInterceptors().add(
                new BasicAuthenticationInterceptor("admin", "geoserver")
        );
    }

    public String createLayer(String workspace, String dataStore, String layerName, String nativeName, String srs) {
        String url = geoServerUrl + "/rest/workspaces/" + workspace + "/datastores/" + dataStore + "/featuretypes";

        // Set up basic authentication
        HttpHeaders headers = new HttpHeaders();
        String auth = username + ":" + password;
        byte[] encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes()).getBytes();
        String authHeader = "Basic " + new String(encodedAuth);
        headers.set("Authorization", authHeader);
        headers.set("Content-Type", "application/json");

        // Create Layer JSON payload
        String layerJson = "{"
                + "\"featureType\": {"
                + "\"name\": \"" + layerName + "\","
                + "\"nativeName\": \"" + nativeName + "\","
                + "\"srs\": \"" + srs + "\""
                + "}"
                + "}";

        HttpEntity<String> entity = new HttpEntity<>(layerJson, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        return response.getBody();
    }

    public LayersResponse getAllLayers(String workspaceName) {
        // Set up basic authentication
        HttpHeaders headers = new HttpHeaders();
        String auth = username + ":" + password;
        byte[] encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes()).getBytes();
        String authHeader = "Basic " + new String(encodedAuth);
        headers.set("Authorization", authHeader);
        headers.set("Content-Type", "application/json");

        LayersResponse output = null;

        String url;
        if (workspaceName != null) {
            url = String.format("%s/rest/workspaces/%s/layers.json", geoServerUrl, workspaceName);
        } else {
            url = String.format("%s/rest/layers.json", geoServerUrl);
        }

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        try {
            output = objectMapper.readValue(response.getBody(), LayersResponse.class);
        } catch (JsonProcessingException e) {
            e.printStackTrace(); // @TODO handle in a controller advice
        }
        return output;

    }

    public String editLayer(String workspace, String layerName, String title, String abstractText) {
        String url = geoServerUrl + "/rest/layers/" + workspace + ":" + layerName;

        // Set up basic authentication
        HttpHeaders headers = new HttpHeaders();
        String auth = username + ":" + password;
        byte[] encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes()).getBytes();
        String authHeader = "Basic " + new String(encodedAuth);
        headers.set("Authorization", authHeader);
        headers.set("Content-Type", "application/json");

        // Create Layer JSON payload
        String layerJson = "{"
                + "\"layer\": {"
                + "\"enabled\": true,"
                + "\"title\": \"" + title + "\","
                + "\"abstract\": \"" + abstractText + "\""
                + "}"
                + "}";

        HttpEntity<String> entity = new HttpEntity<>(layerJson, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.PUT, entity, String.class);
        return response.getBody();
    }

    public void deleteLayer(String workspace, String layerName) {
        String url = geoServerUrl + "/rest/layers/" + workspace + ":" + layerName;

        // Set up basic authentication
        HttpHeaders headers = new HttpHeaders();
        String auth = username + ":" + password;
        byte[] encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes()).getBytes();
        String authHeader = "Basic " + new String(encodedAuth);
        headers.set("Authorization", authHeader);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        restTemplate.exchange(url, HttpMethod.DELETE, entity, String.class);

    }


    public String getLayer(String workspace, String layerName) {
        String url = geoServerUrl + "/rest/layers/" + workspace + ":" + layerName + ".json";

        // Set up basic authentication
        HttpHeaders headers = new HttpHeaders();
        String auth = username + ":" + password;
        byte[] encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes()).getBytes();
        String authHeader = "Basic " + new String(encodedAuth);
        headers.set("Authorization", authHeader);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        return response.getBody();
    }

}
