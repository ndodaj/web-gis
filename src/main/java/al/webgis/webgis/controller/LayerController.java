package al.webgis.webgis.controller;

import al.webgis.webgis.model.layers.LayerWrapper;
import al.webgis.webgis.model.layers.LayersResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/geoserver/layers")
@Tag(name = "Layers - Geo Server APIs", description = "Layers - Geo Server APIs")
@Slf4j
public class LayerController {

    private final LayerService layerService;

    public LayerController(LayerService layerService) {
        this.layerService = layerService;
    }

    @GetMapping
    public ResponseEntity<LayersResponse> getLayers(@RequestParam(required = false) String workspaceName) {
        return ResponseEntity.ok(layerService.getAllLayers(workspaceName));
    }

    @PostMapping("/create-layer")
    public String createLayer(@RequestParam String workspace, @RequestParam String dataStore, @RequestParam String layerName, @RequestParam String nativeName, @RequestParam String srs) {
        return layerService.createLayer(workspace, dataStore, layerName, nativeName, srs);
    }


    @PutMapping("/edit-layer")
    public String editLayer(@RequestParam String workspace, @RequestParam String layerName, @RequestParam String title, @RequestParam String abstractText) {
        return layerService.editLayer(workspace, layerName, title, abstractText);
    }

    @DeleteMapping("/delete-layer")
    public ResponseEntity<Void> deleteLayer(@RequestParam String workspace, @RequestParam String layerName) {
        layerService.deleteLayer(workspace, layerName);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/get-layer")
    public String getLayer(@RequestParam String workspace, @RequestParam String layerName) {
        return layerService.getLayer(workspace, layerName);
    }
}
