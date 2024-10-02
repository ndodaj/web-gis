package al.webgis.webgis.controller;

import al.webgis.webgis.model.layergroups.CreateUpdateLayerGroupDTO;
import al.webgis.webgis.model.layergroups.LayerGroupDetailsWrapper;
import al.webgis.webgis.model.layergroups.LayerGroupsList;
import al.webgis.webgis.service.LayerGroupService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
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

@RestController
@RequestMapping("/geoserver/layergroup")
@Tag(name = "Layer groups - Geo Server APIs", description = "Layer groups - Geo Server APIs")
@Slf4j
public class LayerGroupController {

    private final LayerGroupService layerGroupService;

    public LayerGroupController(LayerGroupService layerGroupService) {
        this.layerGroupService = layerGroupService;
    }

    @GetMapping("/layer-groups")
    @Operation(summary = "Retrieve all layer groups", description =  "Retrieve all layer groups" )
    public ResponseEntity<LayerGroupsList> getLayerGroups(@RequestParam(required = false) String workspaceName) {
        return ResponseEntity.ok(layerGroupService.getAllLayerGroups(workspaceName));
    }

    @Operation(summary = "Retrieve layer group by name" , description = "Retrieve layer group by layerGroupName")
    @GetMapping("/layer-group/{layerGroupName}")
    public ResponseEntity<LayerGroupDetailsWrapper> getLayerGroup(@PathVariable String layerGroupName,
                                                                  @RequestParam(required = false) String workspaceName) {
        return ResponseEntity.ok(layerGroupService.getLayerGroup(layerGroupName, workspaceName));
    }

    @PostMapping("/layer-group")
    public ResponseEntity<CreateUpdateLayerGroupDTO> createLayerGroup(
            @RequestBody CreateUpdateLayerGroupDTO createLayerGroupDTO,
            @RequestParam(required = false) String workspaceName) {
        return ResponseEntity.ok(layerGroupService.createLayerGroup(createLayerGroupDTO, workspaceName));
    }

    @PutMapping("/layer-group/{layerGroupName}")
    public String updateLayerGroup(@PathVariable String layerGroupName,
                                   @RequestParam(required = false) String workspaceName,
                                   @RequestBody CreateUpdateLayerGroupDTO updatedLayerGroup) {
        return layerGroupService.updatedLayerGroup(updatedLayerGroup, layerGroupName);
    }

    @DeleteMapping("/layer-group/{layerGroupName}")
    public String deleteLayerGroup(@PathVariable String layerGroupName,
                                   @RequestParam(required = false) String workspace) {
        return layerGroupService.deleteLayerGroup(workspace, layerGroupName);
    }



}
