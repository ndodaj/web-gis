package al.webgis.webgis.controller;

import al.webgis.webgis.model.CreateUpdateLayerGroupDTO;
import al.webgis.webgis.model.LayerGroupsDTO;
import al.webgis.webgis.service.GeoServerService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/geoserver/layergroup")
@Tag(name = "Layer group - Geo Server APIs", description = "Layer group - Geo Server APIs")
@Slf4j
public class LayerGroupController {

    private final GeoServerService geoServerService;

    public LayerGroupController(GeoServerService geoServerService) {
        this.geoServerService = geoServerService;
    }

    @PostMapping("/layer-group")
    public String createLayerGroup(@RequestBody CreateUpdateLayerGroupDTO createLayerGroupDTO) {
        return geoServerService.createLayerGroup(createLayerGroupDTO);
    }

    @PutMapping("/layer-group")
    public String updateLayerGroup(@RequestParam String layerGroupName,
                                   @RequestBody CreateUpdateLayerGroupDTO updatedLayerGroup) {
        return geoServerService.updatedLayerGroup(updatedLayerGroup, layerGroupName);
    }

    @DeleteMapping("/layer-group-ws")
    public String deleteLayerGroup(@RequestParam String workspace, @RequestParam String layerGroupName) {
        return geoServerService.deleteLayerGroup(workspace, layerGroupName);
    }

    @DeleteMapping("/layer-group")
    public String deleteLayerGroup(@RequestParam String layerGroupName) {
        return geoServerService.deleteLayerGroup(layerGroupName);
    }


    @GetMapping("/layer-group")
    public String getLayerGroup(@RequestParam String layerGroupName) {
        return geoServerService.getLayerGroup(layerGroupName);
    }

    @GetMapping("/layer-groups")
    public LayerGroupsDTO getLayerGroups() {
        return geoServerService.getAllLayerGroups();
    }
}
