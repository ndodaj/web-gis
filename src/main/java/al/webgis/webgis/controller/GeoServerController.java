package al.webgis.webgis.controller;

import al.webgis.webgis.model.layergroups.InsertFeatureDto;
import al.webgis.webgis.service.GeoServerService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/geoserver")
@Tag(name = "Geo Server APIs", description = "Geo Server APIs")
@Slf4j
public class GeoServerController {

    private final GeoServerService geoServerService;

    public GeoServerController(GeoServerService geoServerService) {
        this.geoServerService = geoServerService;
    }

    @GetMapping("/info")
    public String getGeoServerInfo() {
        log.info("Test API: retrieve geoserver info");
        return geoServerService.getGeoServerInfo();
    }

    @PostMapping("/insert-feature")
    public String insertFeature(@RequestBody InsertFeatureDto insertFeatureDto ) {
        return geoServerService.insertNewFeature(insertFeatureDto);
    }

    @DeleteMapping("/delete-feature")
    public String deleteFeature(@RequestParam String workspace, @RequestParam String layerName, @RequestParam String featureId) {
        return geoServerService.deleteFeature(workspace, layerName, featureId);
    }

    @PutMapping("/update-feature-geometry")
    public String updateFeatureGeometry(@RequestParam String workspace, @RequestParam String layerName, @RequestParam String featureId, @RequestBody String newGeometry) {
        return geoServerService.updateFeatureGeometry(workspace, layerName, featureId, newGeometry);
    }

    @PutMapping("/update-feature-attribute")
    public String updateFeatureAttribute(@RequestParam String workspace, @RequestParam String layerName, @RequestParam String featureId, @RequestParam String attributeName, @RequestBody String newValue) {
        return geoServerService.updateFeatureAttribute(workspace, layerName, featureId, attributeName, newValue);
    }





    @GetMapping("/geoserver/getAllStyles")
    public String getStyles() {
        return geoServerService.getAllStyles();
    }





    @PostMapping("/add-attribute")
    public String addAttribute(@RequestParam String workspace, @RequestParam String dataStore, @RequestParam String featureType, @RequestParam String attributeName, @RequestParam String attributeType) {
        return geoServerService.addAttribute(workspace, dataStore, featureType, attributeName, attributeType);
    }

    @PutMapping("/edit-attribute")
    public String editAttribute(@RequestParam String workspace, @RequestParam String dataStore, @RequestParam String featureType, @RequestParam String attributeName, @RequestParam String newAttributeType) {
        return geoServerService.editAttribute(workspace, dataStore, featureType, attributeName, newAttributeType);
    }

    @DeleteMapping("/delete-attribute")
    public String deleteAttribute(@RequestParam String workspace, @RequestParam String dataStore, @RequestParam String featureType, @RequestParam String attributeName) {
        return geoServerService.deleteAttribute(workspace, dataStore, featureType, attributeName);
    }

    @GetMapping("/get-attributes")
    public String getAttributes(@RequestParam String workspace, @RequestParam String dataStore, @RequestParam String featureType) {
        return geoServerService.getAttributes(workspace, dataStore, featureType);
    }

    @PostMapping("/add-geometry")
    public String addGeometry(@RequestParam String workspace, @RequestParam String dataStore, @RequestParam String featureType, @RequestParam String geometryName, @RequestParam String geometryType, @RequestParam String coordinates) {
        return geoServerService.addGeometry(workspace, dataStore, featureType, geometryName, geometryType, coordinates);
    }

    @PutMapping("/update-geometry")
    public String updateGeometry(@RequestParam String workspace, @RequestParam String dataStore, @RequestParam String featureType, @RequestParam String featureId, @RequestParam String geometryType, @RequestParam String newCoordinates) {
        return geoServerService.updateGeometry(workspace, dataStore, featureType, featureId, geometryType, newCoordinates);
    }


    @DeleteMapping("/delete-geometry")
    public String deleteGeometry(@RequestParam String workspace, @RequestParam String dataStore, @RequestParam String featureType, @RequestParam String featureId) {
        return geoServerService.deleteGeometry(workspace, dataStore, featureType, featureId);
    }

    @GetMapping("/get-geometry")
    public String getGeometry(@RequestParam String workspace, @RequestParam String dataStore, @RequestParam String featureType, @RequestParam String featureId) {
        return geoServerService.getGeometry(workspace, dataStore, featureType, featureId);
    }

















}