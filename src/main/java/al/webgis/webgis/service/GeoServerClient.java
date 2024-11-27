package al.webgis.webgis.service;

import al.webgis.webgis.model.layers.Attribute;
import al.webgis.webgis.model.layers.LayerDto;
import al.webgis.webgis.model.layers.LayerRequest;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Jwt;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.*;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizeRequest;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


import org.apache.http.HttpStatus;

import java.io.IOException;
import java.util.ArrayList;
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


// ...

    public Page<Map<String, Object>> fetchAllLayers(Pageable pageable) {
        List<Map<String, Object>> allLayers = new ArrayList<>(); // Declare allLayers here
        String url = String.format("%s/rest/layers.json", geoServerUrl);
        HttpHeaders headers = createAuthHeaders();
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        try {
            Map<String, Object> layersResponse = objectMapper.readValue(response.getBody(), new TypeReference<Map<String, Object>>() {
            });
            Map<String, Object> layers = (Map<String, Object>) layersResponse.get("layers");
            allLayers = (List<Map<String, Object>>) layers.get("layer"); // Populate allLayers here

            Map<String, String> layerToGroupMap = fetchLayerGroups();

            for (Map<String, Object> layer : allLayers) {
                String layerName = (String) layer.get("name");
                layer.put("layergroup", layerToGroupMap.getOrDefault(layerName, null));
            }

            int pageNumber = pageable.getPageNumber();
            int pageSize = pageable.getPageSize();
            int start = pageNumber * pageSize;
            int end = Math.min(start + pageSize, allLayers.size());

            List<Map<String, Object>> output = allLayers.subList(start, end); // Use output for the paginated result

            return new PageImpl<>(output, pageable, allLayers.size());

        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return new PageImpl<>(new ArrayList<>(), pageable, 0); // Return an empty page if there's an error
    }


    private Map<String, String> fetchLayerGroups() {
        Map<String, String> layerToGroupMap = new HashMap<>();
        String url = String.format("%s/rest/layergroups.json", geoServerUrl);
        HttpHeaders headers = createAuthHeaders();
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        System.out.println("Layer Groups Response: " + response.getBody()); // Log the response

        try {
            Map<String, Object> layerGroupsResponse = objectMapper.readValue(response.getBody(), new TypeReference<Map<String, Object>>() {
            });

            Map<String, Object> layerGroupsMap = (Map<String, Object>) layerGroupsResponse.get("layerGroups");
            List<Map<String, Object>> layerGroups = (List<Map<String, Object>>) layerGroupsMap.get("layerGroup");

            for (Map<String, Object> group : layerGroups) {
                String groupName = (String) group.get("name");
                String groupHref = (String) group.get("href");

                if (groupHref != null && !groupHref.isEmpty()) {
                    ResponseEntity<String> groupResponse = restTemplate.exchange(groupHref, HttpMethod.GET, entity, String.class);
                    System.out.println("Group Details Response for " + groupName + ": " + groupResponse.getBody());

                    Map<String, Object> groupDetails = objectMapper.readValue(groupResponse.getBody(), new TypeReference<Map<String, Object>>() {
                    });

                    Map<String, Object> layerGroupDetails = (Map<String, Object>) groupDetails.get("layerGroup");
                    List<Map<String, Object>> layersInGroup = (List<Map<String, Object>>) ((Map<String, Object>) layerGroupDetails.get("publishables")).get("published");

                    if (layersInGroup != null) {
                        for (Map<String, Object> layer : layersInGroup) {
                            String layerName = (String) layer.get("name");
                            layerToGroupMap.put(layerName, groupName);
                            System.out.println("Mapping layer " + layerName + " to group " + groupName);
                        }
                    } else {
                        System.err.println("No layers found for group: " + groupName);
                    }
                } else {
                    System.err.println("Invalid href for layer group: " + groupName);
                }
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return layerToGroupMap;
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
            // Use the dynamic GeoServer URL
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


//    public boolean addLayerToGeoServer(LayerRequest layerRequest, String workspaceName, String datastoreName) {
//        try {
//            // Construct the URL for the request to create the feature type
//            String url = String.format("http://localhost:8080/geoserver/rest/workspaces/%s/datastores/%s/featuretypes", workspaceName, datastoreName);
//
//            // Build the XML payload from the LayerRequest object
//            String xml = buildFeatureTypeXml(layerRequest);
//
//            // Generate the CURL command for testing/debugging
//            String curlCommand = String.format(
//                    "curl -X POST 'http://localhost:8080/geoserver' \\\n" +
//                            "  -H 'Content-Type: application/xml' \\\n" +
//                            "  -H 'Authorization: Basic %s' \\\n" +
//                            "  -d '%s'",
//                    new String(Base64.getEncoder().encode((username + ":" + password).getBytes())), xml
//            );
//            System.out.println("Generated CURL Command:");
//            System.out.println(curlCommand);
//
//            // Set up HTTP headers using the createAuthHeaders method
//            HttpHeaders headers = createAuthHeaders();
//            headers.setContentType(MediaType.APPLICATION_XML);
//
//            // Set up the HTTP entity with headers and body
//            HttpEntity<String> entity = new HttpEntity<>(xml, headers);
//
//            // Make the POST request to add the layer
//            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
//
//            if (response.getStatusCode().is2xxSuccessful()) {
//                // After layer creation, grant access to all roles
//                String layerName = layerRequest.getName();  // Get the layer name from the request
//                grantAccessToAnyRole(workspaceName, datastoreName, layerRequest.getName());
//
//                // Return true if the request was successful
//                return true;
//            } else {
//                System.err.println("Failed to create the layer. Response: " + response.getStatusCode());
//                return false;
//            }
//        } catch (Exception e) {
//            e.printStackTrace(); // Handle the exception appropriately
//            return false;
//        }
//    }

    public boolean addLayerToGeoServer(LayerRequest layerRequest, String workspaceName, String datastoreName) {
        try {
            // Construct the URL for the request to create the feature type
            String url = String.format("%s/rest/workspaces/%s/datastores/%s/featuretypes", geoServerUrl, workspaceName, datastoreName);

            // Build the XML payload from the LayerRequest object
            String xml = buildFeatureTypeXml(layerRequest);

            // Generate the CURL command for testing/debugging
            String curlCommand = String.format(
                    "curl -X POST '%s' \\\n" +
                            "  -H 'Content-Type: application/xml' \\\n" +
                            "  -H 'Authorization: Basic %s' \\\n" +
                            "  -d '%s'",
                    url,
                    new String(Base64.getEncoder().encode((username + ":" + password).getBytes())),
                    xml
            );
            System.out.println("Generated CURL Command:");
            System.out.println(curlCommand);

            // Set up HTTP headers using the createAuthHeaders method
            HttpHeaders headers = createAuthHeaders();
            headers.setContentType(MediaType.APPLICATION_XML);

            // Set up the HTTP entity with headers and body
            HttpEntity<String> entity = new HttpEntity<>(xml, headers);

            // Make the POST request to add the layer
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                // After layer creation, grant access to all roles
                grantAccessToAnyRole(workspaceName, datastoreName, layerRequest.getName());

                // Return true if the request was successful
                return true;
            } else {
                System.err.println("Failed to create the layer. Response: " + response.getStatusCode());
                return false;
            }
        } catch (Exception e) {
            e.printStackTrace(); // Handle the exception appropriately
            return false;
        }
    }

    private void grantAccessToAnyRole(String workspaceName, String datastoreName, String layerName) {
        // Check if the layer exists
        String urlCheckLayer = String.format("%s/rest/workspaces/%s/datastores/%s/featuretypes/%s",
                geoServerUrl, workspaceName, datastoreName, layerName);
        try {
            ResponseEntity<String> checkResponse = restTemplate.exchange(urlCheckLayer, HttpMethod.GET, null, String.class);

            if (checkResponse.getStatusCode().is2xxSuccessful()) {
                // Layer exists, proceed with granting access
                String url = String.format("%s/rest/security/layers/%s.xml", geoServerUrl, layerName);
                String payload = """
            <security>
                <rule>
                    <role>*</role> <!-- Grant access to any role -->
                    <access>READ</access>
                </rule>
            </security>
            """;

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_XML);
                headers.setBasicAuth(username, password);

                HttpEntity<String> entity = new HttpEntity<>(payload, headers);

                ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.PUT, entity, String.class);

                if (response.getStatusCode().is2xxSuccessful()) {
                    System.out.println("Access granted to all roles for layer: " + layerName);
                } else {
                    System.err.println("Failed to grant access to layer: " + layerName + ". Response: " + response.getStatusCode());
                }
            } else {
                System.err.println("Layer " + layerName + " not found. Cannot grant access.");
            }
        } catch (Exception e) {
            System.err.println("Error granting access to layer: " + e.getMessage());
        }
    }



    private String buildFeatureTypeXml(LayerRequest layerRequest) {
        StringBuilder attributesXml = new StringBuilder();
        for (Attribute attribute : layerRequest.getAttributes()) {
            attributesXml.append(String.format("""
                        <attribute>
                          <name>%s</name>
                          <binding>%s</binding>
                        </attribute>
                    """, attribute.getName(), attribute.getBinding()));
        }

        return String.format("""
                        <featureType>
                          <name>%s</name>
                          <title>%s</title>
                          <abstract>%s</abstract>
                          <srs>%s</srs>
                          <nativeCRS>%s</nativeCRS>
                          <nativeBoundingBox>
                            <minx>-180</minx>
                            <miny>-90</miny>
                            <maxx>180</maxx>
                            <maxy>90</maxy>
                          </nativeBoundingBox>
                          <latLonBoundingBox>
                            <minx>-180</minx>
                            <miny>-90</miny>
                            <maxx>180</maxx>
                            <maxy>90</maxy>
                          </latLonBoundingBox>
                          <attributes>%s</attributes>
                        </featureType>
                        """,
                layerRequest.getName(),
                layerRequest.getTitle(),
                layerRequest.getLayerAbstract(),
                layerRequest.getSrs(),
                layerRequest.getNativeCrs(),
                attributesXml
        );
    }


    // Utility method to handle nulls in XML values
    private String safeXmlValue(String value) {
        return value == null ? "" : value;
    }

}







