package al.webgis.webgis.service;


import al.webgis.webgis.model.layergroups.InsertFeatureDto;
import com.fasterxml.jackson.databind.ObjectMapper;
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
public class GeoServerService {

    @Value("${geoserver.username}")
    private String username;

    @Value("${geoserver.password}")
    private String password;

    @Value("${geoserver.url}")
    private String geoServerUrl;



    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GeoServerService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        // Add basic authentication
        this.restTemplate.getInterceptors().add(
                new BasicAuthenticationInterceptor("admin", "geoserver")
        );
    }

    public String getGeoServerInfo() {
        String url = "http://geoserver:8080/geoserver" + "/rest/about/version";

        HttpHeaders headers = new HttpHeaders();
        String auth = "admin:geoserver";
        byte[] encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes()).getBytes();
        String authHeader = "Basic " + new String(encodedAuth);
        headers.set("Authorization", authHeader);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        return response.getBody();
    }


//    public String insertNewFeature(String workspace, String layerName, String wfsTransactionXml) {
    public String insertNewFeature(InsertFeatureDto insertFeatureDto) {
        String url = geoServerUrl + "/wfs";

        // /geoserver/test/ows

        String xml = produceXML(insertFeatureDto);


        HttpEntity<String> entity = new HttpEntity<>(xml, setBasicAuth());
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        return response.getBody();
    }

    public String deleteFeature(String workspace, String layerName, String featureId) {
        String url = geoServerUrl + "/wfs";

        // Set up basic authentication
        HttpHeaders headers = new HttpHeaders();
        String auth = username + ":" + password;
        byte[] encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes()).getBytes();
        String authHeader = "Basic " + new String(encodedAuth);
        headers.set("Authorization", authHeader);
        headers.set("Content-Type", "application/xml");

        // Create WFS-T Delete XML payload
        String wfsTransactionXml = "<wfs:Transaction service=\"WFS\" version=\"1.0.0\" "
                + "xmlns:wfs=\"http://www.opengis.net/wfs\" "
                + "xmlns:ogc=\"http://www.opengis.net/ogc\" "
                + "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" "
                + "xsi:schemaLocation=\"http://www.opengis.net/wfs "
                + "http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd\">"
                + "<wfs:Delete typeName=\"" + workspace + ":" + layerName + "\">"
                + "<ogc:Filter>"
                + "<ogc:FeatureId fid=\"" + featureId + "\"/>"
                + "</ogc:Filter>"
                + "</wfs:Delete>"
                + "</wfs:Transaction>";

        HttpEntity<String> entity = new HttpEntity<>(wfsTransactionXml, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        return response.getBody();
    }


    public String updateFeatureGeometry(String workspace, String layerName, String featureId, String newGeometry) {
        String url = geoServerUrl + "/wfs";

        // Set up basic authentication
        HttpHeaders headers = new HttpHeaders();
        String auth = username + ":" + password;
        byte[] encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes()).getBytes();
        String authHeader = "Basic " + new String(encodedAuth);
        headers.set("Authorization", authHeader);
        headers.set("Content-Type", "application/xml");

        // Create WFS-T Update XML payload
        String wfsTransactionXml = "<wfs:Transaction service=\"WFS\" version=\"1.0.0\" "
                + "xmlns:wfs=\"http://www.opengis.net/wfs\" "
                + "xmlns:gml=\"http://www.opengis.net/gml\" "
                + "xmlns:ogc=\"http://www.opengis.net/ogc\" "
                + "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" "
                + "xsi:schemaLocation=\"http://www.opengis.net/wfs "
                + "http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd\">"
                + "<wfs:Update typeName=\"" + workspace + ":" + layerName + "\">"
                + "<wfs:Property>"
                + "<wfs:Name>geometry</wfs:Name>"
                + "<wfs:Value>" + newGeometry + "</wfs:Value>"
                + "</wfs:Property>"
                + "<ogc:Filter>"
                + "<ogc:FeatureId fid=\"" + featureId + "\"/>"
                + "</ogc:Filter>"
                + "</wfs:Update>"
                + "</wfs:Transaction>";

        HttpEntity<String> entity = new HttpEntity<>(wfsTransactionXml, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        return response.getBody();
    }

    public String updateFeatureAttribute(String workspace, String layerName, String featureId, String attributeName, String newValue) {
        String url = geoServerUrl + "/wfs";

        // Set up basic authentication
        HttpHeaders headers = new HttpHeaders();
        String auth = username + ":" + password;
        byte[] encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes()).getBytes();
        String authHeader = "Basic " + new String(encodedAuth);
        headers.set("Authorization", authHeader);
        headers.set("Content-Type", "application/xml");

        // Create WFS-T Update XML payload
        String wfsTransactionXml = "<wfs:Transaction service=\"WFS\" version=\"1.0.0\" "
                + "xmlns:wfs=\"http://www.opengis.net/wfs\" "
                + "xmlns:ogc=\"http://www.opengis.net/ogc\" "
                + "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" "
                + "xsi:schemaLocation=\"http://www.opengis.net/wfs "
                + "http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd\">"
                + "<wfs:Update typeName=\"" + workspace + ":" + layerName + "\">"
                + "<wfs:Property>"
                + "<wfs:Name>" + attributeName + "</wfs:Name>"
                + "<wfs:Value>" + newValue + "</wfs:Value>"
                + "</wfs:Property>"
                + "<ogc:Filter>"
                + "<ogc:FeatureId fid=\"" + featureId + "\"/>"
                + "</ogc:Filter>"
                + "</wfs:Update>"
                + "</wfs:Transaction>";

        HttpEntity<String> entity = new HttpEntity<>(wfsTransactionXml, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        return response.getBody();
    }







    public String deleteLayerGroup(String layerGroupName) {
        String url = geoServerUrl + "/rest/layergroups/" + layerGroupName;

        // Set up basic authentication
        HttpHeaders headers = new HttpHeaders();
        String auth = username + ":" + password;
        byte[] encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes()).getBytes();
        String authHeader = "Basic " + new String(encodedAuth);
        headers.set("Authorization", authHeader);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.DELETE, entity, String.class);
        return response.getStatusCode().toString();
    }

    public String addAttribute(String workspace, String dataStore, String featureType, String attributeName, String attributeType) {
        String url = geoServerUrl + "/rest/workspaces/" + workspace + "/datastores/" + dataStore + "/featuretypes/" + featureType + "/attributes";

        // Set up basic authentication
        HttpHeaders headers = new HttpHeaders();
        String auth = username + ":" + password;
        byte[] encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes()).getBytes();
        String authHeader = "Basic " + new String(encodedAuth);
        headers.set("Authorization", authHeader);
        headers.set("Content-Type", "application/json");

        // Create Attribute JSON payload
        String attributeJson = "{"
                + "\"attribute\": {"
                + "\"name\": \"" + attributeName + "\","
                + "\"binding\": \"" + attributeType + "\""
                + "}"
                + "}";

        HttpEntity<String> entity = new HttpEntity<>(attributeJson, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        return response.getBody();
    }


    public String editAttribute(String workspace, String dataStore, String featureType, String attributeName, String newAttributeType) {
        String url = geoServerUrl + "/rest/workspaces/" + workspace + "/datastores/" + dataStore + "/featuretypes/" + featureType + "/attributes/" + attributeName;

        // Set up basic authentication
        HttpHeaders headers = new HttpHeaders();
        String auth = username + ":" + password;
        byte[] encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes()).getBytes();
        String authHeader = "Basic " + new String(encodedAuth);
        headers.set("Authorization", authHeader);
        headers.set("Content-Type", "application/json");

        // Create Attribute JSON payload
        String attributeJson = "{"
                + "\"attribute\": {"
                + "\"binding\": \"" + newAttributeType + "\""
                + "}"
                + "}";

        HttpEntity<String> entity = new HttpEntity<>(attributeJson, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.PUT, entity, String.class);
        return response.getBody();
    }


    public String deleteAttribute(String workspace, String dataStore, String featureType, String attributeName) {
        String url = geoServerUrl + "/rest/workspaces/" + workspace + "/datastores/" + dataStore + "/featuretypes/" + featureType + "/attributes/" + attributeName;

        // Set up basic authentication
        HttpHeaders headers = new HttpHeaders();
        String auth = username + ":" + password;
        byte[] encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes()).getBytes();
        String authHeader = "Basic " + new String(encodedAuth);
        headers.set("Authorization", authHeader);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.DELETE, entity, String.class);
        return response.getStatusCode().toString();
    }

    public String getAttributes(String workspace, String dataStore, String featureType) {
        String url = geoServerUrl + "/rest/workspaces/" + workspace + "/datastores/" + dataStore + "/featuretypes/" + featureType + ".json";

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

    public String addGeometry(String workspace, String dataStore, String featureType, String geometryName, String geometryType, String coordinates) {
        String url = geoServerUrl + "/rest/workspaces/" + workspace + "/datastores/" + dataStore + "/featuretypes/" + featureType + "/features";

        // Set up basic authentication
        HttpHeaders headers = new HttpHeaders();
        String auth = username + ":" + password;
        byte[] encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes()).getBytes();
        String authHeader = "Basic " + new String(encodedAuth);
        headers.set("Authorization", authHeader);
        headers.set("Content-Type", "application/json");

        // Create Geometry JSON payload
        String geometryJson = "{"
                + "\"type\": \"FeatureCollection\","
                + "\"features\": ["
                + "{"
                + "\"type\": \"Feature\","
                + "\"geometry\": {"
                + "\"type\": \"" + geometryType + "\","
                + "\"coordinates\": " + coordinates
                + "},"
                + "\"properties\": {"
                + "\"name\": \"" + geometryName + "\""
                + "}"
                + "}"
                + "]"
                + "}";

        HttpEntity<String> entity = new HttpEntity<>(geometryJson, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        return response.getBody();
    }


    public String updateGeometry(String workspace, String dataStore, String featureType, String featureId, String geometryType, String newCoordinates) {
        String url = geoServerUrl + "/rest/workspaces/" + workspace + "/datastores/" + dataStore + "/featuretypes/" + featureType + "/features/" + featureId;

        // Set up basic authentication
        HttpHeaders headers = new HttpHeaders();
        String auth = username + ":" + password;
        byte[] encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes()).getBytes();
        String authHeader = "Basic " + new String(encodedAuth);
        headers.set("Authorization", authHeader);
        headers.set("Content-Type", "application/json");

        // Create updated Geometry JSON payload
        String geometryJson = "{"
                + "\"type\": \"Feature\","
                + "\"geometry\": {"
                + "\"type\": \"" + geometryType + "\","
                + "\"coordinates\": " + newCoordinates
                + "},"
                + "\"properties\": {}"
                + "}";

        HttpEntity<String> entity = new HttpEntity<>(geometryJson, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.PUT, entity, String.class);
        return response.getBody();
    }


    public String deleteGeometry(String workspace, String dataStore, String featureType, String featureId) {
        String url = geoServerUrl + "/rest/workspaces/" + workspace + "/datastores/" + dataStore + "/featuretypes/" + featureType + "/features/" + featureId;

        // Set up basic authentication
        HttpHeaders headers = new HttpHeaders();
        String auth = username + ":" + password;
        byte[] encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes()).getBytes();
        String authHeader = "Basic " + new String(encodedAuth);
        headers.set("Authorization", authHeader);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.DELETE, entity, String.class);
        return response.getStatusCode().toString();
    }

    public String getGeometry(String workspace, String dataStore, String featureType, String featureId) {
        String url = geoServerUrl + "/rest/workspaces/" + workspace + "/datastores/" + dataStore + "/featuretypes/" + featureType + "/features/" + featureId + ".json";

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




























    private String produceXML(InsertFeatureDto insertFeatureDto) {
        // @TODO return xml object based on layerType
        return null;
    }



    private HttpHeaders setBasicAuth() {
        // Set up basic authentication
        HttpHeaders headers = new HttpHeaders();
        String auth = username + ":" + password;
        byte[] encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes()).getBytes();
        String authHeader = "Basic " + new String(encodedAuth);
        headers.set("Authorization", authHeader);
        headers.set("Content-Type", "application/xml");

        return headers;

    }


    public String getAllStyles() {
        // Set up basic authentication
        HttpHeaders headers = new HttpHeaders();
        String auth = username + ":" + password;
        byte[] encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes()).getBytes();
        String authHeader = "Basic " + new String(encodedAuth);
        headers.set("Authorization", authHeader);
        headers.set("Content-Type", "application/json");
        String url = String.format("%s/rest/styles.json", geoServerUrl);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        return response.getBody();
    }
}
