package al.webgis.webgis.controller;


import al.webgis.webgis.service.GeoServerClient;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/geoserver/layers")
@Tag(name = "Layers - Geo Server APIs", description = "Layers - Geo Server APIs")
@Slf4j
public class LayerController {


    private final GeoServerClient geoServerClient;

    public LayerController(GeoServerClient geoServerClient) {
        this.geoServerClient = geoServerClient;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllLayers() {
        List<Map<String, Object>> layers = geoServerClient.fetchAllLayers();
        return ResponseEntity.ok(layers);
    }

    @GetMapping("/{layerName}")
    public ResponseEntity<Map<String, Object>> getLayerByName(@PathVariable String layerName) {
        Map<String, Object> layer = geoServerClient.fetchLayerByName(layerName);
        return ResponseEntity.ok(layer);
    }

    @PostMapping("/workspaces/{workspace}/datastores/{datastore}/featuretypes")
    public ResponseEntity<String> createLayer(
            @PathVariable String workspace,
            @PathVariable String datastore,
            @RequestBody Map<String, Object> request) {

        boolean isCreated = geoServerClient.createLayer(workspace, datastore, request);

        if (isCreated) {
            return ResponseEntity.status(HttpStatus.CREATED).body("Feature type created successfully!");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create feature type.");
        }
    }

    @PutMapping("/workspaces/{workspace}/layers/{layerName}")
    public ResponseEntity<String> updateLayer(
            @PathVariable String workspace,
            @PathVariable String layerName,
            @RequestBody Map<String, Object> request) {

        boolean isUpdated = geoServerClient.updateLayer(workspace, layerName, request);

        if (isUpdated) {
            return ResponseEntity.status(HttpStatus.OK).body("Layer updated successfully!");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update layer.");
        }
    }

    @DeleteMapping("/workspaces/{workspace}/layers/{layerName}")
    public ResponseEntity<String> deleteLayer(
            @PathVariable String workspace,
            @PathVariable String layerName) {

        boolean isDeleted = geoServerClient.deleteLayer(workspace, layerName);

        if (isDeleted) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Layer deleted successfully!");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete layer.");
        }
    }

}
