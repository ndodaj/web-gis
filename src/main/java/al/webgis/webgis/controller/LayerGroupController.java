package al.webgis.webgis.controller;

import al.webgis.webgis.model.CreateUpdateLayerGroupDTO;
import al.webgis.webgis.model.LayerGroupsDTO;
import al.webgis.webgis.service.GeoServerService;
import io.swagger.v3.oas.annotations.Operation;
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
@RequestMapping("/geoserver/layergroup")
@Tag(name = "Layer groups - Geo Server APIs", description = "Layer groups - Geo Server APIs")
@Slf4j
public class LayerGroupController {

    private final GeoServerService geoServerService;

    public LayerGroupController(GeoServerService geoServerService) {
        this.geoServerService = geoServerService;
    }

    @GetMapping("/layer-groups")
    @Operation(summary = "Retrieve all layer groups", description =  "Retrieve all layer groups" )
    public ResponseEntity<LayerGroupsDTO> getLayerGroups(@RequestParam(required = false) String workspaceName) {
        return ResponseEntity.ok(geoServerService.getAllLayerGroups(workspaceName));
    }

    @Operation(summary = "Retrieve layer group by name" , description = "Retrieve layer group by layerGroupName")
    @GetMapping("/layer-group")
    public String getLayerGroup(@RequestParam String layerGroupName, @RequestParam(required = false) String workspaceName) {
        return geoServerService.getLayerGroup(layerGroupName);
    }

    @PostMapping("/layer-group")
    public String createLayerGroup(@RequestBody CreateUpdateLayerGroupDTO createLayerGroupDTO, @RequestParam(required = false) String workspaceName) {
        return geoServerService.createLayerGroup(createLayerGroupDTO);
    }

    @PutMapping("/layer-group")
    public String updateLayerGroup(@RequestParam String layerGroupName,
                                   @RequestParam(required = false) String workspaceName,
                                   @RequestBody CreateUpdateLayerGroupDTO updatedLayerGroup) {
        return geoServerService.updatedLayerGroup(updatedLayerGroup, layerGroupName);
    }

    @DeleteMapping("/layer-group-ws")
    public String deleteLayerGroup( @RequestParam String layerGroupName, @RequestParam(required = false) String workspace) {
        return geoServerService.deleteLayerGroup(workspace, layerGroupName);
    }

    @DeleteMapping("/layer-group")
    public String deleteLayerGroup(@RequestParam String layerGroupName) {
        return geoServerService.deleteLayerGroup(layerGroupName);
    }



}
