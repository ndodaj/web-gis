package al.webgis.webgis.service;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class GeoServerClient {

    @Autowired
    private RestTemplate restTemplate;


    @Value("${geoserver.username}")
    private String username;

    @Value("${geoserver.password}")
    private String password;

    @Value("${geoserver.url}")
    private String geoServerUrl;



    private final ObjectMapper objectMapper;

    public GeoServerClient(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

//    public List<Map<String, Object>> fetchAllLayers() {
//        List<Map<String, Object>> output = null;
//        String url = String.format("%s/rest/layers.json", geoServerUrl);
//
//        // Set up basic authentication headers
//        HttpHeaders headers = new HttpHeaders();
//        String auth = username + ":" + password;
//        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
//        String authHeader = "Basic " + encodedAuth;
//        headers.set("Authorization", authHeader);
//
//        // Set up the request entity with headers
//        HttpEntity<String> entity = new HttpEntity<>(headers);
//
//        // Send the GET request to fetch all layers
//        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
//
//        try {
//            Map<String, Object> layersResponse = objectMapper.readValue(response.getBody(), new TypeReference<Map<String, Object>>() {});
//            // Extract the "layer" list from the "layers" key
//            Map<String, Object> layers = (Map<String, Object>) layersResponse.get("layers");
//            output = (List<Map<String, Object>>) layers.get("layer");
//        } catch (JsonProcessingException e) {
//            e.printStackTrace(); // Handle exceptions appropriately
//        }
//
//        return output;
//    }

    private Map<String, String> fetchLayerGroups() {
        Map<String, String> layerToGroupMap = new HashMap<>();
        String url = String.format("%s/rest/layergroups.json", geoServerUrl);

        HttpHeaders headers = createAuthHeaders();
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        try {
            Map<String, Object> layerGroupsResponse = objectMapper.readValue(response.getBody(), new TypeReference<>() {});
            List<Map<String, Object>> layerGroups = (List<Map<String, Object>>) layerGroupsResponse.get("layerGroups");

            for (Map<String, Object> group : layerGroups) {
                String groupName = (String) group.get("name");
                ResponseEntity<String> groupResponse = restTemplate.exchange(group.get("href").toString(), HttpMethod.GET, entity, String.class);

                Map<String, Object> groupDetails = objectMapper.readValue(groupResponse.getBody(), new TypeReference<>() {});
                List<Map<String, String>> layersInGroup = (List<Map<String, String>>) ((Map<String, Object>) groupDetails.get("layerGroup")).get("layers");

                for (Map<String, String> layer : layersInGroup) {
                    layerToGroupMap.put(layer.get("name"), groupName);
                }
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace(); // Handle exceptions appropriately
        }

        return layerToGroupMap;
    }

    // Fetch all layers and add the layergroup field
    public List<Map<String, Object>> fetchAllLayers() {
        List<Map<String, Object>> output = null;
        String url = String.format("%s/rest/layers.json", geoServerUrl);

        HttpHeaders headers = createAuthHeaders();
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        try {
            Map<String, Object> layersResponse = objectMapper.readValue(response.getBody(), new TypeReference<>() {});
            Map<String, Object> layers = (Map<String, Object>) layersResponse.get("layers");
            output = (List<Map<String, Object>>) layers.get("layer");

            // Fetch layer groups and map layers to their group names
            Map<String, String> layerToGroupMap = fetchLayerGroups();

            // Add layergroup field to each layer
            for (Map<String, Object> layer : output) {
                String layerName = (String) layer.get("name");
                layer.put("layergroup", layerToGroupMap.getOrDefault(layerName, ""));
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace(); // Handle exceptions appropriately
        }

        return output;
    }


    public Map<String, Object> fetchLayerByName(String layerName) {
        Map<String, Object> output = null;
        String url = String.format("%s/rest/layers/%s.json", geoServerUrl, layerName);

        // Set up basic authentication headers
        HttpHeaders headers = new HttpHeaders();
        String auth = username + ":" + password;
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
        String authHeader = "Basic " + encodedAuth;
        headers.set("Authorization", authHeader);

        // Set up the request entity with headers
        HttpEntity<String> entity = new HttpEntity<>(headers);

        // Send the GET request to fetch the specified layer
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        try {
            // Parse the response body into a Map structure
            output = objectMapper.readValue(response.getBody(), new TypeReference<>() {
            });
        } catch (JsonProcessingException e) {
            e.printStackTrace(); // Handle exceptions appropriately
        }

        return output;
    }


    public boolean createLayer(String workspace, String datastore, Map<String, Object> request) {
        try {
            String url = String.format("%s/rest/workspaces/%s/datastores/%s/featuretypes.json", geoServerUrl, workspace, datastore);

            HttpHeaders headers = new HttpHeaders();
            String auth = username + ":" + password;
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
            headers.set("Authorization", "Basic " + encodedAuth);
            headers.set("Content-Type", "application/json");

            // Convert request to JSON
            String requestBody = objectMapper.writeValueAsString(request);
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    public boolean updateLayer(String workspace, String layerName, Map<String, Object> request) {
        try {
            String url = String.format("%s/rest/workspaces/%s/layers/%s.json", geoServerUrl, workspace, layerName);

            HttpHeaders headers = new HttpHeaders();
            String auth = username + ":" + password;
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
            headers.set("Authorization", "Basic " + encodedAuth);
            headers.set("Content-Type", "application/json");

            // Convert request to JSON
            String requestBody = objectMapper.writeValueAsString(request);
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            // Send PUT request to update the layer
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.PUT, entity, String.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            e.printStackTrace(); // Handle exception appropriately
            return false;
        }
    }
    public boolean deleteLayer(String workspace, String layerName) {
        try {
            String url = String.format("%s/rest/workspaces/%s/layers/%s.json", geoServerUrl, workspace, layerName);

            HttpHeaders headers = new HttpHeaders();
            String auth = username + ":" + password;
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
            headers.set("Authorization", "Basic " + encodedAuth);
            headers.set("Content-Type", "application/json");

            // Send DELETE request to delete the layer
            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.DELETE, entity, String.class);

            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            e.printStackTrace(); // Handle exception appropriately
            return false;
        }
    }

    private HttpHeaders createAuthHeaders() {
        HttpHeaders headers = new HttpHeaders();
        String auth = username + ":" + password;
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
        headers.set("Authorization", "Basic " + encodedAuth);
        return headers;
    }
}

