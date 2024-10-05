package al.webgis.webgis.service;

import al.webgis.webgis.model.layergroups.CreateUpdateLayerGroupDTO;
import al.webgis.webgis.model.layergroups.LayerGroupDetailsWrapper;
import al.webgis.webgis.model.layergroups.LayerGroupsList;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.Base64;
import java.util.Collections;

@Service
@Slf4j
public class LayerGroupService {

    @Value("${geoserver.username}")
    private String username;

    @Value("${geoserver.password}")
    private String password;

    @Value("${geoserver.url}")
    private String geoServerUrl;



    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public LayerGroupService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        // Add basic authentication
        this.restTemplate.getInterceptors().add(
                new BasicAuthenticationInterceptor("admin", "geoserver")
        );
    }

    public LayerGroupDetailsWrapper getLayerGroup(String layerGroupName, String workspaceName) {

        LayerGroupDetailsWrapper output = null;
        String url;
        if (workspaceName != null) {
            url = String.format("%s/rest/workspaces/%s/layergroups/%s.json", geoServerUrl, workspaceName, layerGroupName);
        } else {
            url = String.format("%s/rest/layergroups/%s.json", geoServerUrl, layerGroupName);
        }

        // Set up basic authentication
        HttpHeaders headers = new HttpHeaders();
        String auth = username + ":" + password;
        byte[] encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes()).getBytes();
        String authHeader = "Basic " + new String(encodedAuth);
        headers.set("Authorization", authHeader);


        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        try {
            output = objectMapper.readValue(response.getBody(), LayerGroupDetailsWrapper.class);

        } catch (JsonProcessingException e) {
            e.printStackTrace(); // @TODO handle in a controller advice
        }
        return output;
    }

    public CreateUpdateLayerGroupDTO createLayerGroup(CreateUpdateLayerGroupDTO createLayerGroupDTO, String workspaceName) {

        CreateUpdateLayerGroupDTO output = null;
        String url;
        if (workspaceName != null) {
            url = String.format("%s/rest/workspaces/%s/layergroups.json", geoServerUrl, workspaceName);
        } else {
            url = String.format("%s/rest/layergroups.json", geoServerUrl);
        }


        // Set up basic authentication
        HttpHeaders headers = new HttpHeaders();
        String auth = username + ":" + password;
        byte[] encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes()).getBytes();
        String authHeader = "Basic " + new String(encodedAuth);
        headers.set("Authorization", authHeader);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        ObjectMapper mapper = new ObjectMapper();
        String s2 = "";
        try {
            s2 = mapper.writeValueAsString(createLayerGroupDTO);

        } catch (IOException e) {
            e.printStackTrace();
        }
        HttpEntity<String> entity = new HttpEntity<>(s2, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        try {
            output = objectMapper.readValue(response.getBody(), CreateUpdateLayerGroupDTO.class);

        } catch (JsonProcessingException e) {
            e.printStackTrace(); // @TODO handle in a controller advice
        }
        return output;
    }

    public LayerGroupsList getAllLayerGroups(String workspaceName) {
        LayerGroupsList output = null;
        // Set up basic authentication
        HttpHeaders headers = new HttpHeaders();
        String auth = username + ":" + password;
        byte[] encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes()).getBytes();
        String authHeader = "Basic " + new String(encodedAuth);
        headers.set("Authorization", authHeader);
        headers.set("Content-Type", "application/json");

        String url;
        if (workspaceName != null) {
            url = String.format("%s/rest/workspaces/%s/layergroups.json", geoServerUrl, workspaceName);
        } else {
            url = String.format("%s/rest/layergroups.json", geoServerUrl);
        }

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        try {
            output = objectMapper.readValue(response.getBody(), LayerGroupsList.class);

        } catch (JsonProcessingException e) {
            e.printStackTrace(); // @TODO handle in a controller advice
        }
        return output;

    }

    public String updatedLayerGroup(CreateUpdateLayerGroupDTO updateLayerGroup, String layerGroupName) {
        String url = geoServerUrl + "/rest/layergroups/" + layerGroupName;

        // Set up basic authentication
        HttpHeaders headers = new HttpHeaders();
        String auth = username + ":" + password;
        byte[] encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes()).getBytes();
        String authHeader = "Basic " + new String(encodedAuth);
        headers.set("Authorization", authHeader);
        headers.set("Content-Type", "application/json");

        ObjectMapper mapper = new ObjectMapper();
        String s2 = "";
        try {
            s2 = mapper.writeValueAsString(updateLayerGroup);

        } catch (IOException e) {
            e.printStackTrace();
        }
        HttpEntity<String> entity = new HttpEntity<>(s2, headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.PUT, entity, String.class);
        return response.getBody();
    }

    public void deleteLayerGroup(String workspace, String layerGroupName) {
        String url = geoServerUrl + "/rest/workspaces/" + workspace + "/layergroups/" + layerGroupName;

        // Set up basic authentication
        HttpHeaders headers = new HttpHeaders();
        String auth = username + ":" + password;
        byte[] encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes()).getBytes();
        String authHeader = "Basic " + new String(encodedAuth);
        headers.set("Authorization", authHeader);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        restTemplate.exchange(url, HttpMethod.DELETE, entity, String.class);
    }

}
