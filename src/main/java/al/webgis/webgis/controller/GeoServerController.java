package al.webgis.webgis.controller;

import al.webgis.webgis.model.InsertFeatureDto;
import al.webgis.webgis.service.GeoServerService;
import org.springframework.web.bind.annotation.*;

@RestController
public class GeoServerController {

    private final GeoServerService geoServerService;

    public GeoServerController(GeoServerService geoServerService) {
        this.geoServerService = geoServerService;
    }

    @GetMapping("/geoserver/info")
    public String getGeoServerInfo() {
        return geoServerService.getGeoServerInfo();
    }

    @PostMapping("/geoserver/insert-feature")
    public String insertFeature(@RequestBody InsertFeatureDto insertFeatureDto ) {
        return geoServerService.insertNewFeature(insertFeatureDto);
    }

    @DeleteMapping("/geoserver/delete-feature")
    public String deleteFeature(@RequestParam String workspace, @RequestParam String layerName, @RequestParam String featureId) {
        return geoServerService.deleteFeature(workspace, layerName, featureId);
    }

    @PutMapping("/geoserver/update-feature-geometry")
    public String updateFeatureGeometry(@RequestParam String workspace, @RequestParam String layerName, @RequestParam String featureId, @RequestBody String newGeometry) {
        return geoServerService.updateFeatureGeometry(workspace, layerName, featureId, newGeometry);
    }

    @PutMapping("/geoserver/update-feature-attribute")
    public String updateFeatureAttribute(@RequestParam String workspace, @RequestParam String layerName, @RequestParam String featureId, @RequestParam String attributeName, @RequestBody String newValue) {
        return geoServerService.updateFeatureAttribute(workspace, layerName, featureId, attributeName, newValue);
    }

    @PostMapping("/geoserver/create-layer-group")
    public String createLayerGroup(@RequestParam String workspace, @RequestParam String layerGroupName, @RequestBody String layers, @RequestBody String styles) {
        return geoServerService.createLayerGroup(workspace, layerGroupName, layers, styles);
    }

    @PutMapping("/geoserver/edit-layer-group")
    public String editLayerGroup(@RequestParam String workspace, @RequestParam String layerGroupName, @RequestBody String updatedLayers, @RequestBody String updatedStyles) {
        return geoServerService.editLayerGroup(workspace, layerGroupName, updatedLayers, updatedStyles);
    }

    @DeleteMapping("/geoserver/delete-layer-group")
    public String deleteLayerGroup(@RequestParam String workspace, @RequestParam String layerGroupName) {
        return geoServerService.deleteLayerGroup(workspace, layerGroupName);
    }


    @GetMapping("/geoserver/get-layer-group")
    public String getLayerGroup(@RequestParam String workspace, @RequestParam String layerGroupName) {
        return geoServerService.getLayerGroup(workspace, layerGroupName);
    }

    @PostMapping("/geoserver/create-layer")
    public String createLayer(@RequestParam String workspace, @RequestParam String dataStore, @RequestParam String layerName, @RequestParam String nativeName, @RequestParam String srs) {
        return geoServerService.createLayer(workspace, dataStore, layerName, nativeName, srs);
    }


    @PutMapping("/geoserver/edit-layer")
    public String editLayer(@RequestParam String workspace, @RequestParam String layerName, @RequestParam String title, @RequestParam String abstractText) {
        return geoServerService.editLayer(workspace, layerName, title, abstractText);
    }

    @DeleteMapping("/geoserver/delete-layer")
    public String deleteLayer(@RequestParam String workspace, @RequestParam String layerName) {
        return geoServerService.deleteLayer(workspace, layerName);
    }

    @GetMapping("/geoserver/get-layer")
    public String getLayer(@RequestParam String workspace, @RequestParam String layerName) {
        return geoServerService.getLayer(workspace, layerName);
    }


    @PostMapping("/geoserver/add-attribute")
    public String addAttribute(@RequestParam String workspace, @RequestParam String dataStore, @RequestParam String featureType, @RequestParam String attributeName, @RequestParam String attributeType) {
        return geoServerService.addAttribute(workspace, dataStore, featureType, attributeName, attributeType);
    }

    @PutMapping("/geoserver/edit-attribute")
    public String editAttribute(@RequestParam String workspace, @RequestParam String dataStore, @RequestParam String featureType, @RequestParam String attributeName, @RequestParam String newAttributeType) {
        return geoServerService.editAttribute(workspace, dataStore, featureType, attributeName, newAttributeType);
    }

    @DeleteMapping("/geoserver/delete-attribute")
    public String deleteAttribute(@RequestParam String workspace, @RequestParam String dataStore, @RequestParam String featureType, @RequestParam String attributeName) {
        return geoServerService.deleteAttribute(workspace, dataStore, featureType, attributeName);
    }

    @GetMapping("/geoserver/get-attributes")
    public String getAttributes(@RequestParam String workspace, @RequestParam String dataStore, @RequestParam String featureType) {
        return geoServerService.getAttributes(workspace, dataStore, featureType);
    }

    @PostMapping("/geoserver/add-geometry")
    public String addGeometry(@RequestParam String workspace, @RequestParam String dataStore, @RequestParam String featureType, @RequestParam String geometryName, @RequestParam String geometryType, @RequestParam String coordinates) {
        return geoServerService.addGeometry(workspace, dataStore, featureType, geometryName, geometryType, coordinates);
    }

    @PutMapping("/geoserver/update-geometry")
    public String updateGeometry(@RequestParam String workspace, @RequestParam String dataStore, @RequestParam String featureType, @RequestParam String featureId, @RequestParam String geometryType, @RequestParam String newCoordinates) {
        return geoServerService.updateGeometry(workspace, dataStore, featureType, featureId, geometryType, newCoordinates);
    }


    @DeleteMapping("/geoserver/delete-geometry")
    public String deleteGeometry(@RequestParam String workspace, @RequestParam String dataStore, @RequestParam String featureType, @RequestParam String featureId) {
        return geoServerService.deleteGeometry(workspace, dataStore, featureType, featureId);
    }

    @GetMapping("/geoserver/get-geometry")
    public String getGeometry(@RequestParam String workspace, @RequestParam String dataStore, @RequestParam String featureType, @RequestParam String featureId) {
        return geoServerService.getGeometry(workspace, dataStore, featureType, featureId);
    }

















}